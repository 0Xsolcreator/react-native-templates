import { transact, Web3MobileWallet } from "@solana-mobile/mobile-wallet-adapter-protocol-web3js"

import { base64ToUint8Array, toBase58 } from "./bufferUtils"

export interface WalletAuthResult {
  authToken: string
  address: string
  walletType: string
}

const MESSAGE = "Solana Ignite Starter"
const MESSAGE_BUFFER = new Uint8Array(MESSAGE.split("").map((c) => c.charCodeAt(0)))

export const connectWallet = async (): Promise<WalletAuthResult> => {
  try {
    const walletAuthorizationResult = await transact(async (wallet: Web3MobileWallet) => {
      try {
        const authorizationResult = await wallet.authorize({
          chain: "solana:devnet",
          identity: {
            name: "Solana Example App",
          },
        })
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
    const decodedAddress = toBase58(
      base64ToUint8Array(walletAuthorizationResult.accounts[0].address),
    )
    console.log("info: Decoded Address", decodedAddress)

    const result: WalletAuthResult = {
      authToken: walletAuthorizationResult.auth_token,
      address: decodedAddress,
      walletType: walletAuthorizationResult.accounts[0].label || "Unknown",
    }
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
    await transact(async (wallet: Web3MobileWallet) => {
      await wallet.deauthorize({ auth_token: authToken })
    })
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
    const result = await transact(async (wallet: Web3MobileWallet) => {
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
