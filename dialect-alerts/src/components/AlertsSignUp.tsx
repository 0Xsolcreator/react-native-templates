import { View, ViewStyle, TextStyle } from "react-native"
import { useRouter } from "expo-router"
import bs58 from "bs58"
import { toast } from "sonner-native"

import { Button } from "@/components/Button"
import { Text } from "@/components/Text"
import {
  usePrepareAuthenticationMutation,
  useVerifyAndGetJwtMutation,
} from "@/services/api/dialectAlerts"
import { setDialectJwt } from "@/store/features/authSlice"
import { useAppDispatch, useAppSelector } from "@/store/store"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"
import { signMessage } from "@/utils/walletUtils"

export const AlertsSignUp = () => {
  const { themed } = useAppTheme()
  const authDetails = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const router = useRouter()

  const [prepareAuthentication] = usePrepareAuthenticationMutation()
  const [verifyAndGetJwt] = useVerifyAndGetJwtMutation()

  const dialectAlertsManageAction = async (walletAddress: string) => {
    if (!authDetails.authToken || !authDetails.address) {
      toast.error("No auth token or address found")
      console.error("error: No auth token or address found")
      return
    }

    if (authDetails.dialectJwt) {
      router.push("/home/manage-alerts")
      return
    }

    try {
      const { message } = await prepareAuthentication({ walletAddress }).unwrap()
      const { signatures } = await signMessage(authDetails.authToken, authDetails.address, message)

      const signatureBase58 = bs58.encode(signatures[0])

      const { token } = await verifyAndGetJwt({
        message: message,
        signature: signatureBase58,
      }).unwrap()

      dispatch(setDialectJwt(token))
      toast.success("Successfully signed up for Alerts")
    } catch (error) {
      console.error("error: Dialect Alerts Authentication Error", error)
      toast.error("Error Connecting to Dialect")
    }
  }

  return (
    <View style={themed($toggleThemeContainer)}>
      <Text style={themed($toggleThemeText)}>Dialect Alerts</Text>
      <Button
        onPress={() => dialectAlertsManageAction(authDetails.address || "")}
        text={authDetails.dialectJwt ? "Manage" : "Sign Up"}
        textStyle={themed($connectButtonText)}
        style={authDetails.dialectJwt ? themed($manageButton) : themed($connectButton)}
      />
    </View>
  )
}

const $toggleThemeContainer: ThemedStyle<ViewStyle> = (theme) => ({
  backgroundColor: theme.colors.palette.secondary500,
  borderRadius: 16,
  paddingHorizontal: 12,
  paddingVertical: 14,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
})

const $toggleThemeText: ThemedStyle<TextStyle> = (theme) => ({
  color: theme.colors.palette.neutral900,
  fontSize: 16,
  fontWeight: "bold",
})

const $connectButton: ThemedStyle<ViewStyle> = (theme) => ({
  backgroundColor: theme.colors.palette.neutral900,
  borderRadius: 14,
  paddingHorizontal: 24,
  paddingVertical: 12,
  alignItems: "center",
  justifyContent: "center",
})

const $connectButtonText: ThemedStyle<TextStyle> = (theme) => ({
  color: theme.colors.palette.neutral100,
  fontSize: 16,
  fontFamily: theme.typography.primary.bold,
})

const $manageButton: ThemedStyle<ViewStyle> = (theme) => ({
  backgroundColor: theme.colors.palette.primary600,
  borderRadius: 14,
  paddingHorizontal: 24,
  paddingVertical: 12,
  alignItems: "center",
  justifyContent: "center",
})
