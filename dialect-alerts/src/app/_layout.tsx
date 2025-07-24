import { useEffect, useState } from "react"
import { getRandomValues as expoCryptoGetRandomValues } from "expo-crypto"
import { Slot, SplashScreen } from "expo-router"
import { useFonts } from "@expo-google-fonts/space-grotesk"
import { Buffer } from "buffer"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { KeyboardProvider } from "react-native-keyboard-controller"
import { initialWindowMetrics, SafeAreaProvider } from "react-native-safe-area-context"
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import { Toaster } from "sonner-native"

import { initI18n } from "@/i18n"
import { persistor, store } from "@/store/store"
import { ThemeProvider } from "@/theme/context"
import { customFontsToLoad } from "@/theme/typography"
import { loadDateFnsLocale } from "@/utils/formatDate"

// Solana polyfill
global.Buffer = Buffer

// getRandomValues polyfill
class Crypto {
  getRandomValues = expoCryptoGetRandomValues
}

const webCrypto = typeof crypto !== "undefined" ? crypto : new Crypto()

;(() => {
  if (typeof crypto === "undefined") {
    Object.defineProperty(window, "crypto", {
      configurable: true,
      enumerable: true,
      get: () => webCrypto,
    })
  }
})()

SplashScreen.preventAutoHideAsync()

if (__DEV__) {
  // Load Reactotron configuration in development. We don't want to
  // include this in our production bundle, so we are using `if (__DEV__)`
  // to only execute this in development.
  require("src/devtools/ReactotronConfig.ts")
}

export { ErrorBoundary } from "@/components/ErrorBoundary/ErrorBoundary"

export default function Root() {
  const [fontsLoaded, fontError] = useFonts(customFontsToLoad)
  const [isI18nInitialized, setIsI18nInitialized] = useState(false)

  const onBeforeLiftPersistGate = () => {
    // If your initialization scripts run very fast, it's good to show the splash screen for just a bit longer to prevent flicker.
    // Slightly delaying splash screen hiding for better UX; can be customized or removed as needed,
    // Note: (vanilla Android) The splash-screen will not appear if you launch your app via the terminal or Android Studio. Kill the app and launch it normally by tapping on the launcher icon. https://stackoverflow.com/a/69831106
    // Note: (vanilla iOS) You might notice the splash-screen logo change size. This happens in debug/development mode. Try building the app for release.
    setTimeout(SplashScreen.hideAsync, 500)
  }

  useEffect(() => {
    initI18n()
      .then(() => setIsI18nInitialized(true))
      .then(() => loadDateFnsLocale())
  }, [])

  const loaded = fontsLoaded && isI18nInitialized

  useEffect(() => {
    if (fontError) throw fontError
  }, [fontError])

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    return null
  }

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <Provider store={store}>
        <PersistGate loading={null} onBeforeLift={onBeforeLiftPersistGate} persistor={persistor}>
          <ThemeProvider>
            <KeyboardProvider>
              <GestureHandlerRootView>
                <Slot />
                <Toaster position="top-center" richColors={true} />
              </GestureHandlerRootView>
            </KeyboardProvider>
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  )
}
