// Copyright (c) 2021 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at https://mozilla.org/MPL/2.0/.
import styled from 'styled-components/native'
import { WalletButton } from '../../shared/style'
interface StyleProps {
  orb: string
}

export const StyledWrapper = styled.View`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  width: 100%;
  padding-bottom: 8px;
`

export const NameAndAddressColumn = styled.View`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  margin-left: 12px;
`

export const LeftSide = styled.View`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
`

export const RightSide = styled.View`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-direction: column;
  margin-right: 10px;
`

export const AccountCircle = styled.View<StyleProps>`
  width: 40px;
  height: 40px;
  border-radius: 100%;
  background-image: url(${(p) => p.orb});
  background-size: cover;
`

export const AccountNameText = styled.Text`
  font-family: Poppins;
  font-size: 13px;
  line-height: 20px;
  font-weight: 600;
  color: ${(p) => p.theme.color.text01};
`

export const AccountAddressText = styled.Text`
  font-family: Poppins;
  font-size: 12px;
  line-height: 18px;
  font-weight: 400;
  color: ${(p) => p.theme.color.text02};
`

export const PrimaryButton = styled(WalletButton) <Partial<StyleProps>>`
  display: flex;
  cursor: pointer;
  border: none;
  background-image: none;
  background-color: none;;
  padding: 0px;
  margin: 0px;
  font-family: Poppins;
  font-size: 12px;
  font-weight: 600;
  color: ${(p) => p.theme.color.interactive05};
  @media (prefers-color-scheme: dark) {
    color: ${(p) => p.theme.palette.blurple300};
  }
  letter-spacing: 0.01em;
`
