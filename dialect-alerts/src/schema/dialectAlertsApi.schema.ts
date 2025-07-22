import * as z from "zod"

export const PrepareAuthenticationResponseSchema = z.object({ message: z.string() })
export const PrepareAuthenticationRequestSchema = z.object({ walletAddress: z.string() })
export const VerifyAndGetJwtResponseSchema = z.object({ token: z.string() })
export const VerifyAndGetJwtRequestSchema = z.object({
  message: z.string(),
  signature: z.string(),
})

export type PrepareAuthenticationResponse = z.infer<typeof PrepareAuthenticationResponseSchema>
export type PrepareAuthenticationRequest = z.infer<typeof PrepareAuthenticationRequestSchema>
export type VerifyAndGetJwtResponse = z.infer<typeof VerifyAndGetJwtResponseSchema>
export type VerifyAndGetJwtRequest = z.infer<typeof VerifyAndGetJwtRequestSchema>
