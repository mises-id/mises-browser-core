// Copyright (c) 2022 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at https://mozilla.org/MPL/2.0/.

import * as React from 'react'

// utils
import { getLocale } from '../../../../common/locale'

// Styled Components
import {
  HeaderTitle,
  HeaderWrapper,
  ActionIcon,
  ExpandIcon
} from './style'

// components
import { WalletMorePopup } from '../../desktop'
import { PanelTypes } from '../../../constants/types'

export interface Props {
  onExpand: () => void
  onClickMore: () => void
  onClickViewOnBlockExplorer?: () => void
  onClickViewOnActivity?: (path: PanelTypes) => void
  showMore: boolean
}

export const ConnectedHeader = (props: Props) => {
  const {
    onClickMore,
    onExpand,
    onClickViewOnBlockExplorer,
    onClickViewOnActivity,
    showMore
  } = props

  // render
  return (
    <HeaderWrapper>
      <ExpandIcon onPress={onExpand} />
      <HeaderTitle>{getLocale('braveWalletPanelTitle')}</HeaderTitle>
      <ActionIcon onPress={onClickMore} />
      {showMore &&
        <WalletMorePopup
          onClickViewOnActivity={onClickViewOnActivity}
          onClickViewOnBlockExplorer={onClickViewOnBlockExplorer}
        />
      }
    </HeaderWrapper>
  )
}

export default ConnectedHeader
