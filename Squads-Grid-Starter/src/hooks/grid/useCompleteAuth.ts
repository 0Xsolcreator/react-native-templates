import { gridClient } from "@/services/grid"
import { load } from "@/utils/storage"
import { GridError, SessionSecrets } from "@sqds/grid-react-native"
import { useCallback, useState } from "react"

export default function useCompleteAuth() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<GridError | null>(null)

  const completeAuth = useCallback(async (email: string, otp: string) => {
    setLoading(true)
    setError(null)
    try {
      const sessionSecrets: SessionSecrets = load("sessionSecrets")!
      return await gridClient.completeAuth({
        otpCode: otp,
        user: { email },
        sessionSecrets,
      })
    } catch (error) {
      const mappedError =
        error instanceof GridError ? error : new GridError("Unknown error", "UNKNOWN_ERROR")
      setError(mappedError)
      throw mappedError
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    completeAuth,
    loading,
    error,
  }
}
