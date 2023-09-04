import * as React from 'react'
import { View } from 'react-native'
import { BraveWallet, WalletState } from '../../../constants/types'
// import { useGetNetworkQuery } from '../../../common/slices/api.slice'
import Amount from '../../../utils/amount'
import { computeFiatAmount } from '../../../utils/pricing-utils'
// import { getLocale } from '$web-common/locale'
// import { unbiasedRandom } from '../../../utils/random-utils'
import { useSelector } from 'react-redux'
import { useStyle } from '../../styles'
import { Image } from 'react-native'
import { Text } from 'react-native'
// import { getLocale } from '$web-common/locale'

interface Props {
  assetBalance: string
  token: BraveWallet.BlockchainToken
  hideBalances?: boolean
  isPanel?: boolean
  isAccountDetails?: boolean
  isSellSupported?: boolean
  showSellModal?: () => void
}
const PortfolioAssetItem: React.FunctionComponent<Props> = ({
  assetBalance,
  token,
  hideBalances,
  isPanel
}) => {
  const defaultCurrencies = useSelector(({ wallet }: { wallet: WalletState }) => wallet.defaultCurrencies)
  const spotPrices = useSelector(({ wallet }: { wallet: WalletState }) => wallet.transactionSpotPrices)
   // queries
  //  const { data: tokensNetwork } = useGetNetworkQuery(token, { skip: !token })

   // state
  //  const [assetNameSkeletonWidth, setAssetNameSkeletonWidth] = React.useState(0)
  //  const [assetNetworkSkeletonWidth, setAssetNetworkSkeletonWidth] = React.useState(0)

   // memos & computed
   const isNonFungibleToken = React.useMemo(() => token.isNft || token.isErc721, [token.isNft, token.isErc721])
 
   const formattedAssetBalance = isNonFungibleToken
     ? new Amount(assetBalance)
       .divideByDecimals(token.decimals)
       .format()
     : new Amount(assetBalance)
       .divideByDecimals(token.decimals)
       .formatAsAsset(6, token.symbol)
 
   const fiatBalance = React.useMemo(() => {
     return computeFiatAmount(spotPrices, {
       decimals: token.decimals,
       symbol: token.symbol,
       value: assetBalance,
       contractAddress: token.contractAddress,
       chainId: token.chainId
     })
   }, [spotPrices, assetBalance, token.symbol, token.decimals, token.chainId])
 
   const formattedFiatBalance = React.useMemo(() => {
     return fiatBalance.formatAsFiat(defaultCurrencies.fiat)
   }, [fiatBalance, defaultCurrencies.fiat])
 
  //  const isLoading = React.useMemo(() => {
  //    return formattedAssetBalance === '' && !isNonFungibleToken
  //  }, [formattedAssetBalance, token])
 
  //  const NetworkDescription = React.useMemo(() => {
 
  //    if (tokensNetwork && !isPanel) {
  //      return token.symbol !== ''
  //      ? getLocale('braveWalletPortfolioAssetNetworkDescription')
  //        .replace('$1', token.symbol)
  //        .replace('$2', tokensNetwork.chainName ?? '')
  //      : tokensNetwork.chainName
  //    }
  //    return token.symbol
  //  }, [tokensNetwork, token])
 
  //  const isAssetsBalanceZero = React.useMemo(() => {
  //    return new Amount(assetBalance).isZero()
  //  }, [assetBalance])
 
  //  console.log(formattedFiatBalance, isLoading, isAssetsBalanceZero, formattedAssetBalance, NetworkDescription)
   // effects
  //  React.useEffect(() => {
  //    // Randow value between 100 & 250
  //    // Set value only once
  //    if (assetNameSkeletonWidth === 0) {
  //      setAssetNameSkeletonWidth(unbiasedRandom(100, 250))
  //    }
 
  //    if (assetNetworkSkeletonWidth === 0) {
  //      setAssetNetworkSkeletonWidth(unbiasedRandom(100, 250))
  //    }
  //  }, [])

  const style = useStyle();
  return (
    <View style={style.flatten(["flex", "flex-row", "justify-between", "margin-y-10"])}>
      <View style={style.flatten(["flex", "flex-row", "flex-1", "items-center"])}>
        <View style={style.flatten(["width-40", "height-40", "border-radius-64", "background-color-background-secondary@25%"])}>
          {
            token.logo && <Image
              style={{
                width: 40,
                height: 40,
              }}
              source={{
                uri: token.logo,
              }}
            />
          }
        </View>
        <View style={style.flatten(["margin-left-10"])}>
          <Text style={style.flatten(["color-text-high"])}>{token.symbol}</Text>
          <Text style={style.flatten(["margin-top-6", "color-text-low"])}>{hideBalances ? '***' : formattedAssetBalance}</Text>
        </View>
      </View>
      <View>
        <Text style={style.flatten(["color-text-high", "text-right"])}>{hideBalances ? '***' : formattedFiatBalance}</Text>
      </View>
    </View>
  )
}
export default PortfolioAssetItem 