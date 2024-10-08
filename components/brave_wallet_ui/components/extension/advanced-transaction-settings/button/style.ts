// Copyright (c) 2022 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at https://mozilla.org/MPL/2.0/.
import styled from 'styled-components/native'
// import { SettingsAdvancedIcon } from 'brave-ui/components/icons'

import { WalletButton } from '../../../shared/style'
import { SettingsAdvancedIcon } from '../../../../assets/svg-icons/nav-button-icons'

export const StyledButton = styled(WalletButton)`
  display: flex;
  width: 30px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  cursor: pointer;
  padding: 10px 0px 0px 0px;
  border: none;
  background-image: none;
  background-color: none;;
`

export const SettingsIcon = styled.View`
  padding-bottom: 12px;
  color: ${(p) => p.theme.color.text03};
  background-color: ${(p) => p.theme.color.interactive07};
  -webkit-mask-image: url(${SettingsAdvancedIcon});
  mask-image: url(${SettingsAdvancedIcon});
`

export const TabLine = styled.View`
  display: flex;
  width: 100%;
  height: 2px;
  background-color: ${(p) => p.theme.color.divider01};
`
