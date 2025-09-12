import React from "react"
import { toast } from "sonner-native"
import { getTransferSolInstruction } from '@solana-program/system'
import { 
  address, 
  appendTransactionMessageInstruction, 
  createTransactionMessage, 
  lamports, 
  pipe, 
  setTransactionMessageFeePayer, 
  setTransactionMessageLifetimeUsingBlockhash, 
  signAndSendTransactionMessageWithSigners
} from "@solana/kit"

import { Button } from "./Button"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"
import { useKitClient } from "@/services/kit/client"
import { useTransactionSendingSigner } from "@/services/mwa/useTransactionSendingSigner"

interface SignTransactionButtonProps {
  userAddress: string
  authToken: string
  style?: any
  textStyle?: any
}

export const SignTransactionButton = ({ userAddress, authToken, style, textStyle }: SignTransactionButtonProps) => {
  const { themed } = useAppTheme()
  const { rpc } = useKitClient()

  const sendTransactionSigner = useTransactionSendingSigner({
    chain: "solana:devnet",
    identity: {
      name: "Solana Starter", 
      uri: "https://solana.com",
    },
  }, address(userAddress))

  const handleSignTransaction = async () => {
    if (!userAddress) {
      console.error("error: No address found")
      return
    }

    try {
      const { value: latestBlockhash } = await rpc.getLatestBlockhash().send()
      const myAddress = address(userAddress)
      const transactionMessage = pipe(
        createTransactionMessage({version: 0}),
        (tx) => setTransactionMessageFeePayer(myAddress, tx),
        (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
        (tx) => appendTransactionMessageInstruction(
          getTransferSolInstruction({
            source: sendTransactionSigner,
            destination: address('JJBeanoTcSMU3xKQa5Gru71Wi3AaEgTfA6z7MaLUT6h'),
            amount: lamports(1000000n)
          }), tx
        )
      )
      
      const signature = await signAndSendTransactionMessageWithSigners(transactionMessage)
      toast.success("Sign & Sent Transaction successfully")
    } catch (error: any) {
      console.error("error: Sign Transaction Error", error)
      toast.error("Failed to sign transaction")
    }
  }

  return (
    <Button
      preset="reversed"
      text="Send & Send Transaction"
      onPress={handleSignTransaction}
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
