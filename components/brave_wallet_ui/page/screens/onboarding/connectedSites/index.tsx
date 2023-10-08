import * as React from 'react'
import { Container } from './index.style';
import { StyleSheet, Text } from 'react-native';
import { useStyle } from '../../../../page/styles';
import { Column, Row, Text as SharedText } from '../../../../components/shared/style';
import { DeleteIcon } from '../../../../components/desktop/asset-watchlist-item/style';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useApiProxy } from '../../../../common/hooks/use-api-proxy';
import { BraveWallet } from '../../../../constants/types';

const ConnectedSites = () => {
  const style = useStyle()
  const { braveWalletService } = useApiProxy()
  const [list, setList] = React.useState<string[]>([])
  const coinType = BraveWallet.CoinType.ETH;
  const fetchList = () => {
    braveWalletService.getWebSitesWithPermission(coinType).then((res: {webSites: string[]}) => {
      console.log(res, 'getWebSitesWithPermission')
      setList(res.webSites)
    })
  }
  React.useEffect(() => {
    fetchList()
  }, [])

  const deleteConnectedSite = (site: string) => {
    braveWalletService.resetWebSitePermission(coinType, site).then((res: {success: boolean}) => {
      if(res.success) {
        fetchList()
      }
     })
  }
  
  return (
    <Container>
      {list.map((val, index) => {
        return <Row key={index} justifyContent='space-between' style={style.flatten(['padding-10'])}>
        <Text style={StyleSheet.flatten([style.flatten(['dark:color-white', 'subtitle3']), {
          maxWidth: '80%'
        }])} numberOfLines={1}>{val}</Text>
        <TouchableOpacity onPress={() => deleteConnectedSite(val)}>
          <DeleteIcon />
        </TouchableOpacity>
      </Row>
      })}
      {list.length === 0 &&
        <Column fullHeight>
          <SharedText textSize='14px'>
            No results found.
          </SharedText>
        </Column>
      }
    </Container>
  )
}

export default ConnectedSites;