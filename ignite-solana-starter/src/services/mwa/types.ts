export type AuthorizeInput = Readonly<{
    chain: `solana:${string}`;
    identity: Readonly<{
        name?: string;
        uri?: `https://${string}`;
        icon?: string;
    }>;
    auth_token?: string;
}>;

