
import { useGetNetworksQuery, useGetTokensRegistryQuery, useGetUserTokensRegistryQuery } from '../../../common/slices/api.slice';
import { useUnsafeWalletSelector } from '../../../common/hooks/use-safe-selector';
import { WalletSelectors } from '../../../common/selectors';
import { getNetworkFromTXDataUnion } from '../../../utils/network-utils';
import { parseTransactionWithPrices, sortTransactionByDate } from '../../../utils/tx-utils';
import * as React from 'react'
import { selectAllBlockchainTokensFromQueryResult, selectAllUserAssetsFromQueryResult } from '../../../common/slices/entities/blockchain-token.entity';
import { getLocale } from '$web-common/locale';
import { Text } from 'react-native';
import PortfolioTransactionItem from './portfolioTransactionItem';
import { useStyle } from '../../styles';

const Activity = ()=> {
  const selectedAccount = useUnsafeWalletSelector(WalletSelectors.selectedAccount)
  const { data: networkList = [] } = useGetNetworksQuery()
  const accounts = useUnsafeWalletSelector(WalletSelectors.accounts)
  const transactions = useUnsafeWalletSelector(WalletSelectors.transactions)
  const solFeeEstimates = useUnsafeWalletSelector(WalletSelectors.solFeeEstimates)
  const spotPrices = useUnsafeWalletSelector(WalletSelectors.transactionSpotPrices)

  const { fullTokenList } = useGetTokensRegistryQuery(undefined, {
    selectFromResult: (result) => ({
      fullTokenList: selectAllBlockchainTokensFromQueryResult(result)
    })
  })
  const { userVisibleTokensList } = useGetUserTokensRegistryQuery(undefined, {
    selectFromResult: result => ({
      userVisibleTokensList: selectAllUserAssetsFromQueryResult(result)
    })
  })

  const transactionList = React.useMemo(() => {
    if (selectedAccount?.address && transactions[selectedAccount.address]) {
      return sortTransactionByDate(
        transactions[selectedAccount.address],
        'descending'
      ).map(tx => parseTransactionWithPrices({
        tx,
        accounts,
        fullTokenList,
        userVisibleTokensList,
        solFeeEstimates,
        transactionNetwork: getNetworkFromTXDataUnion(tx.txDataUnion, networkList),
        spotPrices
      }))
    } else {
      return []
    }
  }, [
    accounts,
    selectedAccount?.address,
    transactions,
    accounts,
    fullTokenList,
    userVisibleTokensList,
    solFeeEstimates,
    networkList,
    spotPrices
  ])

  React.useEffect(() => {
    console.log(transactionList)
  }, [transactionList])

  const style = useStyle()
  return (
    transactionList.length !== 0 ? (
      <>
        {transactionList.map((transaction) =>
          <PortfolioTransactionItem
            key={transaction?.id}
            transaction={transaction}
          />
        )}
      </>
    ) : (
      <Text style={style.flatten(["text-center", 'subtitle3', 'dark:color-white', 'padding-20'])}>{getLocale('braveWalletTransactionPlaceholder')}</Text>
    )
  )
}
export default Activity;

