// Copyright (c) 2022 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at https://mozilla.org/MPL/2.0/.

import styled from 'styled-components/native'
import { InfoIcon } from '../../../../../../assets/svg-icons/nav-button-icons'
import LinkIcon from '../../../../../../assets/svg-icons/link-icon.svg'
import TrashIcon from '../../../../../../assets/svg-icons/trash-icon.svg'
import { WalletButton } from '../../../../../shared/style'

export const StyledWrapper = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-conent: center;
  padding: 7px;
  background-color: ${(p) => p.theme.color.background02};
  border-radius: 8px;
  position: absolute;
  top: 35px;
  right: 15px;
  z-index: 20;
 `

export const PopupButton = styled(WalletButton)`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  text-align: left;
  cursor: pointer;
  width: 220px;
  border-radius: 8px;
  outline: none;
  border: none;
  background-image: none;
  background-color: none;
  padding: 10px 0px;
  margin: 0px;
  flex-direction: row;
  &:hover {
    background-color: ${(p) => p.theme.color.divider01};
  }
`

export const PopupButtonText = styled.Text`
  flex: 1;
  font-family: Poppins;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.01em;
  line-height: 20px;
  color: ${(p) => p.theme.color.text01};
`
const PopupButtonIcon = styled.View`
 width: 20px;
 height: 20px;
 margin-right: 18px;
 margin-left: 14px;
 mask-size: contain;
 background-color: ${(p) => p.theme.color.interactive07};
`
export const HelpCenterIcon = styled(PopupButtonIcon)`
  -webkit-mask-image: url(${InfoIcon});
  mask-image: url(${InfoIcon});
`

export const ExplorerIcon = styled(PopupButtonIcon)`
 -webkit-mask-image: url(${LinkIcon});
 mask-image: url(${LinkIcon});
`

export const DeleteIcon = styled(PopupButtonIcon)`
 -webkit-mask-image: url(${TrashIcon});
 mask-image: url(${TrashIcon});
`
