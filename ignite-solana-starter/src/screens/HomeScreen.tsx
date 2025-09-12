import React, { FC, useMemo } from "react"
import { Text, View, Image, Pressable } from "react-native"
import { Screen } from "@/components/Screen"
import { $styles } from "@/theme/styles"
import { useAppDispatch, useAppSelector } from "@/store/store"
import { clearAuthDetails, setAuthDetails } from "@/store/features/authSlice"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { ViewStyle, TextStyle } from "react-native"
import { WalletDetails } from "@/components/WalletDetails"
import { SignMessageButton } from "@/components/SignMessageButton"
import { SignTransactionButton } from "@/components/SignTransactionButton"
import { SendTransactionButton } from "@/components/SendTransactionButton"
import { ToggleTheme } from "@/components/ThemeToggle"
import { Button } from "@/components/Button"
import { address } from "@solana/kit"
import { toast } from "sonner-native"

import { useSignIn } from "@/services/mwa/useSignIn"
import { useDisconnect } from "@/services/mwa/useDisconnect"

export const HomeScreen: FC = function WelcomeScreen() {

  const authDetails = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()

  const userAddress = useMemo(() => authDetails.address ? (address(authDetails.address)) : null, [authDetails.address])

  const { themed } = useAppTheme()
  const signIn = useSignIn()
  const disconnect = useDisconnect()

  const handleConnectWallet = async () => {
    try {
      const result = await signIn({
        cluster: "solana:devnet",
        identity: {
          name: "Solana Starter",
          uri: "https://solana.com",
        },
        sign_in_payload: {
          domain: "solana.com",
          statement: "Sign in to Solana Starter",
          uri: "https://solana.com"
        }
      })

      if (!result) {
        toast.error("error: No result found")
        return
      }
      dispatch(setAuthDetails({
        authToken: result.auth_token,
        address: result.account.address,
        walletType: result.account.label || "Unknown"
      }))
    } catch (err: any) {
      console.error("error: Connect wallet error", err)
    }
  }

  const handleDisconnectWallet = async () => {
    if (!authDetails.authToken) {
      console.error("error: No auth token found")
      return
    }
    
    try {
      await disconnect({ auth_token: authDetails.authToken })
      dispatch(clearAuthDetails())
    } catch (error: any) {
      console.error("error: Disconnect wallet error", error)
    }
  }


  return (
    <Screen preset="fixed" contentContainerStyle={$styles.flex1}>
      <View style={themed($header)}>
        <Image source={require("../../assets/icons/logo/solana.png")} />
        <Text style={themed($headerTitle)}>Ignite Solana Starter</Text>
        <Text style={themed($headerSubtitle)}>Example design to with MWA support</Text>
      </View>
      <View style={themed($mainContent)}>
        {authDetails.address ? (
          <View style={themed($innerContent)}>
            <WalletDetails 
              address={authDetails.address || ""} 
              walletType={authDetails.walletType || ""} 
            />
            <SignMessageButton 
              userAddress={authDetails.address} 
              authToken={authDetails.authToken || ""} 
              style={themed($actionButton)}
              textStyle={themed($actionButtonText)}
            />
            <SendTransactionButton 
              userAddress={authDetails.address} 
              authToken={authDetails.authToken || ""} 
              style={themed($actionButton)}
              textStyle={themed($actionButtonText)}
            />
            <SignTransactionButton 
              userAddress={authDetails.address} 
              authToken={authDetails.authToken || ""} 
              style={themed($actionButton)}
              textStyle={themed($actionButtonText)}
            />
            <ToggleTheme />
          </View>
        ) : null}
      </View>
      <View style={themed($footer)}>
        {authDetails.address ? 
          <Button onPress={handleDisconnectWallet} text="Disconnect Wallet" textStyle={themed($connectButtonText)} style={themed($connectButton)} /> : 
          <Button onPress={handleConnectWallet} text="Connect Wallet" textStyle={themed($connectButtonText)} style={themed($connectButton)} />}
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
  width: '100%',
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

const $actionButton: ThemedStyle<ViewStyle> = (theme) => ({
  width: "100%",
  borderRadius: 32,
  paddingHorizontal: 32,
  paddingVertical: 14,
  backgroundColor: theme.colors.palette.neutral900,
})

const $actionButtonText: ThemedStyle<TextStyle> = (theme) => ({
  color: theme.colors.palette.neutral100,
})