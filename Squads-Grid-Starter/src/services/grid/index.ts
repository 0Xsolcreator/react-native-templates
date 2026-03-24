import { load } from "@/utils/storage"
import { GridClient, SessionSecrets } from "@sqds/grid-react-native"
import { se } from "date-fns/locale"

export const gridClient = new GridClient({
  environment: process.env.NODE_ENV === "production" ? "production" : "sandbox",
  apiKey: process.env.GRID_API_KEY!,
})

// export const withRetry = async (fn) => {
//   const sessionSecrets: SessionSecrets = load("sessionSecrets")!

//   try {
//     return fn(sessionSecrets)
//   } catch (e) {
//     const refreshed = await gridClient.refreshSession({
//       encryptionPublicKey: sessionSecrets[0].publicKey,
//     })
//   }
// }
