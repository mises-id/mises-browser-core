import { getLocale } from '$web-common/locale'
import { reduceAddress } from '../../utils/reduce-address'
import { BraveWallet, SerializableOriginInfo } from '../../constants/types'
import * as React from 'react'
import { Text } from 'react-native'
import { View } from 'react-native'
import { useStyle } from '../../page/styles'
import { Button } from '../../page/components/button'
import CreateSiteOrigin from './CreateSiteOrigin'
interface IProps {
  onCancel: () => void
  onAddToken: () => void
  originInfo: SerializableOriginInfo
  selectedNetwork?: BraveWallet.NetworkInfo
  token?: BraveWallet.BlockchainToken
}
const AddSuggestedToken:React.FC<IProps> = (props) => {
  const {
    onCancel,
    onAddToken,
    token,
    // selectedNetwork,
    originInfo
  } = props;
  const style = useStyle()

  console.log(token, "token")

  return (
    <View>
      <View style={style.flatten(['flex', 'items-center', 'justify-center'])}>
        <Text style={style.flatten(['h3', 'color-text-high', 'margin-top-10'])}>{getLocale('braveWalletAddSuggestedTokenTitle')}</Text>
        <CreateSiteOrigin
          originSpec={originInfo.originSpec}
          eTldPlusOne={originInfo.eTldPlusOne}
        />
        <Text style={style.flatten(['subtitle3', 'color-text-high', 'margin-top-10'])}>{getLocale('braveWalletAddSuggestedTokenDescription')}</Text>
        <Text style={style.flatten(['h3', 'color-text-high', 'margin-top-10'])}>{token?.name || ''} ({token?.symbol || ''})</Text>
        <Text style={style.flatten(['color-blue-600', 'margin-top-10'])}>{reduceAddress(token?.contractAddress || '')}</Text>
      </View>
      <View
        style={style.flatten([
          "flex",
          "flex-row",
          "justify-end",
          "margin-top-12",
        ])}
      >
        <View style={style.flatten(["margin-right-12"])}>
          <Button text={getLocale('braveWalletButtonCancel')} size="small" onPress={onCancel} />
        </View>
        <Button text={getLocale('braveWalletWatchListAdd')} size="small" onPress={onAddToken} />
      </View>
    </View>
  )
}

export default AddSuggestedToken