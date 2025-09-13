import { Address, Transaction, TransactionModifyingSignerConfig, TransactionSigner, TransactionWithLifetime } from "@solana/kit";
import { useSignTransaction } from "./useSignTransaction";
import { AuthorizeInput } from "./types";

export function useTransactionSigner(authInput: AuthorizeInput, signerAddress: Address): TransactionSigner {
    const signTransaction = useSignTransaction(authInput)

    return {
        address: signerAddress,
        modifyAndSignTransactions: async <T extends Transaction>(transactions: readonly T[], config?: TransactionModifyingSignerConfig): Promise<readonly T[]> => {
            // Validate for Lifetime Constraint 
            if (!allTransactionsHaveLifetimeConstraint(transactions)) {
                throw new Error('All transactions must have lifetimeConstraint property');
            }

            const result = await signTransaction([...transactions], config);
            
            // Map
            const signedTransactionsWithLifetime = result.transactions.map((signedTx, index) => {
                const originalTx = transactions[index] as Transaction & TransactionWithLifetime;
                return mergeSignedTransaction(originalTx, signedTx);
            });

            return signedTransactionsWithLifetime as readonly T[];
        }
    }
}

function hasLifetimeConstraint(transaction: Transaction): transaction is Transaction & TransactionWithLifetime {
    return 'lifetimeConstraint' in transaction;
}

function allTransactionsHaveLifetimeConstraint<T extends Transaction>(transactions: readonly T[]): transactions is readonly (T & TransactionWithLifetime)[] {
    return transactions.every(hasLifetimeConstraint);
}

function mergeSignedTransaction<T extends (Transaction & TransactionWithLifetime)>(
    originalTx: T, 
    signedTx: Transaction
): T {
    const merged = Object.assign({}, originalTx, signedTx);
    return merged as T;
}