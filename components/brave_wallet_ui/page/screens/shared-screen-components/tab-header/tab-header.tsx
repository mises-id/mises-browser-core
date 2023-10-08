// Copyright (c) 2023 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// You can obtain one at https://mozilla.org/MPL/2.0/.

import * as React from 'react'
import { useHistory } from 'react-router-dom'

// Hooks
import { useOnClickOutside } from '../../../../common/hooks/useOnClickOutside'

// Types
import {
  WalletRoutes
} from '../../../../constants/types'


// Styled Components
import {
  HeaderWrapper,
  // BraveLogo,
  SettingsButton,
  SettingsIcon,
  SettingsWrapper
} from './tab-header.style'
import { Row } from '../../send/shared.styles'

// Components
import {
  WalletMorePopup
} from '../../../../components/desktop/wallet-more-popup/index'
import { Image } from 'react-native'
import { StyleSheet } from 'react-native'
import { useStyle } from '../../../../page/styles'
import { NetworkFilterSelector } from '../../../../components/desktop'
import { useGetVisibleNetworksQuery } from '../../../../common/slices/api.slice'
import { ClickAwayArea } from '../../../../components/desktop/network-filter-selector/style'

interface Props {
  title: string
}

export const TabHeader = (props: Props) => {

  // Routing
  const history = useHistory()

  // State
  const [showSettings, setShowSettings] = React.useState<boolean>(false)

  // Refs
  const settingsModalRef = React.useRef<HTMLDivElement>(null)

  // Methods
  const onShowBackup = () => {
    history.push(WalletRoutes.Backup)
  }

  const onShowConnectedSites = () => {
    history.push(WalletRoutes.ConnectedSites)
  }

  const onShowSetting = () => {
    history.push(WalletRoutes.Settings)
  }

  // Hooks
  useOnClickOutside(
    settingsModalRef,
    () => setShowSettings(false),
    showSettings
  )

  const style = useStyle()

  const { data: networks } = useGetVisibleNetworksQuery()


  // render
  return (
    <HeaderWrapper>
      <Row rowHeight='full' verticalAlign='center'>
        {/* <BraveLogo /> */}
        <Image
          style={StyleSheet.flatten([
            style.flatten(["height-30"]),
            {
              width: '40px',
              marginRight: '10px'
            }
          ])}
          fadeDuration={0}
          resizeMode="contain"
          source={require("../../../../page/assets/logo/mises-symbol.png")}
        />
        <NetworkFilterSelector 
          isLeft 
          networkListSubset={networks || []} 
          hiddenText
          shape="rounded"
        />
        {/* <HorizontalDivider height={22} marginRight={12} />
        <Text textSize='18px' textColor='text02' isBold={true}>
          {getLocale(title)}
        </Text> */}
      </Row>
      <SettingsWrapper
      >
        <SettingsButton onPress={() => setShowSettings(prev => !prev)}>
          <SettingsIcon  />
        </SettingsButton>
        {showSettings &&
          <WalletMorePopup
            onClickBackup={onShowBackup}
            onClickSetting={onShowSetting}
            onClickConnectedSites={onShowConnectedSites}
            onClosePopup={() => setShowSettings(false)}
            yPosition={50}
          />
        }
      </SettingsWrapper>
      {showSettings &&
        <ClickAwayArea onPress={() => setShowSettings(false)} />
      }
    </HeaderWrapper>
  )
}

export default TabHeader
