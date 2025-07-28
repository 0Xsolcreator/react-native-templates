import { View, ViewStyle, TextStyle, ImageStyle, Pressable } from "react-native"

import { AutoImage } from "@/components/AutoImage"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import {
  useClearNotificationsMutation,
  useGetNotificationsQuery,
} from "@/services/api/dialectAlerts"
import { useAppTheme } from "@/theme/context"
import { $styles } from "@/theme/styles"
import { ThemedStyle } from "@/theme/types"
import { formatRelativeTime } from "@/utils/formatDate"

export default function NotificationsScreen() {
  const { themed } = useAppTheme()
  const { data: notifications } = useGetNotificationsQuery(null)
  const [clearNotifications] = useClearNotificationsMutation()

  return (
    <Screen preset="fixed" contentContainerStyle={$styles.flex1}>
      <View style={themed($pageContainer)}>
        <View style={themed($pageTitleContainer)}>
          <Text style={themed($pageTitle)}>Notifications</Text>
          <Pressable onPress={() => clearNotifications()}>
            <AutoImage
              source={require("../../../../assets/icons/delete.png")}
              style={themed($deleteIcon)}
            />
          </Pressable>
        </View>
        <View style={themed($notificationsContainer)}>
          {notifications?.alerts.length && notifications.alerts.length > 0 ? (
            notifications.alerts.map((alert) => {
              return (
                <View key={alert.id} style={themed($notificationContainer)}>
                  <AutoImage source={{ uri: alert.app?.icon }} style={themed($notificationImage)} />
                  <View style={themed($notificationContent)}>
                    <Text style={themed($notificationTitle)}>{alert.title}</Text>
                    <Text style={themed($notificationBody)}>{alert.body}</Text>
                  </View>
                  <Text style={themed($notificationTime)}>
                    {formatRelativeTime(alert.timestamp)}
                  </Text>
                </View>
              )
            })
          ) : (
            <Text style={themed($emptyText)}>No notifications</Text>
          )}
        </View>
      </View>
    </Screen>
  )
}

const $notificationsContainer: ThemedStyle<ViewStyle> = () => ({
  gap: 18,
})

const $pageContainer: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  paddingHorizontal: 12,
  gap: 16,
})

const $pageTitleContainer: ThemedStyle<ViewStyle> = () => ({
  paddingVertical: 16,
  justifyContent: "space-between",
  flexDirection: "row",
  alignItems: "center",
})

const $pageTitle: ThemedStyle<TextStyle> = (theme) => ({
  fontFamily: theme.typography.primary.bold,
  fontSize: 36,
  lineHeight: 42,
  color: theme.colors.palette.primary600,
})

const $emptyText: ThemedStyle<TextStyle> = (theme) => ({
  fontSize: 16,
  fontFamily: theme.typography.primary.normal,
  color: theme.colors.textDim,
})

const $notificationContainer: ThemedStyle<ViewStyle> = (theme) => ({
  flexDirection: "row",
  alignItems: "flex-start",
  padding: 8,
  borderBottomColor: theme.colors.palette.neutral700,
  borderBottomWidth: 0.5,
  gap: 12,
  width: "100%",
})

const $notificationContent: ThemedStyle<ViewStyle> = () => ({
  flex: 0.7,
  gap: 4,
})

const $notificationTitle: ThemedStyle<TextStyle> = (theme) => ({
  fontSize: 16,
  lineHeight: 12,
  fontFamily: theme.typography.primary.bold,
  color: theme.colors.palette.neutral900,
})

const $notificationBody: ThemedStyle<TextStyle> = (theme) => ({
  fontSize: 14,
  lineHeight: 14,
  fontFamily: theme.typography.primary.normal,
  color: theme.colors.palette.neutral700,
})

const $notificationImage: ThemedStyle<ImageStyle> = () => ({
  width: 50,
  height: 50,
  borderRadius: 4,
})

const $notificationTime: ThemedStyle<TextStyle> = (theme) => ({
  flex: 0.3,
  fontSize: 12,
  color: theme.colors.palette.neutral700,
  textAlign: "right",
})

const $deleteIcon: ThemedStyle<ImageStyle> = () => ({
  width: 28,
  height: 28,
})
