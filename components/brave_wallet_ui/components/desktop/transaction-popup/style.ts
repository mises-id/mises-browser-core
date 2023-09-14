// Copyright (c) 2021 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at https://mozilla.org/MPL/2.0/.
import styled from 'styled-components/native'
import { WalletButton } from '../../shared/style'

export const StyledWrapper = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 7px;
  background-color: ${(p) => p.theme.color.background02};
  border-radius: 8px;
  position: absolute;
  top: 15px;
  right: 15px;
  z-index: 15;
 `

export const PopupButton = styled(WalletButton)`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
  border-radius: 8px;
  border: none;
  background-image: none;
  background-color: none;;
  padding: 10px;
  margin: 0px;
  background-color: transparent;
  &:hover {
    background-color: ${(p) => p.theme.color.divider01};
  }
`

export const PopupButtonText = styled.Text`
  font-family: Poppins;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.01em;
  line-height: 20px;
  color: ${(p) => p.theme.color.text01};
`

export const ClickAwayContainer = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  position: fixed;
  z-index: 10;
`
