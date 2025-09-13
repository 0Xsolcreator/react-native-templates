import { KitMobileWallet, transact } from "@solana-mobile/mobile-wallet-adapter-protocol-kit";
import { TransactionModifyingSignerConfig } from "@solana/kit";
import { Transaction } from "@solana/transactions";
import { useCallback } from "react";
import { getAbortablePromise } from "@solana/promises";
import { AuthorizeInput } from "./types";

type SignTransactionInput = Transaction[]

type SignTransactionOutput = {
    transactions: Transaction[],
    auth_token: string
}

export function useSignTransaction(authInput: AuthorizeInput): (input: SignTransactionInput, config?: TransactionModifyingSignerConfig) => Promise<SignTransactionOutput> {
    return useCallback(async (input: SignTransactionInput, config?: TransactionModifyingSignerConfig) => {
        const { abortSignal } = config ?? {};

        abortSignal?.throwIfAborted();

        const promise = transact(async (wallet: KitMobileWallet) => {
            const authResult = await wallet.authorize(authInput)
            const signTransaction = await wallet.signTransactions({transactions: input})
            
            return {transactions: signTransaction, auth_token: authResult.auth_token}
        })

        return getAbortablePromise(promise, abortSignal);
    },[])
}