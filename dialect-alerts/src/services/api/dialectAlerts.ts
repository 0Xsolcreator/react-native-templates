import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

import {
  GetAppsResponse,
  GetAppsResponseSchema,
  GetNotificationsResponse,
  GetNotificationsResponseSchema,
  PrepareAuthenticationRequest,
  PrepareAuthenticationResponse,
  PrepareAuthenticationResponseSchema,
  SubscribeToAppRequest,
  UnsubscribeFromAppRequest,
  VerifyAndGetJwtRequest,
  VerifyAndGetJwtResponse,
  VerifyAndGetJwtResponseSchema,
} from "@/schema/dialectAlertsApi.schema"
import { store } from "@/store/store"

export const dialectAlertsApi = createApi({
  reducerPath: "dialectAlertsApi",
  tagTypes: ["Apps", "Notifications"],
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

    getApps: builder.query<GetAppsResponse, void>({
      query: () => ({
        url: "/apps",
        method: "GET",
      }),
      providesTags: ["Apps"],
      transformResponse: (response: any) => {
        const result = GetAppsResponseSchema.safeParse(response)
        if (!result.success) {
          throw new Error("Invalid response format")
        }
        return result.data
      },
    }),

    subscribeToApp: builder.mutation<void, SubscribeToAppRequest>({
      query: (request) => ({
        url: "/subscribe",
        method: "POST",
        body: request,
      }),
      invalidatesTags: ["Apps"],
    }),

    unsubscribeFromApp: builder.mutation<void, UnsubscribeFromAppRequest>({
      query: (request) => ({
        url: "/unsubscribe",
        method: "POST",
        body: request,
      }),
      invalidatesTags: ["Apps"],
      async onQueryStarted({ appId }, { dispatch, queryFulfilled }) {
        // Optimistically update the cache
        const patchResult = dispatch(
          dialectAlertsApi.util.updateQueryData("getApps", undefined, (draft) => {
            const app = draft.apps.find((app) => app.id === appId)
            if (app) {
              app.subscribed = false
            }
          }),
        )
        try {
          await queryFulfilled
        } catch {
          // Undo the optimistic update if the request fails
          patchResult.undo()
        }
      },
    }),

    getNotifications: builder.query<GetNotificationsResponse, string | null>({
      query: (cursor) => ({
        url: "/history",
        method: "GET",
        params: cursor
          ? { appId: process.env.EXPO_PUBLIC_DIALECT_APP_ID, cursor: cursor }
          : { appId: process.env.EXPO_PUBLIC_DIALECT_APP_ID },
      }),
      providesTags: ["Notifications"],
      transformResponse: (response: any) => {
        const result = GetNotificationsResponseSchema.safeParse(response)
        if (!result.success) {
          throw new Error("Invalid response format")
        }
        return result.data
      },
    }),

    clearNotifications: builder.mutation<void, void>({
      query: () => ({
        url: "/history/clear",
        method: "POST",
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
})

export const {
  usePrepareAuthenticationMutation,
  useVerifyAndGetJwtMutation,
  useGetAppsQuery,
  useSubscribeToAppMutation,
  useUnsubscribeFromAppMutation,
  useGetNotificationsQuery,
  useClearNotificationsMutation,
} = dialectAlertsApi
