// Copyright (c) 2021 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at https://mozilla.org/MPL/2.0/.
import styled from 'styled-components/native'
// import { MoreVertRIcon } from 'brave-ui/components/icons'
import { WalletButton } from '../../shared/style'
import ClipboardIcon from '../../../assets/svg-icons/copy-to-clipboard-icon.svg'

interface StyleProps {
  orb: string
}

export const StyledWrapper = styled.TouchableOpacity`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  width: 100%;
  margin: 10px 0px;
  position: relative;
`

export const NameAndIcon = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
`

export const AccountAndAddress = styled.View`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
`

export const AccountNameButton = styled(WalletButton)`
  cursor: pointer;
  background-image: none;
  background-color: none;;
  border: none;
  font-family: Poppins;
  font-size: 13px;
  line-height: 20px;
  letter-spacing: 0.01em;
  font-weight: 600;
`
export const AccountNameButtonText = styled.Text`
  color: ${(p) => p.theme.color.text01};
`

export const AccountAddressButton = styled(AccountNameButton)`
  font-size: 12px;
  line-height: 18px;
  font-weight: 400;
  color: ${(p) => p.theme.color.text02};
`
export const AccountAddressButtonText = styled.Text`
  color: ${(p) => p.theme.color.text02};
`

export const AddressAndButtonRow = styled.View`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
`

export const BalanceColumn = styled.View`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  flex-direction: column;
  margin-right: 20px;
`

export const RightSide = styled.View`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  flex-direction: row;
`

export const FiatBalanceText = styled.Text`
  font-family: Poppins;
  font-size: 13px;
  line-height: 20px;
  letter-spacing: 0.01em;
  color: ${(p) => p.theme.color.text01};
`

export const AssetBalanceText = styled.Text`
  font-family: Poppins;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0.01em;
  color: ${(p) => p.theme.color.text03};
`

export const AccountCircle = styled.View<StyleProps>`
  width: 40px;
  height: 40px;
  border-radius: 100%;
  background-image: url(${(p) => p.orb});
  background-size: cover;
  margin-right: 12px;
`

export const MoreButton = styled(WalletButton)`
  display: flex;;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-image: none;
  background-color: none;;
  border: none;
`

export const MoreIcon = styled.View`
  width: auto;
  height: 26px;
  transform: rotate(90deg);
  color: ${(p) => p.theme.color.interactive08};
`

export const CopyIcon = styled.View`
  cursor: pointer;
  width: 14px;
  height: 14px;
  background-color: ${(p) => p.theme.color.interactive07};
  -webkit-mask-image: url(${ClipboardIcon});
  mask-image: url(${ClipboardIcon});
  mask-size: cover;
  margin-left: 6px;
`
