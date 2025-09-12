import { Base64EncodedAddress } from "@solana-mobile/mobile-wallet-adapter-protocol";
import { KitMobileWallet, transact } from "@solana-mobile/mobile-wallet-adapter-protocol-kit";
import { Address, getAddressDecoder } from "@solana/kit";
import type {
    SolanaSignInInput,
    SolanaSignInOutput,
} from "@solana/wallet-standard-features";
import { verifySignIn } from "@solana/wallet-standard-util";
import { useCallback } from "react";
import { toUint8Array } from "js-base64";

type input = Readonly<{
    cluster: `solana:${string}`;
    identity: Readonly<{
        name?: string;
        uri?: `https://${string}`;
        icon?: string;
    }>;
    sign_in_payload: Readonly<{
        domain: string;
        statement: string;
        uri: `https://${string}`;
    }>;
}>;


type Output = (SolanaSignInOutput & Readonly<{ auth_token: string }>) | null;


export function useSignIn(): (input: input) => Promise<Output> {
    return useCallback(async (input: input): Promise<Output> => {
        return await transact(async (wallet: KitMobileWallet) => {
            const signIn = await wallet.authorize({
                chain: input.cluster,
                identity: input.identity,
                sign_in_payload: input.sign_in_payload,
            })

            if (!signIn.sign_in_result) {
                return null
            }
            
            const serialisedInput = createSignInInput(input.sign_in_payload)
            const serialisedOutput = transformSignInResult(signIn.sign_in_result, input.cluster)
            return {...serialisedOutput, auth_token: signIn.auth_token}
            
            // const isValid = verifySignIn(serialisedInput, serialisedOutput)
            // console.log("info: verification result", isValid)
            // return isValid ? {...serialisedOutput, auth_token: signIn.auth_token} : null
        })
    }, [])
} 

function createSignInInput(payload: input['sign_in_payload']): SolanaSignInInput {
    return {
        domain: payload.domain,
        statement: payload.statement,
        uri: payload.uri,
    }
}

function transformSignInResult(
    result: NonNullable<Awaited<ReturnType<KitMobileWallet['authorize']>>['sign_in_result']>,
    cluster: `solana:${string}`
): SolanaSignInOutput {
    const decodedAddress = getPublicKeyFromAddress(result.address);
    
    return {
        account: {
            publicKey: toUint8Array(result.address),
            address: decodedAddress,
            chains: [cluster],
            features: []
        },
        signature: toUint8Array(result.signature),
        signedMessage: toUint8Array(result.signed_message),
    }
}

function getPublicKeyFromAddress(base64Address: Base64EncodedAddress): Address {
    const publicKeyByteArray = toUint8Array(base64Address)
    const addressDecoder = getAddressDecoder()
    return addressDecoder.decode(publicKeyByteArray)
  }