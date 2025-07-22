import { View, Image } from "react-native"
import type { ViewStyle, TextStyle } from "react-native"
import { useRouter } from "expo-router"
import { toast } from "sonner-native"

import { Button } from "@/components/Button"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { setAuthDetails } from "@/store/features/authSlice"
import { useAppDispatch } from "@/store/store"
import { useAppTheme } from "@/theme/context"
import { $styles } from "@/theme/styles"
import type { ThemedStyle } from "@/theme/types"
import { connectWallet } from "@/utils/walletUtils"

export default function Index() {
  const dispatch = useAppDispatch()
  const { themed } = useAppTheme()
  const router = useRouter()

  const handleConnectWallet = async () => {
    try {
      const result = await connectWallet()
      dispatch(
        setAuthDetails({
          authToken: result.authToken,
          address: result.address,
          walletType: result.walletType,
        }),
      )
      router.navigate("/home" as never)
    } catch (err: any) {
      toast.error("Error connecting wallet")
      console.error("error: Connect wallet error", err)
    }
  }

  return (
    <Screen preset="fixed" contentContainerStyle={$styles.flex1}>
      <View style={themed($header)}>
        <Image source={require("../../assets/icons/logo/solana.png")} />
        <Text style={themed($headerTitle)}>Dialect Alerts</Text>
        <Text style={themed($headerSubtitle)}>Example design with MWA support</Text>
      </View>
      <View style={themed($mainContent)}></View>
      <View style={themed($footer)}>
        <Button
          onPress={handleConnectWallet}
          text="Connect Wallet"
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
