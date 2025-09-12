import { Address, MessageModifyingSigner, MessageModifyingSignerConfig, SignableMessage, SignatureBytes } from "@solana/kit";
import { useSignMessage } from "./useSignMessage";
import { AuthorizeInput } from "./types";

export function useMessageSigner(authInput: AuthorizeInput, signerAddress: Address): MessageModifyingSigner {
    const signMessage = useSignMessage(authInput)

    return {
        address: signerAddress,
        modifyAndSignMessages: async (messages: readonly SignableMessage[], config?: MessageModifyingSignerConfig) => {
            const { abortSignal } = config ?? {};

            abortSignal?.throwIfAborted();

            const addresses = [signerAddress];
            const payloads = messages.map((message) => message.content);
            
            const result = await signMessage({
                addresses: addresses,
                payloads,
            }, abortSignal);

            return messages.map((message, index) => ({
                content: message.content,
                signatures: {
                    [signerAddress]: result.signed_payloads[index] as SignatureBytes
                } as Readonly<Record<Address, SignatureBytes>>
            })) as readonly SignableMessage[];
        }
    }
}