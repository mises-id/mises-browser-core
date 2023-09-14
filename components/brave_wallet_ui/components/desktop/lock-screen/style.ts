// Copyright (c) 2021 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at https://mozilla.org/MPL/2.0/.
import styled from 'styled-components/native'
import SecureIcon from '../../../assets/svg-icons/onboarding/secure-your-crypto.svg'
import SecureIconDark from '../../../assets/svg-icons/onboarding/secure-your-crypto-dark.svg'
import { WalletButton } from '../../shared/style'

export const StyledWrapper = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding-top: 32px;
`

export const Title = styled.Text`
  font-family: Poppins;
  font-size: 20px;
  font-weight: 600;
  line-height: 30px;
  color: ${(p) => p.theme.color.text01};
  letter-spacing: 0.02em;
  margin-bottom: 10px;
  text-align: center;
`

export const PageIcon = styled.View`
  width: 144px;
  height: 130px;
  background-image: url(${SecureIcon});
  background-repeat: no-repeat;
  background-size: 100%;
  margin-bottom: 10px;
  @media (prefers-color-scheme: dark) {
    background-image: url(${SecureIconDark});
  }
`

export const InputColumn = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 250px;
  margin-bottom: 28px;
`

export const RestoreButton = styled(WalletButton)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  cursor: pointer;
  background-image: none;
  background-color: none;;
  border: none;
  font-family: Poppins;
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 19px;
  letter-spacing: 0.01em;
  
  margin-top: 12px;
`
export const RestoreButtonText = styled.Text`
  color: ${(p) => p.theme.color.text03};
`
