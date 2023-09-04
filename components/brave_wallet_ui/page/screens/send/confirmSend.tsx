import { usePendingTransactions } from '../../../common/hooks/use-pending-transaction'
import * as React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { View } from 'react-native'
import { useStyle } from '../../styles'
import { shortenAddress } from '../../common'
import { Image } from 'react-native'
import { Button } from '../../components/button'
import { useUnsafeWalletSelector } from '../../../common/hooks/use-safe-selector'
import { WalletSelectors } from '../../../common/selectors'
import { WalletActions } from '../../../common/actions'
import { useDispatch } from 'react-redux'
import { ParamListBase, useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'

const ConfirmSendScreen = () => {
  // custom hooks
  const pendingTxInfo = usePendingTransactions()
  const {
    fromAddress,
    fromOrb,
    toOrb,
    transactionDetails,
    rejectAllTransactions,
    transactionsQueueLength,
    // transactionsNetwork,
    // transactionTitle,
    // isSolanaDappTransaction,
    // fromAccountName,
    // groupTransactions,
    // selectedPendingTransactionGroupIndex
  } = pendingTxInfo
  const style = useStyle();
  const selectedPendingTransaction = useUnsafeWalletSelector(WalletSelectors.selectedPendingTransaction)
  
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

  const dispatch = useDispatch();

  const onConfirmTransaction = () => {
    if (!selectedPendingTransaction) {
      return
    }
    dispatch(WalletActions.approveTransaction(selectedPendingTransaction))
    navigation.replace("MainTabDrawer")
  }

  const onRejectTransaction = () => {
    if (selectedPendingTransaction) {
      dispatch(WalletActions.rejectTransaction(selectedPendingTransaction))
      navigation.goBack()
    }
  }


  return (
    <View style={style.flatten(["padding-10"])}>
      <Text style={style.flatten([
        "body2",
        "color-gray-600",
        "dark:color-platinum-50",
      ])}>From:</Text>
      <View style={style.flatten(["border-width-1", 'border-color-gray-100@70%', 'border-radius-6', 'padding-10', 'flex', 'margin-top-10', 'margin-bottom-10', 'flex-row', 'background-color-white'])}>
        <Image 
          style={style.flatten(['border-radius-64', 'width-32', 'height-32'])}
          source={{
            uri: fromOrb
          }}
        ></Image>
        <View style={style.flatten(['margin-left-10'])}>
          <Text style={style.flatten(['color-text-high',])}>{transactionDetails?.senderLabel}</Text>
          <Text style={style.flatten(['margin-top-4', 'color-text-low', 'subtitle3'])}>{shortenAddress(fromAddress)}</Text>
        </View>
      </View>
      <Text>To:</Text>
      <View style={style.flatten(["border-width-1", 'border-color-gray-100@70%', 'border-radius-6', 'padding-10', 'flex', 'margin-top-10', 'margin-bottom-10', 'flex-row', 'background-color-white'])}>
        <Image 
          style={style.flatten(['border-radius-64', 'width-32', 'height-32'])}
          source={{
            uri: toOrb
          }}
        ></Image>
        <View style={style.flatten(['margin-left-10'])}>
          {transactionDetails?.recipientLabel && <Text style={style.flatten(['color-text-high', 'margin-bottom-4'])}>{transactionDetails?.recipientLabel}</Text>}
          <Text style={style.flatten(['color-text-low', 'subtitle3'])}>{shortenAddress(transactionDetails?.recipient)}</Text>
        </View>
      </View>
      <View style={style.flatten(['flex', 'flex-column', 'items-center', 'justify-center', 'margin-y-10'])}>
        <Text style={style.flatten(['color-text-low', 'subtitle2'])}>AMOUNT</Text>
        <Text style={style.flatten(['h3'])}>{transactionDetails?.formattedSendCurrencyTotal}</Text>
      </View>
      
      <View style={style.flatten(["border-width-1", 'border-color-gray-100@70%', 'border-radius-6', 'padding-10', 'background-color-white'])}>
        <View style={style.flatten(["flex", "justify-between", 'flex-row'])}>
          <Text>Estimated gas fee</Text>
          <Text>{transactionDetails?.gasFee}</Text>
        </View>
      </View>
      {transactionsQueueLength > 1 && <TouchableOpacity onPress={rejectAllTransactions} style={style.flatten(['color-blue-200', 'dark:color-blue-600', 'flex', 'items-center', 'justify-center','margin-y-10'])}>
        <Text>Reject All</Text>
      </TouchableOpacity>}

      <View style={style.flatten(['margin-top-40'])}>
        <View style={style.flatten(['flex-1', 'margin-top-10'])}>
          <Button
            text="Cancel"
            size="large"
            mode="light"
            onPress={onRejectTransaction}
          />
        </View>
        <View style={style.flatten(['flex-1', 'margin-top-10'])}>
          <Button
            text="Send"
            size="large"
            onPress={onConfirmTransaction}
          />
        </View>
      </View>
      
    </View>
  )
}

export default ConfirmSendScreen