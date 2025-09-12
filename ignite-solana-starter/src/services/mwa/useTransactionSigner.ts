import { Address, Transaction, TransactionModifyingSignerConfig, TransactionSigner } from "@solana/kit";
import { useSignTransaction } from "./useSignTransaction";
import { AuthorizeInput } from "./types";

export function useTransactionSigner(authInput: AuthorizeInput, signerAddress: Address): TransactionSigner {
    const signTransaction = useSignTransaction(authInput)

    return {
        address: signerAddress,
        modifyAndSignTransactions: async <T extends Transaction>(transactions: readonly T[], config?: TransactionModifyingSignerConfig) => {
            const result = await signTransaction([...transactions], config);
            return result.transactions as readonly T[];
        }
    }
}