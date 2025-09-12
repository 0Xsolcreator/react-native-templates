import type { KitMobileWallet } from '@solana-mobile/mobile-wallet-adapter-protocol-kit';
import { transact } from '@solana-mobile/mobile-wallet-adapter-protocol-kit';
import type { SignatureBytes, TransactionSendingSignerConfig } from '@solana/kit';
import type { Transaction } from '@solana/transactions';
import { useCallback } from 'react';
import { getAbortablePromise } from '@solana/promises';

import type { AuthorizeInput } from './types';

type Input = Readonly<{
    transactions: readonly Transaction[];
    options?: Readonly<{
        minContextSlot?: number;
        commitment?: string;
        skipPreflight?: boolean;
        maxRetries?: number;
        waitForCommitmentToSendNextTransaction?: boolean;
    }>;
}>;

type Output = Readonly<{
    signatures: readonly SignatureBytes[];
    auth_token: string;
}>;

export function useSignAndSendTransaction(authInput: AuthorizeInput): (input: Input, config?: TransactionSendingSignerConfig) => Promise<Output> {
    return useCallback(async (input: Input, config?: TransactionSendingSignerConfig): Promise<Output> => {
        const { abortSignal } = config ?? {};

        abortSignal?.throwIfAborted();

        const promise = transact(async (wallet: KitMobileWallet): Promise<Output> => {
            const authResult = await wallet.authorize(authInput);
            
            const walletInput = {
                transactions: [...input.transactions],
                ...input.options,
            };
            
            const signatures = await wallet.signAndSendTransactions(walletInput);
            return { signatures, auth_token: authResult.auth_token };
        });

        return getAbortablePromise(promise, abortSignal);
    }, [authInput]);
}