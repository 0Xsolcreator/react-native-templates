import { Address, getAddressDecoder } from "@solana/kit"
import { Base64EncodedAddress } from "@solana-mobile/mobile-wallet-adapter-protocol"
import { transact, KitMobileWallet } from "@solana-mobile/mobile-wallet-adapter-protocol-kit"
import { toUint8Array } from "js-base64"

export interface WalletAuthResult {
  authToken: string
  address: string
  walletType: string
}

const MESSAGE = "Solana Ignite Starter"
const MESSAGE_BUFFER = new Uint8Array(MESSAGE.split("").map((c) => c.charCodeAt(0)))

function getPublicKeyFromAddress(base64Address: Base64EncodedAddress): Address {
  const publicKeyByteArray = toUint8Array(base64Address)
  const addressDecoder = getAddressDecoder()
  return addressDecoder.decode(publicKeyByteArray)
}

export const connectWallet = async (): Promise<WalletAuthResult> => {
  console.log("info: Connect Wallet Triggered")

  try {
    const walletAuthorizationResult = await transact(async (wallet: KitMobileWallet) => {
      console.log("info: Executing transact method")

      try {
        const authorizationResult = await wallet.authorize({
          chain: "solana:devnet",
          identity: {
            name: "Solana Example App",
          },
          sign_in_payload: {
            domain: "solana.com",
            statement: "Sign in to Solana Starter",
            uri: "https://solana.com"
          }
        })
        console.log("info: Authorization Result", authorizationResult)
        return authorizationResult
      } catch (err: any) {
        console.error("error: Authorization Error", err)
        console.error("Error details:", {
          message: err.message,
          code: err.code,
          stack: err.stack,
        })
        throw err
      }
    })

    // Decode base64 address to get the actual Solana address
    const decodedAddress = getPublicKeyFromAddress(walletAuthorizationResult.accounts[0].address)

    const result: WalletAuthResult = {
      authToken: walletAuthorizationResult.auth_token,
      address: decodedAddress,
      walletType: walletAuthorizationResult.accounts[0].label || "Unknown",
    }

    console.log("info: Transact method completed")
    return result
  } catch (err: any) {
    console.error("error: Transact method error", err)
    console.error("Error details:", {
      message: err.message,
      code: err.code,
      stack: err.stack,
    })
    throw err
  }
}

export const disconnectWallet = async (authToken: string): Promise<void> => {
  if (!authToken) {
    console.error("error: No auth token found")
    throw new Error("No auth token provided")
  }

  try {
    await transact(async (wallet: KitMobileWallet) => {
      await wallet.deauthorize({ auth_token: authToken })
    })
    console.log("info: Wallet Disconnected")
  } catch (error) {
    console.error("error: Disconnect wallet error", error)
    throw error
  }
}

export const signMessage = async (
  authToken: string,
  address: string,
): Promise<{ signatures: Uint8Array[] }> => {
  if (!authToken) {
    console.error("error: No auth token found")
    throw new Error("No auth token provided")
  }

  if (!address) {
    console.error("error: No address found")
    throw new Error("No address provided")
  }

  try {
    const result = await transact(async (wallet: KitMobileWallet) => {
      console.log("info: re-authorizing with auth token...")

      const authorizationResult = await wallet.authorize({
        chain: "solana:devnet",
        identity: {
          name: "Solana Example App",
        },
        auth_token: authToken,
      })

      const signature = await wallet.signMessages({
        addresses: [address],
        payloads: [MESSAGE_BUFFER],
      })
      console.log("info: Signed Message", signature)
      return signature
    })

    return { signatures: result }
  } catch (error: any) {
    console.error("error: Sign Message Error", error)
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      stack: error.stack,
    })
    throw error
  }
}
