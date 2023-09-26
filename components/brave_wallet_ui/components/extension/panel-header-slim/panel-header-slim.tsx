// Copyright (c) 2022 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at https://mozilla.org/MPL/2.0/.
import * as React from 'react'

// Styled Components
import {
  HeaderTitle,
  HeaderWrapper,
  TopRow,
  CloseButton
} from './panel-header-slim.style'

// Constants
import { PanelTypes } from '../../../constants/types'
import { useDispatch } from 'react-redux'
import { WalletActions } from '../../../common/actions'

interface Props {
  title: string
  action: (path: PanelTypes) => void
}

export const PanelHeaderSlim = React.memo(function (props: Props) {
  const { title } = props
  // const navigate = React.useCallback((path: PanelTypes) => () => {
  //   action(path)
  // }, [action])

  const dispatch = useDispatch();

  const closeUI = () => {
    dispatch(WalletActions.closeUI())
  }

  return (
    <HeaderWrapper>
      <TopRow>
        <HeaderTitle>
          {title}
        </HeaderTitle>
        <CloseButton onPress={closeUI} />
      </TopRow>
    </HeaderWrapper>
  )
})

export default PanelHeaderSlim
