import type { KitMobileWallet } from '@solana-mobile/mobile-wallet-adapter-protocol-kit';
import { transact } from '@solana-mobile/mobile-wallet-adapter-protocol-kit';
import { useCallback } from 'react';
import { getAbortablePromise } from '@solana/promises';

import type { AuthorizeInput } from './types';

type Input = Readonly<{
    addresses: readonly string[];
    payloads: readonly Uint8Array[];
}>;

type Output = Readonly<{
    signed_payloads: readonly Uint8Array[];
    auth_token: string;
}>;


export function useSignMessage(authInput: AuthorizeInput): 
    (input: Input, abortSignal?: AbortSignal) => Promise<Output> {
    return useCallback(async (input: Input, abortSignal?: AbortSignal): Promise<Output> => {
        const promise = transact(async (wallet: KitMobileWallet): Promise<Output> => {
            const authResult = await wallet.authorize(authInput);
            const signedMessages = await wallet.signMessages({
                addresses: [...input.addresses],
                payloads: [...input.payloads],
            });
            return {
                signed_payloads: signedMessages,
                auth_token: authResult.auth_token,
            };
        });

        return getAbortablePromise(promise, abortSignal);
    }, [authInput]);
}