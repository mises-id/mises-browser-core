// Copyright (c) 2022 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at https://mozilla.org/MPL/2.0/.

import styled from 'styled-components/native'
import Icon from '../../../assets/svg-icons/search-icon.svg'

export const StyledWrapper = styled.View<{ useWithFilter?: boolean, width?: string }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  min-height: 36px;
  width: ${(p) => p.width || 'auto'};
  border: ${(p) => p.useWithFilter ? 'none' : `1px solid ${p.theme.color.interactive08}`};
  box-sizing: border-box;
  border-radius: 4px;
  background-color: ${(p) => p.theme.color.background02};
  margin-bottom: ${(p) => p.useWithFilter ? '0px' : '10px'};
  overflow: hidden;
`

export const SearchInput = styled.TextInput<{ useWithFilter?: boolean }>`
  height: 100%;
  background-image: none;
  background-color: ${(p) => p.theme.color.background02};
  border: none;
  font-family: Poppins;
  font-style: normal;
  font-size: ${(p) => p.useWithFilter ? '14px' : '12px'};
  letter-spacing: 0.01em;
  color: ${(p) => p.theme.color.text01};
  ::placeholder {
    font-family: Poppins;
    font-style: normal;
    font-size: 12px;
    letter-spacing: 0.01em;
    color: ${(p) => p.theme.color.text02};
    font-weight: normal;
  }
  ::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
  }
  ::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
  }
`

export const SearchIcon = styled.View`
  width: 15px;
  height: 15px;
  background-image: url(${Icon});
  margin-left: 10px;
  margin-right: 5px;
`
