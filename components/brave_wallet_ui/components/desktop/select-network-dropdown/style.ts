// Copyright (c) 2022 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at https://mozilla.org/MPL/2.0/.

import styled from 'styled-components/native'
import { WalletButton } from '../../shared/style'
import { CaratStrongLeftIcon } from '../../../assets/svg-icons/nav-button-icons'
// import { CaratStrongDownIcon } from 'brave-ui/components/icons'

export const StyledWrapper = styled.View<{ useWithSearch?: boolean }>`
  display: flex;
  width: ${(p) => p.useWithSearch ? 'unset' : '100%'};
  min-width: fit-content;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 9;
`

export const NetworkButton = styled(WalletButton) <{ useWithSearch?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  background-color: ${(p) => p.theme.color.background02};
  min-width: ${(p) => p.useWithSearch ? 'fit-content' : '265px'};
  width: ${(p) => p.useWithSearch ? 'unset' : '100%'};
  height: 40px;
  cursor: pointer;
  background-image: none;
  background-color: none;;
  border: ${(p) => p.useWithSearch ? 'none' : `1px solid ${p.theme.color.interactive08}`};
  border-radius: 4px;
  padding: 10px;
  padding-left: 12px;
  margin-bottom: ${(p) => p.useWithSearch ? '0px' : '8px'};
`

export const DropDownIcon = styled.View <{ isOpen: boolean }>`
  width: 18px;
  height: 18px;
  color: ${(p) => p.theme.color.interactive07};
  transition-duration: 0.3s;
  transform: ${(p) => p.isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  background-color: ${(p) => p.theme.color.interactive07};
  -webkit-mask-image: url(${CaratStrongLeftIcon});
  mask-image: url(${CaratStrongLeftIcon});
`

export const DropDown = styled.View <{ useWithSearch?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 275px;
  max-height: 262px;
  padding: 10px 10px 10px 20px;
  background-color: ${(p) => p.theme.color.background02};
  border-width: 1px;
  border-style: solid;
  border-color: ${(p) => p.theme.color.divider01};
  border-radius: 8px;
  position: absolute;
  top: 44px;
  left: ${(p) => p.useWithSearch ? 'unset' : '0px'};
  right: ${(p) => p.useWithSearch ? '0px' : 'unset'};
  z-index: 12;
  overflow-y: scroll;
  overflow-x: hidden;
 `

export const LeftSide = styled.View`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
  margin-right: 4px;
`

export const NetworkText = styled.Text`
  font-family: Poppins;
  font-style: normal;
  font-size: 13px;
  line-height: 20px;
  letter-spacing: 0.01em;
  color: ${(p) => p.theme.color.text01};
`
