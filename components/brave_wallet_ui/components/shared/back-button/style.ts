// Copyright (c) 2021 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at https://mozilla.org/MPL/2.0/.
import styled from 'styled-components/native'
import { WalletButton } from '../style'
import { CaratStrongLeftIcon } from '../../../assets/svg-icons/nav-button-icons'

// Will use brave-ui button comp in the future!
// Currently is missing "tiny" variant
export const StyledWrapper = styled(WalletButton)`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-direction: row;
  background-image: none;
  background-color: none;
  padding: 3px 14px;
  font-family: Poppins;
  font-weight: 600;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0.01em;
  color: ${(p) => p.theme.color.interactive07};
  border: ${(p) => `1px solid ${p.theme.color.interactive08}`};
  border-radius: 48px;
`

export const BackIcon = styled.View`
  width: 12px;
  height: 14px;
  margin-right: 8px;
  transform: rotate(90deg);
  color: ${(p) => p.theme.color.text03};
  background-color: ${(p) => p.theme.color.interactive07};
  -webkit-mask-image: url(${CaratStrongLeftIcon});
  mask-image: url(${CaratStrongLeftIcon});
`
