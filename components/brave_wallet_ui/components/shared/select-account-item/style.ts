// Copyright (c) 2021 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at https://mozilla.org/MPL/2.0/.
import styled from 'styled-components/native'
import { WalletButton } from '../style'
import CheckMark from '../../../assets/svg-icons/big-checkmark.svg'

interface StyleProps {
  orb: string
}

export const StyledWrapper = styled(WalletButton)`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  outline: none;
  background-image: none;
  background-color: none;;
  border: none;
  margin-bottom: 10px;
  padding: 0px;
`

export const AccountAndAddress = styled.View`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
`

export const AccountName = styled.Text`
  font-family: Poppins;
  font-size: 13px;
  line-height: 20px;
  letter-spacing: 0.01em;
  font-weight: 600;
  color: ${(p) => p.theme.color.text01};
`

export const AccountAddress = styled.Text`
  font-family: Poppins;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0.01em;
  color: ${(p) => p.theme.color.text03};
`

export const AccountCircle = styled.View<StyleProps>`
  width: 24px;
  height: 24px;
  border-radius: 100%;
  background-image: url(${(p) => p.orb});
  background-size: cover;
  margin-right: 8px;
`

export const BigCheckMark = styled.View`
  width: 14px;
  height: 14px;
  background-color: ${(p) => p.theme.color.text01};
  -webkit-mask-image: url(${CheckMark});
  mask-image: url(${CheckMark});
  margin-right: 8px;
`

export const LeftSide = styled.View`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
  margin-right: 6px;
`

export const SwitchAccountIconContainer = styled.View`
  padding-left: 8;
  padding-right: 8;
`
