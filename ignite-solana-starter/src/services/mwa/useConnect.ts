import type { KitMobileWallet } from "@solana-mobile/mobile-wallet-adapter-protocol-kit"
import { transact } from "@solana-mobile/mobile-wallet-adapter-protocol-kit"
import { useCallback } from "react"
import { AuthorizeInput } from "./types"
import { Account, AuthToken, SignInResult } from "@solana-mobile/mobile-wallet-adapter-protocol"

type Input = Readonly<Omit<AuthorizeInput, "auth_token">>

type Output = Readonly<{
  accounts: Account[]
  auth_token: AuthToken
  wallet_uri_base: string
}>

export function useConnect(): (input: Input) => Promise<Output> {
  return useCallback(async (input: Input): Promise<Output> => {
    return await transact(async (wallet: KitMobileWallet): Promise<Output> => {
      const connectWallet = await wallet.authorize(input)
      return connectWallet
    })
  }, [])
}

