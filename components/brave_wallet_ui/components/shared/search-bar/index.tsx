// Copyright (c) 2022 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at https://mozilla.org/MPL/2.0/.

import * as React from 'react'

// Styled Components
import {
  StyledWrapper,
  SearchIcon
} from './style'
import SearchInput from './SearchInput'
import { View } from 'react-native'

interface Props {
  placeholder: string
  action?: React.ChangeEventHandler<HTMLInputElement> | undefined
  autoFocus?: boolean
  value?: string
  useWithFilter?: boolean
  disabled?: boolean
}

export const SearchBar = (props: Props) => {
  const { autoFocus, placeholder, action, value, useWithFilter } = props
  return (
    <StyledWrapper
      useWithFilter={useWithFilter}
    >
      <SearchIcon />
      <View style={{width: '100%'}}>
        <SearchInput
          autoFocus={autoFocus}
          value={value}
          placeholder={placeholder}
          onChange={action}
        />
      </View>
    </StyledWrapper>
  )
}

export default SearchBar
