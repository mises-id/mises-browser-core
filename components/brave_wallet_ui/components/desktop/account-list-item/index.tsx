// Copyright (c) 2022 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at https://mozilla.org/MPL/2.0/.

import * as React from 'react'
import { create } from 'ethereum-blockies'

// redux
import { useDispatch } from 'react-redux'

// actions
import { AccountsTabActions } from '../../../page/reducers/accounts-tab-reducer'

// utils
import { reduceAddress } from '../../../utils/reduce-address'

// types
import {
  WalletAccountType,
  AccountButtonOptionsObjectType,
  AccountModalTypes
} from '../../../constants/types'

// options
import { AccountButtonOptions } from '../../../options/account-list-button-options'

// components
import { CopyTooltip } from '../../shared/copy-tooltip/copy-tooltip'

import MoreVertical from '../../../assets/svg-icons/more-vertical.svg'
// import { AccountListItemOptionButton } from './account-list-item-option-button'

// style
import {
  StyledWrapper,
  NameAndIcon,
  AccountCircle,
  RightSide,
  HardwareIcon,
  AccountNameRow,
  Icon,
  DropDownButton,
  PopupStyledWrapper,
} from './style'

import {
  AccountAddressButton,
  AccountAndAddress,
  AccountNameButton,
  AddressAndButtonRow,
  CopyIcon
} from '../portfolio-account-item/style'
import { Text } from 'react-native'
import { useUnsafeWalletSelector } from '../../../common/hooks/use-safe-selector'
import { WalletSelectors } from '../../../common/selectors'
import { PopupButton, PopupButtonText } from '../wallet-more-popup/style'
import { getLocale } from '$web-common/locale'
import { WalletActions } from '../../../common/actions'

export interface Props {
  onDelete?: () => void
  onClick: (account: WalletAccountType) => void
  account: WalletAccountType
  isHardwareWallet: boolean
}

export const AccountListItem = ({
  account,
  isHardwareWallet,
  onClick
}: Props) => {
  // redux
  const dispatch = useDispatch()

  // methods
  const onSelectAccount = React.useCallback(() => {
    onClick(account)
  }, [onClick, account])

  const onRemoveAccount = React.useCallback(() => {
    dispatch(AccountsTabActions.setAccountToRemove({ address: account.address, hardware: isHardwareWallet, coin: account.coin, name: account.name }))
  }, [account, isHardwareWallet])

  const onShowAccountsModal = React.useCallback((modalType: AccountModalTypes) => {
    dispatch(AccountsTabActions.setShowAccountModal(true))
    dispatch(AccountsTabActions.setAccountModalType(modalType))
    dispatch(AccountsTabActions.setSelectedAccount(account))
  }, [account, dispatch])

  const onClickButtonOption = React.useCallback((option: AccountButtonOptionsObjectType) => () => {
    if (option.id === 'details') {
      onSelectAccount()
      return
    }
    if (option.id === 'remove') {
      onRemoveAccount()
      return
    }
    onShowAccountsModal(option.id)
  }, [onSelectAccount, onRemoveAccount, onShowAccountsModal])

  // memos
  const orb = React.useMemo(() => {
    return create({ seed: account.address.toLowerCase(), size: 8, scale: 16 }).toDataURL()
  }, [account.address])

  const buttonOptions = React.useMemo((): AccountButtonOptionsObjectType[] => {
    // We are not able to remove a Primary account so we filter out this option.
    if (account.accountType === 'Primary') {
      return AccountButtonOptions.filter((option: AccountButtonOptionsObjectType) => option.id !== 'remove')
    }
    // We are not able to fetch Private Keys for a Hardware account so we filter out this option.
    if (isHardwareWallet) {
      return AccountButtonOptions.filter((option: AccountButtonOptionsObjectType) => option.id !== 'privateKey')
    }
    return AccountButtonOptions
  }, [account, isHardwareWallet])

  const selectedAccount = useUnsafeWalletSelector(WalletSelectors.selectedAccount)

  const [isOpen, setisOpen] = React.useState(false)

  const dropDownPress = () => {
    setisOpen(!isOpen)
  }

  const setSelectAccount = () => {
    dispatch(WalletActions.selectAccount(account))
  }
  // render
  return (
    <StyledWrapper isSelected={selectedAccount?.address.toLowerCase() === account.address.toLowerCase()}>
      <NameAndIcon>
        <AccountCircle orb={orb} />
        <AccountAndAddress>
          <AccountNameRow>
            {isHardwareWallet && <HardwareIcon />}
            <AccountNameButton onPress={setSelectAccount}><Text>{account.name}</Text></AccountNameButton>
          </AccountNameRow>
          <AddressAndButtonRow>
            <AccountAddressButton onPress={setSelectAccount}><Text style={{fontSize: 12}}>{reduceAddress(account.address)}</Text></AccountAddressButton>
            <CopyTooltip text={account.address}>
              <CopyIcon />
            </CopyTooltip>
          </AddressAndButtonRow>
        </AccountAndAddress>
      </NameAndIcon>
      <RightSide>
        <DropDownButton onPress={dropDownPress}>
          <Icon icon={MoreVertical} />
        </DropDownButton>
        {isOpen &&
          <PopupStyledWrapper>
            {buttonOptions.map((option: AccountButtonOptionsObjectType) =>
              <PopupButton onPress={onClickButtonOption(option)}>
                <Icon icon={option.icon} />
                <PopupButtonText>
                  {getLocale(option.name)}
                </PopupButtonText>
              </PopupButton>
            )}
          </PopupStyledWrapper>
        }

        {/* {buttonOptions.map((option: AccountButtonOptionsObjectType) =>
          <AccountListItemOptionButton
            key={option.id}
            option={option}
            onClick={onClickButtonOption(option)}
          />
        )} */}
      </RightSide>
    </StyledWrapper>
  )
}

export default AccountListItem
