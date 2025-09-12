import { Rpc, RpcSubscriptions, SolanaRpcApi, SolanaRpcSubscriptionsApi, createSolanaRpc, createSolanaRpcSubscriptions, sendAndConfirmTransactionFactory } from '@solana/kit';
import { createContext, useContext, useMemo, ReactNode } from 'react';

export type Client = {
    rpc: Rpc<SolanaRpcApi>;
    rpcSubscriptions: RpcSubscriptions<SolanaRpcSubscriptionsApi>;
};

export interface ClientContextValue {
    rpc: Rpc<SolanaRpcApi>
    rpcSubscriptions: RpcSubscriptions<SolanaRpcSubscriptionsApi>
    sendAndConfirmTransaction: ReturnType<typeof sendAndConfirmTransactionFactory>
}

export interface KitClientProviderProps {
    children: ReactNode;
    rpcEndpoint?: string;
    wsEndpoint?: string;
}

const KitClientContext = createContext<ClientContextValue | undefined>(undefined);

function createClient(rpcEndpoint = 'http://127.0.0.1:8899', wsEndpoint = 'ws://127.0.0.1:8900'): Client {
    return {
        rpc: createSolanaRpc(rpcEndpoint),
        rpcSubscriptions: createSolanaRpcSubscriptions(wsEndpoint),
    };
}

export function KitClientProvider({ 
    children, 
    rpcEndpoint = 'https://devnet.helius-rpc.com/?api-key=f831b443-8520-4f01-8228-59af9bb829b7', 
    wsEndpoint = 'wss://devnet.helius-rpc.com/?api-key=f831b443-8520-4f01-8228-59af9bb829b7' 
}: KitClientProviderProps) {
    const client = useMemo(() => createClient(rpcEndpoint, wsEndpoint), [rpcEndpoint, wsEndpoint]);
    
    const contextValue = useMemo(() => ({
        rpc: client.rpc,
        rpcSubscriptions: client.rpcSubscriptions,
        sendAndConfirmTransaction: sendAndConfirmTransactionFactory({
            rpc: client.rpc, 
            rpcSubscriptions: client.rpcSubscriptions}),
    }), [client]);

    return (
        <KitClientContext.Provider value={contextValue}>
            {children}
        </KitClientContext.Provider>
    );
}

export function useKitClient(): ClientContextValue {
    const context = useContext(KitClientContext);
    if (!context) {
        throw new Error('useKitClient must be used within a KitClientProvider');
    }
    return context;
}