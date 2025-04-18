// Copyright (c) 2021 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at https://mozilla.org/MPL/2.0/.
import styled from 'styled-components/native'
import FlashdriveIcon from '../../../assets/svg-icons/flashdrive-icon.svg'
import { WalletButton } from '../../shared/style'

interface StyleProps {
  orb: string
}

export const StyledWrapper = styled.View<{isSelected?: boolean, isOpen?: boolean}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  width: 100%;
  padding: 7px;
  background-color: none;
  border-radius: 10px;
  padding: 8px;
  margin-bottom: 5px;
  border-radius: 12px;
  position: relative;
  z-index: ${p => p.isOpen ? '9' : '1'};
  border-width: 1px;
  border-style: solid;
  border-color: rgb(232, 233, 238);
  background-color: ${p => p.isSelected ? 'rgb(232, 233, 238)' : 'white'};
`

export const NameAndIcon = styled.TouchableOpacity`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
`

export const AccountNameRow = styled.View`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
`

export const RightSide = styled.View`
  align-items: flex-end;
  justify-content: center;
  flex-direction: row;
  position: relative;
  z-index: 9;
`

export const AccountCircle = styled.View<StyleProps>`
  width: 40px;
  height: 40px;
  border-radius: 100%;
  background-image: url(${(p) => p.orb});
  background-size: cover;
  margin-right: 12px;
`

export const Icon = styled.View<{
  icon: string
}>`
  width: 14px;
  height: 14px;
  margin-left: 4px;
  margin-right: 8px;
  background-color: ${(p) => p.theme.color.interactive07};
  -webkit-mask-image: url(${(p) => p.icon});
  mask-image: url(${(p) => p.icon});
  mask-size: 100%;
`

export const OvalButton = styled(WalletButton)`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-image: none;
  background-color: none;;
  border-radius: 48px;
  padding: 3px 10px;
  border-width: 1px;
  border-style: solid;
  border-color: ${(p) => p.theme.color.interactive08};
  margin-right: 6px;
  pointer-events: auto;
  flex-direction: row;
`

export const OvalButtonText = styled.Text`
  font-family: Poppins;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0.01em;
  color: ${(p) => p.theme.color.text02};
  font-weight: 600;
`

export const HardwareIcon = styled.View`
  width: 13px;
  height: 13px;
  background-color: ${(p) => p.theme.color.text02};
  -webkit-mask-image: url(${FlashdriveIcon});
  mask-image: url(${FlashdriveIcon});
`

export const DropDownButton = styled(WalletButton)`
  color: ${(p) => p.theme.color.text01};
`

export const DropDown = styled.View<{isLeft?: boolean}>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  width: 250px;
  padding: 5px;
  background-color: ${(p) => p.theme.color.background02};
  border-width: 1px;
  border-style: solid;
  border-color: ${(p) => p.theme.color.divider01};
  border-radius: 8px;
  position: absolute;
  top: 38px;
  z-index: 9;
  right: ${(p) => !p.isLeft ? '0px' : 'unset'};
  left: ${(p) => p.isLeft ? '0px' : 'unset'};
`
export const PopupStyledWrapper = styled.View<{ yPosition?: number }>`
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
  border: 1px solid rgb(233, 233, 244);
 `