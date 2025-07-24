import { Stack } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"

import HomeScreenHeader from "@/components/Headers/HomeScreenHeader"

export default function StackLayout() {
  return (
    <>
      <SafeAreaView>
        <HomeScreenHeader />
      </SafeAreaView>
      <Stack screenOptions={{ headerShown: false }} />
    </>
  )
}
