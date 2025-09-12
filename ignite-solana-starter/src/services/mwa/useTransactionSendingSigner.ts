import { Address, Transaction, TransactionSendingSigner, TransactionSendingSignerConfig } from "@solana/kit"
import { useSignAndSendTransaction } from "./useSignAndSendTransaction"
import { AuthorizeInput } from "./types"

export function useTransactionSendingSigner(authInput: AuthorizeInput, signerAddress: Address): TransactionSendingSigner {
    const signAndSendTransaction = useSignAndSendTransaction(authInput)

    return {
        address: signerAddress,
        signAndSendTransactions: async (transactions: Transaction[], config?: TransactionSendingSignerConfig) => {
            return (await signAndSendTransaction({ transactions }, config)).signatures;
        }
    }
}