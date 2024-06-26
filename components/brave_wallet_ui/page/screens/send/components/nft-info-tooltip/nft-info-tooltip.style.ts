// Copyright (c) 2022 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at https://mozilla.org/MPL/2.0/.

import styled from 'styled-components/native'

// Shared Styles
import { StyledDiv, Icon, StyledButton } from '../../shared.styles'

export const Wrapper = styled.TouchableOpacity`
  display: flex;
  position: relative;
  height: 100%;
  align-items: center;
  width: 40px;
  justify-content: flex-end;
`

export const Tip = styled(StyledDiv)`
  position: absolute;
  border-radius: 16px;
  padding: 16px;
  z-index: 10;
  right: 8px;
  top: 42px;
  width: 220px;
  background-color: ${(p) => p.theme.color.background01};
  border-width: 1px;
  border-style: solid;
  border-color:  ${p => p.theme.color.divider01};
  white-space: normal; 
`

export const TipIcon = styled(Icon)`
  background-color: ${(p) => p.theme.color.text02};
  margin-right: 8px;
`

export const AddressLink = styled(StyledButton)`
  --text-color: ${(p) => p.theme.color.interactive05};
  @media (prefers-color-scheme: dark) {
    --text-color: ${(p) => p.theme.palette.blurple500};
  }
  color: var(--text-color);
  font-size: 14px;
  padding: 0px;
`
