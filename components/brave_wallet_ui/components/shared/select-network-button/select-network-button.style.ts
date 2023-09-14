// Copyright (c) 2022 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at https://mozilla.org/MPL/2.0/.

import { CaratCircleODownIcon } from '../../../assets/svg-icons/nav-button-icons'
import styled from 'styled-components/native'

// icons
// import { CaratCircleODownIcon } from 'brave-ui/components/icons'

interface IsPanelProps {
  isPanel?: boolean
}

export const CaratDownIcon = styled.View<IsPanelProps>`
  width: 14px;
  height: 14px;
  margin-left: 4px;
  color: ${(p) => p.isPanel ? p.theme.palette.white : p.theme.color.interactive07};
  background-color: ${(p) => p.theme.color.interactive07};
  -webkit-mask-image: url(${CaratCircleODownIcon});
  mask-image: url(${CaratCircleODownIcon});
`

export const OvalButton = styled.TouchableOpacity<IsPanelProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  cursor: pointer;
  background-image: none;
  background-color: none;;
  border-radius: 48px;
  padding: 3px 10px;
  border-width: 1px;
  border-style: solid;
  border-color: ${(p) => p.isPanel ? 'rgba(255,255,255,0.5)' : p.theme.color.interactive08};
`

export const OvalButtonText = styled.Text<IsPanelProps>`
  font-family: Poppins;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0.01em;
  color: ${(p) => p.isPanel ? p.theme.palette.white : p.theme.color.text02};
  font-weight: 600;
`
