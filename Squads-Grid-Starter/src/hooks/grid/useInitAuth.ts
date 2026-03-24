import { gridClient } from "@/services/grid"
import { GridError } from "@sqds/grid-react-native"
import { useCallback, useState } from "react"

export default function useInitAuth() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<GridError | null>(null)

  const initAuth = useCallback(async (email: string) => {
    setLoading(true)
    setError(null)
    try {
      return await gridClient.initAuth({ email: email })
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
    initAuth,
    loading,
    error,
  }
}
