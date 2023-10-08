import { View } from 'react-native'
import { ParsedTransaction, getTransactionStatusString } from '../../../utils/tx-utils'
import * as React from 'react'
import { BraveWallet } from '../../../constants/types'
import { SendSymbol } from '../../components/transaction/send-icon'
import { useStyle } from '../../styles'
import { Text } from 'react-native'
import { getLocale } from '$web-common/locale'
export interface Props {
  transaction: ParsedTransaction
}
const PortfolioTransactionItem:React.FC<Props> = ({transaction}) => {
  const transactionStatus = getTransactionStatusString(transaction.status)

  // const wasTxRejected =
  // transaction.status !== BraveWallet.TransactionStatus.Rejected &&
  // transaction.status !== BraveWallet.TransactionStatus.Unapproved

  const style = useStyle();

  const transactionIntentDescription = React.useMemo(() => {
    switch (true) {
      case transaction.txType === BraveWallet.TransactionType.ERC20Approve: {
        return getLocale('braveWalletApprovalTransactionIntent');
      }

      case transaction.txType === BraveWallet.TransactionType.ETHSend:
      case transaction.txType === BraveWallet.TransactionType.ERC20Transfer:
      case transaction.txType === BraveWallet.TransactionType.ERC721TransferFrom:
      case transaction.txType === BraveWallet.TransactionType.ERC721SafeTransferFrom:
      default: {
        return getLocale('braveWalletTransactionSent');
      }
    }
  }, [transaction])
  return (
    <View style={style.flatten(["flex", "flex-row", "justify-between", "margin-y-10"])}>
      <View style={style.flatten(["flex", "flex-row", "flex-1", "items-center"])}>
        <View style={style.flatten(["width-40", "height-40", "border-radius-64", "background-color-background-secondary@25%"])}>
          <SendSymbol size={35} color={style.get("color-blue-400").color} />
        </View>
        <View style={style.flatten(["margin-left-10"])}>
          <Text style={style.flatten(["color-text-high"])}>{transactionIntentDescription}</Text>
          <Text style={style.flatten(["margin-top-6", "color-text-low"])}>{transactionStatus}</Text>
        </View>
      </View>
      <View>
        <Text style={style.flatten(["color-text-high", "text-right"])}>{transaction.value}{transaction.symbol}</Text>
        <Text style={style.flatten(["margin-top-6", "color-text-low"])}>${transaction.fiatTotal}</Text>
      </View>
    </View>
  )
}
export default PortfolioTransactionItem;