// Copyright (c) 2021 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at https://mozilla.org/MPL/2.0/.
import * as React from 'react'

import { SearchBar } from '../../shared'

// Styled Components
import {
  HeaderTitle,
  HeaderWrapper,
  TopRow,
  CloseButton
} from './style'
import { getLocale } from '../../../../common/locale'
import { PanelTypes } from '../../../constants/types'
import { WalletActions } from '../../../common/actions'
import { useDispatch } from 'react-redux'

export interface Props {
  title: string
  action: (path: PanelTypes) => void
  useSearch?: boolean | undefined
  searchAction?: (event: any) => void | undefined
}

const PanelHeader: React.FC<Props> = (props) => {
  const { title, searchAction, useSearch } = props;

  const dispatch = useDispatch();

  const closeUI = () => {
    dispatch(WalletActions.closeUI())
  }


  return (
    <HeaderWrapper hasSearch={useSearch || false}>
      <TopRow>
        <HeaderTitle>{title}</HeaderTitle>
        <CloseButton onPress={closeUI} />
      </TopRow>
      {useSearch &&
        <SearchBar
          placeholder={getLocale('braveWalletSearchText')}
          action={searchAction}
        />
      }
    </HeaderWrapper>
  )
}

export default PanelHeader