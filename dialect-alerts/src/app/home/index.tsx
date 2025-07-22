import { View, Image } from "react-native"
import type { ViewStyle, TextStyle } from "react-native"
import bs58 from "bs58"
import { toast } from "sonner-native"

import { Button } from "@/components/Button"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { ToggleTheme } from "@/components/ThemeToggle"
import { WalletDetails } from "@/components/WalletDetails"
import {
  usePrepareAuthenticationMutation,
  useVerifyAndGetJwtMutation,
} from "@/services/api/dialectAlerts"
import { clearAuthDetails, setDialectJwt } from "@/store/features/authSlice"
import { useAppDispatch, useAppSelector } from "@/store/store"
import { useAppTheme } from "@/theme/context"
import { $styles } from "@/theme/styles"
import type { ThemedStyle } from "@/theme/types"
import { disconnectWallet, signMessage } from "@/utils/walletUtils"

export default function HomeScreen() {
  const authDetails = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const { themed } = useAppTheme()

  const [prepareAuthentication] = usePrepareAuthenticationMutation()
  const [verifyAndGetJwt] = useVerifyAndGetJwtMutation()

  const handleDisconnectWallet = async () => {
    if (!authDetails.authToken) {
      console.error("error: No auth token found")
      return
    }

    try {
      await disconnectWallet(authDetails.authToken)
      dispatch(clearAuthDetails())
    } catch (error: any) {
      console.error("error: Disconnect wallet error", error)
    }
  }

  const handleSignMessage = async () => {
    if (!authDetails.authToken || !authDetails.address) {
      console.error("error: No auth token or address found")
      return
    }

    try {
      await signMessage(authDetails.authToken, authDetails.address, "Dialect Alerts")
      toast.success("Message signed successfully")
    } catch (error: any) {
      console.error("error: Sign Message Error", error)
    }
  }

  const dialectAlertsAuthentication = async (walletAddress: string) => {
    if (!authDetails.authToken || !authDetails.address) {
      toast.error("No auth token or address found")
      console.error("error: No auth token or address found")
      return
    }

    try {
      const { message } = await prepareAuthentication({ walletAddress }).unwrap()
      const { signatures } = await signMessage(authDetails.authToken, authDetails.address, message)
      console.log("info: Dialect Alerts Authentication", signatures)

      const signatureBase58 = bs58.encode(signatures[0])

      const { token } = await verifyAndGetJwt({
        message: message,
        signature: signatureBase58,
      }).unwrap()
      console.log("info: Dialect Alerts Authentication", token)
      dispatch(setDialectJwt(token))
    } catch (error) {
      console.error("error: Dialect Alerts Authentication Error", error)
      toast.error("Error Connecting to Dialect")
    }
  }

  return (
    <Screen preset="fixed" contentContainerStyle={$styles.flex1}>
      <View style={themed($header)}>
        <Image source={require("../../../assets/icons/logo/solana.png")} />
        <Text style={themed($headerTitle)}>Dialect Alerts</Text>
        <Text style={themed($headerSubtitle)}>Example design with MWA support</Text>
      </View>
      <View style={themed($mainContent)}>
        <View style={themed($innerContent)}>
          <WalletDetails
            address={authDetails.address || ""}
            walletType={authDetails.walletType || ""}
            onSignMessage={handleSignMessage}
          />
          <ToggleTheme />
          <Button
            onPress={() => dialectAlertsAuthentication(authDetails.address || "")}
            text="Connect to Dialect"
            textStyle={themed($connectButtonText)}
            style={themed($connectButton)}
          />
        </View>
      </View>
      <View style={themed($footer)}>
        <Button
          onPress={handleDisconnectWallet}
          text="Disconnect Wallet"
          textStyle={themed($connectButtonText)}
          style={themed($connectButton)}
        />
      </View>
    </Screen>
  )
}

const $header: ThemedStyle<ViewStyle> = (theme) => ({
  flex: 0.4,
  justifyContent: "flex-end",
  alignItems: "center",
  paddingBottom: theme.spacing.lg,
})

const $headerTitle: ThemedStyle<TextStyle> = (theme) => ({
  fontSize: 20,
  fontFamily: theme.typography.primary.bold,
  color: theme.colors.text,
  marginTop: theme.spacing.sm,
})

const $headerSubtitle: ThemedStyle<TextStyle> = (theme) => ({
  fontSize: 12,
  fontFamily: theme.typography.primary.normal,
  color: theme.colors.textDim,
})

const $mainContent: ThemedStyle<ViewStyle> = (theme) => ({
  flex: 0.5,
  alignItems: "center",
  padding: theme.spacing.md,
  marginTop: theme.spacing.lg,
  gap: 8,
})

const $innerContent: ThemedStyle<ViewStyle> = (theme) => ({
  width: "100%",
  alignItems: "center",
  gap: theme.spacing.md,
})

const $footer: ThemedStyle<ViewStyle> = (theme) => ({
  flex: 0.1,
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing.md,
})

const $connectButton: ThemedStyle<ViewStyle> = (theme) => ({
  width: "100%",
  backgroundColor: theme.colors.palette.neutral900,
  borderRadius: 32,
  padding: 12,
  alignItems: "center",
  justifyContent: "center",
})

const $connectButtonText: ThemedStyle<TextStyle> = (theme) => ({
  color: theme.colors.palette.neutral100,
  fontSize: 16,
  fontFamily: theme.typography.primary.bold,
})
