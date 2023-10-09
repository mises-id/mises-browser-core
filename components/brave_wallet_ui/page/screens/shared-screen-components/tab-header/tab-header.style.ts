// Copyright (c) 2023 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// You can obtain one at https://mozilla.org/MPL/2.0/.

import styled from 'styled-components/native'
import * as leo from '@brave/leo/tokens/css'
// import Icon from '@brave/leo/react/icon'

// Assets
import BraveLogoLight from '../../send/assets/brave-logo-light.svg'
import BraveLogoDark from '../../send/assets/brave-logo-dark.svg'

// Shared Styles
import { StyledDiv, StyledButton } from '../../send/shared.styles'
import { moreHorizontal } from '../../../../assets/svg-icons/nav-button-icons'

export const HeaderWrapper = styled.View`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  padding: 16px 16px 0px 16px;
  margin-bottom: 45px;
  top: 0;
  left: 0;
  right: 0;
  width: 100vw;
  box-sizing: border-box;
  position: absolute;
  z-index: 10;
`

export const BraveLogo = styled(StyledDiv)`
  height: 30px;
  width: 100px;
  background-image: url(${BraveLogoLight});
  background-size: cover;
  margin: 0px 12px 4px 0px;
  @media (prefers-color-scheme: dark) {
    background-image: url(${BraveLogoDark});
  }
`

export const SettingsWrapper = styled(StyledDiv)`
  position: relative;
  z-index: 9;
`

export const SettingsButton = styled(StyledButton)`
  background-color: ${leo.color.container.background};
  border-radius: 100%;
  height: 40px;
  width: 40px;
  &:hover {
    background-color: ${leo.color.container.background};
  }
`

export const SettingsIcon = styled.View`
  color: ${leo.color.icon.default};
  width: 18px;
  height: 18px;
  background-color: ${(p) => p.theme.color.interactive07};
  -webkit-mask-image: url(${moreHorizontal});
  mask-image: url(${moreHorizontal});
`
