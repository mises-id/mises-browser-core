import * as React from 'react'
import { TouchableOpacity, View } from 'react-native'
import { getBalance as getBalanceUtil } from '../../../utils/balance-utils'
import { BraveWallet, SupportedTestNetworks, UserAssetInfoType, WalletState } from '../../../constants/types'
// import { AllAccountsOption } from '../../../options/account-filter-options'
import { AllNetworksOption } from '../../../options/network-filter-options'
import { useSelector } from "react-redux";
import { getAssetIdKey } from '../../../utils/asset-utils';
import PortfolioAssetItem from './portfolio-asset-item';
import { useUnsafeWalletSelector } from '../../../common/hooks/use-safe-selector';
import { WalletSelectors } from '../../../common/selectors';
import { useGetSelectedChainQuery } from '../../../common/slices/api.slice'
import { Text } from 'react-native'
import { useStyle } from '../../styles'

const AssetsList: React.FunctionComponent = () => {
  const selectedAccount = useUnsafeWalletSelector(WalletSelectors.selectedAccount)

  // queries
  const { data: selectedNetwork } = useGetSelectedChainQuery()
  const userVisibleTokensInfo = useSelector(({ wallet }: { wallet: WalletState }) => wallet.userVisibleTokensInfo)

  // filter the user's assets based on the selected network
  const visibleTokensForSupportedChains = React.useMemo(() => {
    // By default we dont show any testnetwork assets
    if (selectedNetwork?.chainId === AllNetworksOption.chainId) {
      return userVisibleTokensInfo.filter((token) => !SupportedTestNetworks.includes(token.chainId))
    }

    // If chainId is Localhost we also do a check for coinType to return
    // the correct asset
    if (selectedNetwork && selectedNetwork.chainId === BraveWallet.LOCALHOST_CHAIN_ID) {
      return userVisibleTokensInfo.filter((token) =>
        token.chainId === selectedNetwork.chainId &&
        token.coin === selectedNetwork.coin
      )
    }
    // Filter by all other assets by chainId's
    return userVisibleTokensInfo.filter((token) => token.chainId === selectedNetwork?.chainId)
  }, [
    selectedNetwork?.chainId,
    selectedNetwork?.coin,
    userVisibleTokensInfo
  ])

  const visibleTokensForFilteredAccount: BraveWallet.BlockchainToken[] = React.useMemo(() => {
    return visibleTokensForSupportedChains.filter((token) => token.coin === selectedAccount?.coin)
  }, [visibleTokensForSupportedChains, selectedAccount])

  // This looks at the users asset list and returns the full balance for each asset
  const userAssetList: UserAssetInfoType[] = React.useMemo(() => {
    return visibleTokensForFilteredAccount.map((asset) => ({
      asset: asset,
      assetBalance: getBalanceUtil(selectedAccount, asset)
    }))
  }, [
    visibleTokensForFilteredAccount,
    selectedAccount
  ])

  console.log(userAssetList, "getBalanceUtilgetBalanceUtilgetBalanceUtil")
  const [hideBalances] = React.useState(false);

  const style = useStyle()
  return (
    <View>
      {userAssetList.map((item, index) =>{
        return <PortfolioAssetItem
          key={getAssetIdKey(item.asset)}
          assetBalance={item.assetBalance}
          token={item.asset}
          hideBalances={hideBalances}
        />
      })}
      <View style={style.flatten(['flex', 'items-center', 'justify-center', 'margin-y-10', 'flex-row'])}>
        <Text style={style.flatten(['subtitle3'])}>Don't see you tokens?</Text>
        <TouchableOpacity onPress={() => {

        }}>
          <Text style={style.flatten(["color-blue-200", 'subtitle3'])}> Import Token</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
export default AssetsList;