import { ImageStyle, TextStyle, View, ViewStyle } from "react-native"

import { AutoImage } from "@/components/AutoImage"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Switch } from "@/components/Toggle/Switch"
import { App } from "@/schema/dialectAlertsApi.schema"
import {
  useGetAppsQuery,
  useSubscribeToAppMutation,
  useUnsubscribeFromAppMutation,
} from "@/services/api/dialectAlerts"
import { useAppTheme } from "@/theme/context"
import { $styles } from "@/theme/styles"
import { ThemedStyle } from "@/theme/types"

export default function ManageAlerts() {
  const { themed } = useAppTheme()
  const [subscribeToApp] = useSubscribeToAppMutation()
  const [unsubscribeFromApp] = useUnsubscribeFromAppMutation()

  const { data: apps } = useGetAppsQuery()
  console.log(apps?.apps.length)

  const handleSubscribeAction = (appId: string, subscribed: boolean) => {
    if (!subscribed) {
      subscribeToApp({ appId, channel: "IN_APP" })
    } else {
      unsubscribeFromApp({ appId, channel: "IN_APP" })
    }
  }

  const getKnobStyle = (isSubscribed: boolean) =>
    themed({
      backgroundColor: isSubscribed ? "#1E1E1E" : "#EF4444",
      width: 24,
      height: 24,
      borderRadius: 12,
    })

  return (
    <Screen preset="fixed" contentContainerStyle={$styles.flex1}>
      <View style={themed($PageContainer)}>
        <View style={themed($PageTitleContainer)}>
          <Text style={themed($PageTitle)}>Manage Alerts</Text>
        </View>
        <View style={themed($PageContentContainer)}>
          {apps?.apps.map((app: App) => {
            return (
              <View key={app.id} style={themed($AppContainer)}>
                <View style={themed($AppInfoContainer)}>
                  <AutoImage source={{ uri: app.icon }} style={themed($AppIcon)} />
                  <View style={themed($AppInfoTextContainer)}>
                    <Text style={themed($AppName)}>{app.name}</Text>
                    <Text style={themed($AppDescription)}>{app.description}</Text>
                  </View>
                </View>
                <Switch
                  value={app.subscribed}
                  onPress={() => handleSubscribeAction(app.id, app.subscribed)}
                  inputOuterStyle={themed($toggleThemeInputOuter)}
                  inputInnerStyle={themed($toggleThemeInputInner)}
                  inputDetailStyle={getKnobStyle(app.subscribed)}
                />
              </View>
            )
          })}
        </View>
      </View>
    </Screen>
  )
}

const $PageContainer: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  paddingHorizontal: 12,
  gap: 16,
})

const $PageTitleContainer: ThemedStyle<ViewStyle> = () => ({
  paddingVertical: 16,
})

const $PageTitle: ThemedStyle<TextStyle> = (theme) => ({
  fontFamily: theme.typography.primary.bold,
  fontSize: 36,
  lineHeight: 42,
  color: theme.colors.palette.primary600,
})

const $PageContentContainer: ThemedStyle<ViewStyle> = (theme) => ({
  flex: 0.9,
  paddingHorizontal: 12,
  paddingVertical: 32,
  backgroundColor: theme.colors.palette.primary100,
  borderRadius: 16,
  overflowY: "scroll",
})

const $AppIcon: ThemedStyle<ImageStyle> = () => ({
  width: 50,
  height: 50,
  borderRadius: 4,
})

const $AppContainer: ThemedStyle<ViewStyle> = (theme) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  marginBottom: 10,
  padding: 8,
  borderBottomColor: theme.colors.palette.neutral900,
  borderBottomWidth: 0.2,
})

const $AppInfoContainer: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  alignItems: "flex-start",
  gap: 10,
})

const $AppInfoTextContainer: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "column",
  gap: 4,
})

const $AppName: ThemedStyle<TextStyle> = (theme) => ({
  fontSize: 16,
  fontFamily: theme.typography.primary.bold,
  lineHeight: 14,
  marginBottom: 0,
})

const $AppDescription: ThemedStyle<TextStyle> = (theme) => ({
  fontSize: 12,
  fontFamily: theme.typography.primary.normal,
  lineHeight: 12,
  marginTop: 0,
})

const $toggleThemeInputOuter: ThemedStyle<ViewStyle> = (theme) => ({
  backgroundColor: "transparent",
  borderWidth: 1.2,
  borderColor: theme.colors.palette.neutral900,
  borderRadius: 16,
  height: 32,
  width: 76,
})

const $toggleThemeInputInner: ThemedStyle<ViewStyle> = (theme) => ({
  backgroundColor: theme.colors.palette.primary600,
  padding: 2,
})
