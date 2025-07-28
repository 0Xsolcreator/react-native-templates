import * as z from "zod"

export const PrepareAuthenticationResponseSchema = z.object({ message: z.string() })
export const PrepareAuthenticationRequestSchema = z.object({ walletAddress: z.string() })
export const VerifyAndGetJwtResponseSchema = z.object({ token: z.string() })
export const VerifyAndGetJwtRequestSchema = z.object({
  message: z.string(),
  signature: z.string(),
})
export const AppSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  icon: z.string().url(),
  subscribed: z.boolean(),
  topics: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      description: z.string().optional(),
      slug: z.string(),
      subscribed: z.boolean(),
    }),
  ),
  channels: z.array(
    z.object({
      channel: z.enum(["IN_APP", "EMAIL", "TELEGRAM"]),
      subscribed: z.boolean(),
    }),
  ),
})
export const GetAppsResponseSchema = z.object({
  apps: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      icon: z.string().url(),
      subscribed: z.boolean(),
      topics: z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          description: z.string().optional(),
          slug: z.string(),
          subscribed: z.boolean(),
        }),
      ),
      channels: z.array(
        z.object({
          channel: z.enum(["IN_APP", "EMAIL", "TELEGRAM"]),
          subscribed: z.boolean(),
        }),
      ),
    }),
  ),
})
export const SubscribeToAppRequestSchema = z.object({
  appId: z.string(),
  channel: z.enum(["IN_APP", "EMAIL", "TELEGRAM"]),
})
export const UnsubscribeFromAppRequestSchema = z.object({
  appId: z.string(),
  channel: z.enum(["IN_APP", "EMAIL", "TELEGRAM"]),
})
export const GetNotificationsResponseSchema = z.object({
  alerts: z.array(
    z.object({
      id: z.string(),
      timestamp: z.string().datetime(),
      title: z.string().min(1).max(100),
      body: z.string().min(1).max(500),
      image: z.url().optional(),
      actions: z
        .array(
          z.object({
            type: z.literal("link"),
            label: z.string().min(1).max(50),
            url: z.url().min(1),
          }),
        )
        .optional(),
      topic: z
        .object({
          id: z.uuid().min(1),
          name: z.string().min(1),
          slug: z.string().min(1),
        })
        .optional(),
      app: z
        .object({
          id: z.string(),
          name: z.string().min(1),
          icon: z.url(),
        })
        .optional(),
    }),
  ),
  summary: z.object({
    unreadCount: z.number(),
    lastRead: z.object({
      timestamp: z.iso.datetime(),
    }),
  }),
  limit: z.number().min(1).max(20).default(10),
  cursor: z.string().optional(),
})

export type PrepareAuthenticationResponse = z.infer<typeof PrepareAuthenticationResponseSchema>
export type PrepareAuthenticationRequest = z.infer<typeof PrepareAuthenticationRequestSchema>
export type VerifyAndGetJwtResponse = z.infer<typeof VerifyAndGetJwtResponseSchema>
export type VerifyAndGetJwtRequest = z.infer<typeof VerifyAndGetJwtRequestSchema>
export type App = z.infer<typeof AppSchema>
export type GetAppsResponse = z.infer<typeof GetAppsResponseSchema>
export type GetNotificationsResponse = z.infer<typeof GetNotificationsResponseSchema>
export type SubscribeToAppRequest = z.infer<typeof SubscribeToAppRequestSchema>
export type UnsubscribeFromAppRequest = z.infer<typeof UnsubscribeFromAppRequestSchema>
