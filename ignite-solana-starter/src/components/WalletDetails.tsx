import { View, Text, Pressable, Image, ViewStyle, ImageBackground, TextStyle } from "react-native"

import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"


interface WalletDetailsProps {
  address: string
  walletType: string
}

export const WalletDetails = ({ address, walletType }: WalletDetailsProps) => {
  const { themed } = useAppTheme()

  return (
    <View style={themed($walletDetailsContainer)}>
      <View style={themed($walletDetails)}>
        <View style={themed($walletIcon)}>
          {walletType === "solflare" ? (
            <Image
              style={{ height: 40, width: 40 }}
              source={require("../../assets/icons/logo/solflare.png")}
            />
          ) : undefined}
        </View>
        <View style={themed($walletDetailsText)}>
          <Text style={themed($walletAddress)}>
            {address.slice(0, 8) + "..." + address.slice(-4)}
          </Text>
          <Text style={themed($walletType)}>{walletType}</Text>
        </View>
      </View>
    </View>
  )
}

const $walletDetailsContainer: ThemedStyle<ViewStyle> = (theme) => ({
  flexDirection: "column",
  width: "100%",
  borderRadius: 16,
  paddingHorizontal: 12,
  paddingVertical: 8,
  backgroundColor: theme.colors.palette.primary100,
})

const $walletDetails: ThemedStyle<ViewStyle> = (theme) => ({
  flexDirection: "row",
  alignItems: "center",
  gap: 12,
})

const $walletIcon: ThemedStyle<ViewStyle> = (theme) => ({
  width: 40,
  height: 40,
  borderRadius: 10,
  backgroundColor: theme.colors.palette.primary600,
  justifyContent: "center",
  alignItems: "center",
})

const $walletDetailsText: ThemedStyle<ViewStyle> = (theme) => ({
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "center",
  gap: 4,
})

const $walletAddress: ThemedStyle<TextStyle> = (theme) => ({
  fontSize: 14,
  fontWeight: "bold",
  color: theme.colors.text,
})

const $walletType: ThemedStyle<TextStyle> = (theme) => ({
  fontSize: 8,
  fontWeight: "normal",
  textTransform: "uppercase",
  color: theme.colors.textDim,
})

