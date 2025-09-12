import type { KitMobileWallet } from '@solana-mobile/mobile-wallet-adapter-protocol-kit';
import { transact } from '@solana-mobile/mobile-wallet-adapter-protocol-kit';
import { useCallback } from 'react';

type Input = Readonly<{
    auth_token: string;
}>;

type Output = void;

export function useDisconnect(): (input: Input) => Promise<Output> {
    return useCallback(async (input: Input): Promise<Output> => {
        await transact(async (wallet: KitMobileWallet): Promise<void> => {
            await wallet.deauthorize({ auth_token: input.auth_token });
        });
    }, []);
}