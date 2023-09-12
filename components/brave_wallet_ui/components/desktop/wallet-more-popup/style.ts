// Copyright (c) 2021 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at https://mozilla.org/MPL/2.0/.
import styled from 'styled-components/native'
// import { OpenNewIcon } from 'brave-ui/components/icons'
import { LockIconD, SafeIcon, InternetIcon, InfoIcon, SettingsAdvancedIcon } from '../../../assets/svg-icons/nav-button-icons'

export const StyledWrapper = styled.View<{ yPosition?: number }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-conent: center;
  padding: 7px;
  background-color: ${(p) => p.theme.color.background02};
  border-radius: 8px;
  position: absolute;
  top: ${(p) => p.yPosition !== undefined ? p.yPosition : 35}px;
  right: 15px;
  z-index: 20;
 `

export const PopupButton = styled.TouchableOpacity`
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
  padding: 10px 0px;
  margin: 0px;
  background-color: transparent;
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

export const SettingsIcon = styled.View`
 width: 20px;
 height: 20px;
 margin-right: 18px;
 margin-left: 14px;
 background-color: ${(p) => p.theme.color.interactive07};
 -webkit-mask-image: url(${SettingsAdvancedIcon});
 mask-image: url(${SettingsAdvancedIcon});
 mask-size: contain;
`

export const ExplorerIcon = styled.View`
  width: 20px;
  height: 20px;
  color: ${(p) => p.theme.color.interactive07};
  margin-right: 18px;
  margin-left: 14px;
`

export const LockIcon = styled.View`
  width: 20px;
  height: 20px;
  margin-right: 18px;
  margin-left: 14px;
  background-color: ${(p) => p.theme.color.interactive07};
  -webkit-mask-image: url(${LockIconD});
  mask-image: url(${LockIconD});
`

export const BackupIcon = styled.View`
  width: 20px;
  height: 20px;
  margin-right: 18px;
  margin-left: 14px;
  background-color: ${(p) => p.theme.color.interactive07};
  -webkit-mask-image: url(${SafeIcon});
  mask-image: url(${SafeIcon});
`

export const ConnectedSitesIcon = styled.View`
  width: 20px;
  height: 20px;
  margin-right: 18px;
  margin-left: 14px;
  background-color: ${(p) => p.theme.color.interactive07};
  -webkit-mask-image: url(${InternetIcon});
  mask-image: url(${InternetIcon});
  mask-size: contain;
`

export const HelpCenterIcon = styled.View`
  width: 20px;
  height: 20px;
  margin-right: 18px;
  margin-left: 14px;
  background-color: ${(p) => p.theme.color.interactive07};
  -webkit-mask-image: url(${InfoIcon});
  mask-image: url(${InfoIcon});
  mask-size: contain;
`
