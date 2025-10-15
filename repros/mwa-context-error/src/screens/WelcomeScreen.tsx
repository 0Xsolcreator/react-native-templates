import { FC } from "react"
import { ViewStyle } from "react-native"
import { KitMobileWallet, transact } from "@solana-mobile/mobile-wallet-adapter-protocol-kit"

import { Screen } from "@/components/Screen"
import { useAppTheme } from "@/theme/context"
import { $styles } from "@/theme/styles"
import type { ThemedStyle } from "@/theme/types"
import { Button } from "@/components/Button"

const APP_IDENTITY = {
  name: "Expo app",
  uri: "https://expo.com",
  icon: "favicon.ico",
}

export const WelcomeScreen: FC = function WelcomeScreen() {
  const { themed } = useAppTheme()

  const connectWallet = async () => {
    await transact(async (wallet: KitMobileWallet) => {
      const authorizationResult = await wallet.authorize({
        cluster: "devnet",
        identity: APP_IDENTITY,
      })

      return authorizationResult
    })
  }

  return (
    <Screen preset="fixed" contentContainerStyle={$styles.flex1}>
      <Button onPress={connectWallet} style={themed($connectWalletButtonStyle)}>
        connect wallet
      </Button>
    </Screen>
  )
}

const $connectWalletButtonStyle: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  padding: spacing.md,
  backgroundColor: colors.tintInactive,
})
