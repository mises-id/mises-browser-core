// Copyright (c) 2021 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at https://mozilla.org/MPL/2.0/.
import styled from 'styled-components/native'
import FlashdriveIcon from '../../../../assets/svg-icons/flashdrive-icon.svg'
import { WalletButton } from '../../../shared/style'
import { WalletAddIcon } from '../../../../assets/svg-icons/nav-button-icons'

interface StyleProps {
  isHardwareWallet: boolean
  orb: string
}

export const StyledWrapper = styled.View`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
`

export const PrimaryListContainer = styled.View`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  // background-color: ${(p) => p.theme.color.divider01};
  // border-radius: 16px;
  margin-top: 14px;
  margin-bottom: 14px;
  // padding: 8px;
  position: relative;
  z-index: 9;
`

export const SecondaryListContainer = styled.View<Partial<StyleProps>>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  padding: 8px 0;
  margin-bottom: ${(p) => p.isHardwareWallet ? '15px' : '0px'};
  position: relative;
  z-index: 9;
`

export const SectionTitle = styled.Text`
  font-family: Poppins;
  font-size: 15px;
  line-height: 20px;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: ${(p) => p.theme.color.text02};
  margin-top: 10px;
`

export const DisclaimerText = styled.Text`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: row;
  max-width: 760px;
  font-family: Poppins;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0.01em;
  text-align: flex-start;
  margin-bottom: 14px;
  margin-top: 6px;
  color: ${(p) => p.theme.color.text03};
`

export const SubDivider = styled.View`
  width: 100%;
  height: 2px;
  background-color: ${(p) => p.theme.color.divider01};
`

export const TopRow = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
`

export const WalletInfoRow = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 30px;
`

export const WalletInfoLeftSide = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

export const AccountCircle = styled.View<Partial<StyleProps>>`
  width: 40px;
  height: 40px;
  border-radius: 100%;
  background-image: url(${(p) => p.orb});
  background-size: cover;
  margin-right: 14px;
`
export const WalletInfo = styled.View`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

export const WalletName = styled.Text`
  font-family: Poppins;
  font-size: 20px;
  line-height: 30px;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: ${(p) => p.theme.color.text02};
  margin-right: 15px;
`

export const WalletAddress = styled.Text`
  font-family: Poppins;
  font-size: 15px;
  line-height: 20px;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: ${(p) => p.theme.color.text03};
  margin-right: 15px;
  cursor: pointer;
  background-image: none;
  background-color: none;;
  border: none;
`

export const SubviewSectionTitle = styled.Text`
  font-family: Poppins;
  font-size: 15px;
  line-height: 20px;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: ${(p) => p.theme.color.text02};
  margin-bottom: 10px;
`

export const TransactionPlaceholderContainer = styled.View`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  height: 100px;
  padding-top: 10px;
`

export const ButtonRow = styled.View`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  margin-bottom: 20px;
`

export const StyledButton = styled(WalletButton)`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 40px;
  padding: 12px 22px;
  background-color: transparent;
  border-width: 1px;
  flex-direction: row;
  border-style: solid;
  border-color: ${(p) => p.theme.color.interactive08};
  margin-right: 8px;
`

export const ButtonText = styled.Text`
  font-size: 13px;
  font-weight: 600;
  color: ${(p) => p.theme.color.interactive07};
`

export const WalletIcon = styled.View`
  width: 15px;
  height: 15px;
  color: ${(p) => p.theme.color.text02};
  margin-right: 8px;
  background-color: ${(p) => p.theme.color.text02};
  -webkit-mask-image: url(${WalletAddIcon});
  mask-image: url(${WalletAddIcon});
`

export const HardwareIcon = styled.View`
  width: 15px;
  height: 15px;
  background-color: ${(p) => p.theme.color.text02};
  -webkit-mask-image: url(${FlashdriveIcon});
  mask-image: url(${FlashdriveIcon});
  mask-size: cover;
  margin-right: 8px;
`

export const AccountButtonsRow = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`
