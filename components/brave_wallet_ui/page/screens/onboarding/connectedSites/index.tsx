import * as React from 'react'
import { Container } from './index.style';
import { StyleSheet, Text } from 'react-native';
import { useStyle } from '../../../../page/styles';
import { Row } from '../../../../components/shared/style';
import { DeleteIcon } from '../../../../components/desktop/asset-watchlist-item/style';
import { TouchableOpacity } from 'react-native-gesture-handler';

const ConnectedSites = () => {
  const style = useStyle()
  const list = new Array(50).fill({});
  return (
    <Container>
      {list.map((_, index) => {
        return <Row key={index} justifyContent='space-between' style={style.flatten(['padding-10'])}>
        <Text style={StyleSheet.flatten([style.flatten(['dark:color-white', 'subtitle3']), {
          maxWidth: '80%'
        }])} numberOfLines={1}>https://mises-id.github.io0xc2632bc9441c32cbb94164875dee037a6eb07881:443</Text>
        <TouchableOpacity>
          <DeleteIcon />
        </TouchableOpacity>
      </Row>
      })}
    </Container>
  )
}

export default ConnectedSites;