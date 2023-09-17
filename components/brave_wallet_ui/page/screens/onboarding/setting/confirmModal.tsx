// Copyright (c) 2023 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// You can obtain one at https://mozilla.org/MPL/2.0/.
import * as React from 'react'

// utils
import { getLocale } from '../../../../../common/locale'

// components

// styles
import {
  ButtonRow,
  CancelButton,
  ConfirmButton,
  Description,
  StyledWrapper,
} from './modal.style'
import { PopupModal } from '../../../../components/extension/popup-modals'
import { Text } from 'react-native'
import { useStyle } from '../../../../page/styles'

interface Props {
  onConfirm: () => void
  onCancel: () => void
}

// const LEARN_MORE_LINK = 'https://github.com/brave/brave-browser/wiki/NFT-Discovery'

export const ConfirmModal = ({ onConfirm, onCancel }: Props) => {

  const style = useStyle()
  return (
    <PopupModal
      title="Confirm"
      onClose={onCancel}
    >
      <StyledWrapper>
        <Description>
          Are you sure you want to reset your wallet? If your wallet is not backed up, resetting will cause you to lose all account data (including any associated funds).
        </Description>
        <ButtonRow>
          <ConfirmButton onPress={onConfirm}><Text style={style.flatten(['color-white'])}>{getLocale('braveWalletAllowSpendConfirmButton')}</Text></ConfirmButton>
          <CancelButton onPress={onCancel}><Text>{getLocale('braveWalletCancelHidingToken')}</Text></CancelButton>
        </ButtonRow>
      </StyledWrapper>
    </PopupModal>
  )
}
