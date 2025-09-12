import { Text, View, ViewStyle, TextStyle } from "react-native"
import { toast } from "sonner-native"

import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"

import { Switch } from "./Toggle/Switch"

export const ToggleTheme = () => {
  const { themed } = useAppTheme()

  return (
    <View style={themed($toggleThemeContainer)}>
      <Text style={themed($toggleThemeText)}>Toggle Theme</Text>
      <Switch
        value={false}
        onPress={() => toast("This feature is yet to be implemented")}
        inputOuterStyle={themed($toggleThemeInputOuter)}
        inputInnerStyle={themed($toggleThemeInputInner)}
        inputDetailStyle={themed($toggleThemeInputDetail)}
      />
    </View>
  )
}

const $toggleThemeContainer: ThemedStyle<ViewStyle> = (theme) => ({
  backgroundColor: theme.colors.palette.secondary500,
  borderRadius: 16,
  paddingHorizontal: 12,
  paddingVertical: 24,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
})

const $toggleThemeText: ThemedStyle<TextStyle> = (theme) => ({
  color: theme.colors.text,
  fontSize: 16,
  fontWeight: "500",
})

const $toggleThemeInputOuter: ThemedStyle<ViewStyle> = (theme) => ({
  backgroundColor: "transparent",
  borderWidth: 1.2,
  borderColor: theme.colors.text,
  borderRadius: 16,
  padding: 2,
  height: 32,
  width: 68,
})

const $toggleThemeInputInner: ThemedStyle<ViewStyle> = (theme) => ({
  backgroundColor: theme.colors.text,
  borderRadius: 14,
})

const $toggleThemeInputDetail: ThemedStyle<
  Omit<ViewStyle, "width" | "height"> & { width?: number; height?: number }
> = (theme) => ({
  backgroundColor: theme.colors.text,
  borderRadius: 12,
  width: 24,
  height: 24,
})
