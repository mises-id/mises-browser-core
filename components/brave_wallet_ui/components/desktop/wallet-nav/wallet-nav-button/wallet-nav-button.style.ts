// Copyright (c) 2023 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// You can obtain one at https://mozilla.org/MPL/2.0/.

import styled from 'styled-components/native'
// import Icon from '@brave/leo/react/icon'
import { WalletButton, Text } from '../../../shared/style'

export const StyledButton = styled(WalletButton) <{ isSelected?: boolean }>`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
  flex: 1;
  cursor: pointer;
  border: none;
  background-image: none;
  background-color: ${(p) => p.isSelected
    ? 'rgb(240, 241, 244)'
    : 'none'};
  color: var(--nav-button-color);
  font-weight: 600;
  font-size: 16px;
  font-family: 'Poppins';
  border-radius: 6px;
  padding: 5px 0;
  &:hover {
    background-color: rgb(240, 241, 244);
  }
  &:last-child {
    margin-bottom: 0px;
  }
  transition-duration: inherit;
`

export const ButtonIcon = styled.View<{icon: any}>`
  color: var(--nav-button-color);
  margin-right: var(--icon-margin-right);
  transition-duration: inherit;
  color: ${(p) => p.theme.color.text02};
  background-color: ${(p) => p.theme.color.interactive07};
  -webkit-mask-image: url(${(p) => p.icon});
  mask-image: url(${(p) => p.icon});
  width: 18px;
  height: 18px;
`

export const ButtonText = styled(Text)`
  color: var(--nav-button-color);
  transition-duration: inherit;
`
