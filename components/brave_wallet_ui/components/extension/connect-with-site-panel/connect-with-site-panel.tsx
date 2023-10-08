// Copyright (c) 2023 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// You can obtain one at https://mozilla.org/MPL/2.0/.

import * as React from 'react'

// Redux
import { useDispatch } from 'react-redux'

// Actions
import { PanelActions } from '../../../panel/actions'

// Types
import {
  WalletAccountType,
  SerializableOriginInfo,
  WalletRoutes,
  BraveWallet,
  DAppConnectedPermissionsOption
} from '../../../constants/types'

// Options
import {
  DAppPermittedOptions,
  DAppNotPermittedOptions
} from '../../../options/dapp-connected-permissions'

// Components
import { ConnectWithSiteHeader } from './connect-with-site-header/connect-with-site-header'
import { SelectAccountItem } from './select-account-item/select-account-item'
import { PermissionDurationDropdown } from './permission-duration-dropdown/permission-duration-dropdown'

// Styled Components
import {
  StyledWrapper,
  ScrollContainer,
  // BackgroundContainer,
  SelectAddressContainer,
  ButtonRow,
  PermissionsWrapper,
  PermissionsContainer,
  SectionLabel,
  SectionPoint,
  BulletContainer,
  // BulletIcon,
  AddAccountText,
  // AddAcountIcon,
  IconCircle,
  WhiteSpace,
  NavButton
} from './connect-with-site-panel.style'
import {
  ConnectPanelButton,
  AccountNameText
} from './select-account-item/select-account-item.style'
import {
  Row,
  HorizontalSpace,
  VerticalSpace,
  VerticalDivider
} from '../../shared/style'

// Utils
import { getLocale } from '../../../../common/locale'
import { Text, TouchableOpacity } from 'react-native'
import { useStyle } from '../../../page/styles'
import { WalletActions } from '../../../common/actions'

const onClickAddAccount = () => {
  chrome.tabs.create(
    { url: `chrome://wallet${WalletRoutes.AddAccountModal}` },
    () => {
      if (chrome.runtime.lastError) {
        console.error(
          'tabs.create failed: ' + chrome.runtime.lastError.message
        )
      }
    }
  )
}
interface Props {
  originInfo: SerializableOriginInfo
  accountsToConnect: WalletAccountType[]
}

export const ConnectWithSite = (props: Props) => {
  const { originInfo, accountsToConnect } = props
  const style = useStyle()
  // Redux
  const dispatch = useDispatch()

  // State
  const [addressToConnect, setAddressToConnect] = React.useState<string>()
  const [addressInfoToConnect, setAddressInfoToConnect] = React.useState<WalletAccountType>()
  const [selectedDuration, setSelectedDuration] =
    React.useState<BraveWallet.PermissionLifetimeOption>(
      BraveWallet.PermissionLifetimeOption.k24Hours
    )
  const [isReadyToConnect, setIsReadyToConnect] = React.useState<boolean>(false)
  const [isScrolled, setIsScrolled] = React.useState<boolean>(false)

  // Refs
  // let scrollRef = React.useRef<HTMLDivElement | null>(null)

  // Methods
  const onNext = React.useCallback(() => {
    if (!isReadyToConnect) {
      setIsReadyToConnect(true)
      return
    }
    if (addressToConnect) {
      console.log("addressToConnect", originInfo, addressToConnect)
      dispatch(
        PanelActions.connectToSite({
          addressToConnect: addressToConnect,
          duration: selectedDuration
        })
      )
      if(addressInfoToConnect) {
        dispatch(WalletActions.selectAccount(addressInfoToConnect))
        console.log(addressInfoToConnect, "addressInfoToConnect")
      }
    }
  }, [isReadyToConnect, addressToConnect, selectedDuration])

  const onCancel = React.useCallback(() => {
    dispatch(PanelActions.cancelConnectToSite())
  }, [])

  const onSelectAccount = React.useCallback(
    (account: WalletAccountType) => () => {
      if (addressToConnect === account.address) {
        setAddressToConnect(undefined)
        return
      }
      setAddressToConnect(account.address)
      setAddressInfoToConnect(account)
    },
    [addressToConnect]
  )

  const onScroll = (scrollTop: number) => {
    if (scrollTop !== null) {
        setIsScrolled(scrollTop > 40);
    }
  }

  return (
    <StyledWrapper>
      {/* <BackgroundContainer
        backgroundImage={`chrome://favicon/size/64@1x/${originInfo.originSpec}`}
      /> */}

      <ConnectWithSiteHeader
        isScrolled={isScrolled}
        isReadyToConnect={isReadyToConnect}
        address={addressToConnect}
        onBack={() => setIsReadyToConnect(false)}
        originInfo={originInfo}
      />

      <ScrollContainer onScroll={({ nativeEvent }) => {
        onScroll(nativeEvent.contentOffset.y);
      }}>
        {!isReadyToConnect && (
          <>
            <SelectAddressContainer>
              <TouchableOpacity onPress={onClickAddAccount} style={{width: '100%'}}>
                <ConnectPanelButton border="bottom">
                  <Row padding="8px 0px" justifyContent="space-between">
                    <Row justifyContent="flex-start">
                      <IconCircle>
                        {/* <AddAcountIcon name="plus-add" /> */}
                      </IconCircle>
                      <AddAccountText>
                        {getLocale('braveWalletAddAccount')}
                      </AddAccountText>
                    </Row>
                    {/* <AddAcountIcon name="arrow-right" /> */}
                  </Row>
                </ConnectPanelButton>
              </TouchableOpacity>
              <Row padding="8px 0px" justifyContent="flex-start">
                <AccountNameText>
                  {getLocale('braveWalletConnectWithSite')}
                </AccountNameText>
              </Row>
              {accountsToConnect.map((account) => (
                <SelectAccountItem
                  key={account.id}
                  onSelectAccount={onSelectAccount(account)}
                  account={account}
                  isSelected={addressToConnect === account.address}
                />
              ))}
            </SelectAddressContainer>
            <WhiteSpace />
          </>
        )}

        {isReadyToConnect && (
          <PermissionsWrapper
            fullHeight={false}
            fullWidth={true}
            padding="0px 16px 20px 16px"
          >
            <PermissionsContainer
              fullHeight={true}
              fullWidth={true}
              justifyContent="flex-start"
              alignItems="flex-start"
              padding="8px 16px 16px 16px"
            >
              <SectionLabel style={style.flatten(['dark:color-white'])}>
                {getLocale('braveWalletPermissionDuration')}
              </SectionLabel>
              <PermissionDurationDropdown
                selectedDuration={selectedDuration}
                setSelectedDuration={setSelectedDuration}
              />
              <VerticalDivider />
              <VerticalSpace space="8px" />
              <SectionLabel style={style.flatten(['dark:color-white'])}>
                {getLocale('braveWalletConnectPermittedLabel')}
              </SectionLabel>
              {DAppPermittedOptions.map(
                (option: DAppConnectedPermissionsOption, index) => (
                  <Row
                    key={option.name}
                    marginBottom={
                      DAppPermittedOptions.length < 2
                        ? 0
                        : index === DAppPermittedOptions.length - 1
                          ? 16
                          : 8
                    }
                    justifyContent="flex-start"
                  >
                    <BulletContainer status="success">
                      {/* <BulletIcon status="success" name="check-normal" /> */}
                    </BulletContainer>
                    <SectionPoint>{getLocale(option.name)}</SectionPoint>
                  </Row>
                )
              )}
              <SectionLabel style={style.flatten(['dark:color-white'])}>
                {getLocale('braveWalletConnectNotPermittedLabel')}
              </SectionLabel>
              {DAppNotPermittedOptions.map(
                (option: DAppConnectedPermissionsOption, index) => (
                  <Row
                    key={option.name}
                    marginBottom={
                      DAppNotPermittedOptions.length < 2
                        ? 0
                        : index === DAppPermittedOptions.length - 1
                          ? 16
                          : 8
                    }
                    justifyContent="flex-start"
                  >
                    <BulletContainer status="error">
                      {/* <BulletIcon status="error" name="close" /> */}
                    </BulletContainer>
                    <SectionPoint>{getLocale(option.name)}</SectionPoint>
                  </Row>
                )
              )}
            </PermissionsContainer>
          </PermissionsWrapper>
        )}
      </ScrollContainer>
      <ButtonRow padding={16} isReadyToConnect={isReadyToConnect}>
        <NavButton onPress={onCancel} style={style.flatten(['border-color-blue-600', 'border-width-1', 'border-solid'])}>
          <Text style={style.flatten(['color-black', 'dark:color-white'])}>{getLocale('braveWalletButtonCancel')}</Text>
        </NavButton>
        <HorizontalSpace space="16px" />
        <NavButton
          disabled={!addressToConnect}
          onPress={onNext}
          style={style.flatten([`${!addressToConnect ? 'background-color-blue-600@10%' : 'background-color-blue-600'}`, 'border-width-1', 'border-solid', `${!addressToConnect ? 'background-color-blue-600@10%' : 'background-color-blue-600'}`])}
        >
          <Text style={style.flatten(['color-white'])}>
            {isReadyToConnect
            ? getLocale('braveWalletAddAccountConnect')
            : getLocale('braveWalletConnectWithSiteNext')}
          </Text>
        </NavButton>
      </ButtonRow>
    </StyledWrapper>
  )
}

export default ConnectWithSite
