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
  StyledWrapper,
} from './modal.style'
import { PopupModal } from '../../../../components/extension/popup-modals'
import { useApiProxy } from '../../../../common/hooks/use-api-proxy'
import Input from '../../../../components/rn/Input'
import { Text } from 'react-native'
import { useStyle } from '../../../../page/styles'

interface Props {
  onConfirm: (lockTime: number) => void
  onCancel: () => void
}

// const LEARN_MORE_LINK = 'https://github.com/brave/brave-browser/wiki/NFT-Discovery'

export const AutoTimerModal = ({ onConfirm, onCancel }: Props) => {

  const { keyringService } = useApiProxy()
  const [lockTime, setLockTime] = React.useState('');
  React.useEffect(() => {
    keyringService.getAutoLockMinutes().then((res: {minutes: number}) => {
      setLockTime(`${res.minutes}`);
    })
  }, [])

  const style = useStyle()
  return (
    <PopupModal
      title={getLocale('autoLockMinutesModalHeader')}
      onClose={onCancel}
    >
      <StyledWrapper>
        <Input
          placeholder='Lock Time'
          value={lockTime}
          onChange={(e)=> setLockTime(e.target.value)}
        />
        <ButtonRow>
          <ConfirmButton onPress={() => {
            onConfirm(Number(lockTime))
          }}><Text style={style.flatten(['color-white'])}>{getLocale('braveWalletAllowSpendConfirmButton')}</Text></ConfirmButton>
          <CancelButton onPress={onCancel}><Text>{getLocale('braveWalletCancelHidingToken')}</Text></CancelButton>
        </ButtonRow>
      </StyledWrapper>
    </PopupModal>
  )
}
