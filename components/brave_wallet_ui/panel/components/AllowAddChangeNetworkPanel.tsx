// Copyright (c) 2021 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at https://mozilla.org/MPL/2.0/.
import * as React from 'react'
import { BraveWallet, SerializableOriginInfo } from '../../constants/types'

import { getLocale } from '$web-common/locale'
import CreateSiteOrigin from './CreateSiteOrigin'
import { TouchableOpacity, View } from 'react-native'
import { useStyle } from '../../page/styles'
import { Button } from '../../page/components/button'
import { Image, Text } from 'react-native'

export type tabs = 'network' | 'details'

export interface Props {
  originInfo: SerializableOriginInfo
  networkPayload: BraveWallet.NetworkInfo
  panelType: 'add' | 'change'
  onCancel: () => void
  onApproveAddNetwork: () => void
  onApproveChangeNetwork: () => void
}

function AllowAddChangeNetworkPanel (props: Props) {
  const {
    originInfo,
    networkPayload,
    panelType,
    onCancel,
    onApproveAddNetwork,
    onApproveChangeNetwork
  } = props
  const rpcUrl = networkPayload.rpcEndpoints[networkPayload.activeRpcEndpointIndex]?.url || ''
  const blockUrl = networkPayload.blockExplorerUrls.length ? networkPayload.blockExplorerUrls[0] : ''

  const [selectedTab, setSelectedTab] = React.useState<tabs>('network')
  const onSelectTab = (tab: tabs) => () => {
    setSelectedTab(tab)
  }

  // const onLearnMore = () => {
  //   chrome.tabs.create({
  //     url: 'https://support.brave.com/hc/en-us/articles/4415497656461-Brave-Wallet-FAQ'
  //   }).catch((e) => { console.error(e) })
  // }

  const style = useStyle();

  return (
    <View>
      <View>
        <Image
          style={{
            width: 48,
            height: 48,
            marginTop: 38,
            marginBottom: 7,
            borderRadius: 5
          }}
          source={{
            uri: `chrome://favicon/size/64@1x/${originInfo.originSpec}`
          }}
        />
        <CreateSiteOrigin
          originSpec={originInfo.originSpec}
          eTldPlusOne={originInfo.eTldPlusOne}
        />
        <Text style={style.flatten(['h3'])}>
          {panelType === 'change'
            ? getLocale('braveWalletAllowChangeNetworkTitle')
            : getLocale('braveWalletAllowAddNetworkTitle')
          }
        </Text>
        <Text>
          {panelType === 'change'
          ? getLocale('braveWalletAllowChangeNetworkDescription')
          : getLocale('braveWalletAllowAddNetworkDescription')}{' '}
        </Text>
        <View>
          <TouchableOpacity
             style={style.flatten([`${selectedTab === 'network' ? 'border-width-bottom-3' : 'border-width-bottom-0'}`, 'border-color-blue-400'])}
            onPress={() => onSelectTab('network')}
          >
            <Text>{getLocale('braveWalletAllowAddNetworkNetworkPanelTitle')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
             style={style.flatten([`${selectedTab === 'details' ? 'border-width-bottom-3' : 'border-width-bottom-0'}`, 'border-color-blue-400'])}
            onPress={() => onSelectTab('details')}
          >
            <Text>{getLocale('braveWalletAllowAddNetworkDetailsPanelTitle')}</Text>
          </TouchableOpacity>
        </View>
        <View>
          <View style={style.flatten(['flex', 'flex-row', 'items-center', 'justify-between'])}>
            <Text style={style.flatten(["body1", "color-text-middle"])}>{getLocale('braveWalletAllowAddNetworkName')}</Text>
            <Text style={style.flatten(["subtitle3", "color-text-low"])}>{networkPayload.chainName}</Text>
          </View>
          <View style={style.flatten(['flex', 'flex-row', 'items-center', 'justify-between', 'margin-top-3'])}>
            <Text style={style.flatten(["body1", "color-text-middle"])}>{getLocale('braveWalletAllowAddNetworkUrl')}</Text>
            <Text style={style.flatten(["subtitle3", "color-text-low"])}>{rpcUrl}</Text>
          </View>
          {selectedTab === 'details' &&
            <>
              <View style={style.flatten(['flex', 'flex-row', 'items-center', 'justify-between', 'margin-top-3'])}>
                <Text style={style.flatten(["body1", "color-text-middle"])}>{getLocale('braveWalletAllowAddNetworkChainID')}</Text>
                <Text style={style.flatten(["subtitle3", "color-text-low"])}>{networkPayload.chainId}</Text>
              </View>
              <View style={style.flatten(['flex', 'flex-row', 'items-center', 'justify-between', 'margin-top-3'])}>
                <Text style={style.flatten(["body1", "color-text-middle"])}>{getLocale('braveWalletAllowAddNetworkCurrencySymbol')}</Text>
                <Text style={style.flatten(["subtitle3", "color-text-low"])}>{networkPayload.symbol}</Text>
              </View>
              <View style={style.flatten(['flex', 'flex-row', 'items-center', 'justify-between', 'margin-top-3'])}>
                <Text style={style.flatten(["body1", "color-text-middle"])}>{getLocale('braveWalletWatchListTokenDecimals')}</Text>
                <Text style={style.flatten(["subtitle3", "color-text-low"])}>{networkPayload.decimals}</Text>
              </View>
              <View style={style.flatten(['flex', 'flex-row', 'items-center', 'justify-between', 'margin-top-3'])}>
                <Text style={style.flatten(["body1", "color-text-middle"])}>{getLocale('braveWalletAllowAddNetworkExplorer')}</Text>
                <Text style={style.flatten(["subtitle3", "color-text-low"])}>{blockUrl}</Text>
              </View>
            </>
          }
        </View>
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
        <Button text={panelType === 'change'
              ? getLocale('braveWalletAllowChangeNetworkButton')
              : getLocale('braveWalletAllowAddNetworkButton')} size="small" onPress={panelType === 'add'
              ? onApproveAddNetwork
              : onApproveChangeNetwork} />
      </View>
    </View>
  )
}

export default AllowAddChangeNetworkPanel
