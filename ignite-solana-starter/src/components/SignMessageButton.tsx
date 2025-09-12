import React from "react"
import { toast } from "sonner-native"
import { address, createSignableMessage } from "@solana/kit"

import { Button } from "./Button"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"
import { useMessageSigner } from "@/services/mwa/useMessageSigner"

interface SignMessageButtonProps {
  userAddress: string
  authToken: string
  style?: any
  textStyle?: any
}

export const SignMessageButton = ({ userAddress, authToken, style, textStyle }: SignMessageButtonProps) => {
  const { themed } = useAppTheme()

  const messageSigner = useMessageSigner({
    chain: "solana:devnet",
    identity: {
      name: "Solana Starter",
      uri: "https://solana.com",
    },
  }, address(userAddress))

  const handleSignMessage = async () => {
    if (!authToken || !userAddress) {
      console.error("error: No auth token or address found")
      return
    }
    try {
      const messages = createSignableMessage("Hello React Native")
      const signedMessages = await messageSigner.modifyAndSignMessages([messages])
      toast.success("Message signed successfully")
    } catch (error: any) {
      console.error("error: Sign Message Error", error)
      toast.error("Failed to sign message")
    }
  }

  return (
    <Button
      preset="filled"
      text="Sign Message"
      onPress={handleSignMessage}
      textStyle={textStyle || themed($defaultTextStyle)}
      style={style || themed($defaultButtonStyle)}
    />
  )
}

const $defaultButtonStyle: ThemedStyle<any> = (theme) => ({
  width: "100%",
  borderRadius: 32,
  paddingHorizontal: 32,
  paddingVertical: 14,
  backgroundColor: theme.colors.palette.neutral900,
})

const $defaultTextStyle: ThemedStyle<any> = (theme) => ({
  color: theme.colors.palette.neutral100,
})
