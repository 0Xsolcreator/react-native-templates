import React from "react"
import { toast } from "sonner-native"
import { getTransferSolInstruction } from '@solana-program/system'
import { 
  address, 
  appendTransactionMessageInstruction, 
  assertIsSendableTransaction, 
  createTransactionMessage, 
  lamports, 
  pipe, 
  setTransactionMessageFeePayer, 
  setTransactionMessageLifetimeUsingBlockhash, 
  signTransactionMessageWithSigners 
} from "@solana/kit"

import { Button } from "./Button"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"
import { useKitClient } from "@/services/kit/client"
import { useTransactionSigner } from "@/services/mwa/useTransactionSigner"

interface SendTransactionButtonProps {
  userAddress: string
  authToken: string
  style?: any
  textStyle?: any
}

export const SendTransactionButton = ({ userAddress, authToken, style, textStyle }: SendTransactionButtonProps) => {
  const { themed } = useAppTheme()
  const { rpc, sendAndConfirmTransaction } = useKitClient()

  const transactionSigner = useTransactionSigner({
    chain: "solana:devnet",
    identity: {
      name: "Solana Starter",
      uri: "https://solana.com",
    },
  }, address(userAddress))

  const handleSendTxViaRpc = async () => {
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
            source: transactionSigner,
            destination: address('JJBeanoTcSMU3xKQa5Gru71Wi3AaEgTfA6z7MaLUT6h'),
            amount: lamports(1000000n)
          }), tx
        )
      )
      const transaction = await signTransactionMessageWithSigners(transactionMessage)
      assertIsSendableTransaction(transaction)

      await sendAndConfirmTransaction(transaction, {commitment: "confirmed"})
      toast.success("Transaction sent successfully")
    } catch (error: any) {
      console.error("error: Send Transaction Error", error)
      toast.error("Failed to send transaction")
    }
  }

  return (
    <Button
      preset="reversed"
      text="Send Transaction via RPC"
      onPress={handleSendTxViaRpc}
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
