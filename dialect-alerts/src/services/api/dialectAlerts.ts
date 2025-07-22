import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

import {
  PrepareAuthenticationRequest,
  PrepareAuthenticationResponse,
  PrepareAuthenticationResponseSchema,
  VerifyAndGetJwtRequest,
  VerifyAndGetJwtResponse,
  VerifyAndGetJwtResponseSchema,
} from "@/schema/dialectAlertsApi.schema"
import { store } from "@/store/store"

export const dialectAlertsApi = createApi({
  reducerPath: "dialectAlertsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://alerts-api.dial.to/v2",
    prepareHeaders: (headers) => {
      const dialectJwt = store.getState().auth.dialectJwt
      const dialectClientKey = process.env.EXPO_PUBLIC_DIALECT_CLIENT_KEY

      if (dialectJwt && dialectClientKey) {
        headers.set("Authorization", `Bearer ${dialectJwt}`)
        headers.set("X-Dialect-Client-Key", dialectClientKey)
      } else if (dialectClientKey) {
        headers.set("X-Dialect-Client-Key", dialectClientKey)
        headers.set("Content-Type", "application/json")
      }
      return headers
    },
  }),
  endpoints: (builder) => ({
    prepareAuthentication: builder.mutation<
      PrepareAuthenticationResponse,
      PrepareAuthenticationRequest
    >({
      query: (request) => ({
        url: "/auth/solana/prepare",
        method: "POST",
        body: request,
      }),
      transformResponse: (response: any) => {
        const result = PrepareAuthenticationResponseSchema.safeParse(response)
        if (!result.success) {
          throw new Error("Invalid response format")
        }
        return result.data
      },
    }),

    verifyAndGetJwt: builder.mutation<VerifyAndGetJwtResponse, VerifyAndGetJwtRequest>({
      query: (request) => ({
        url: "/auth/solana/verify",
        method: "POST",
        body: request,
      }),
      transformResponse: (response: any) => {
        const result = VerifyAndGetJwtResponseSchema.safeParse(response)
        if (!result.success) {
          throw new Error("Invalid response format")
        }
        return result.data
      },
    }),
  }),
})

export const { usePrepareAuthenticationMutation, useVerifyAndGetJwtMutation } = dialectAlertsApi
