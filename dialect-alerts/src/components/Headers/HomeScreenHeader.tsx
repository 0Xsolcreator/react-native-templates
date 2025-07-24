import { Image, Pressable, View, ViewStyle } from "react-native"
import { useRouter, usePathname } from "expo-router"

import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"

export default function HomeScreenHeader() {
  const { themed } = useAppTheme()
  const pathname = usePathname()
  const router = useRouter()

  const handleBackAction = () => {
    if (pathname === "/home/manage-alerts") {
      if (router.canGoBack()) {
        router.back()
      } else {
        router.replace("/home")
      }
    }
  }

  return (
    <View style={themed($header)}>
      <View style={themed($backButton)}>
        {pathname !== "/home" && (
          <Pressable onPress={handleBackAction}>
            <Image source={require("../../../assets/icons/back.png")} />
          </Pressable>
        )}
      </View>

      <View style={themed($bellButton)}>
        <Image source={require("../../../assets/icons/bell.png")} />
      </View>
    </View>
  )
}

const $header: ThemedStyle<ViewStyle> = (theme) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing.md,
})

const $backButton: ThemedStyle<ViewStyle> = () => ({
  width: 34,
  height: 34,
})

const $bellButton: ThemedStyle<ViewStyle> = (theme) => ({
  width: 34,
  height: 34,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: theme.colors.palette.neutral900,
  borderRadius: 8,
})
