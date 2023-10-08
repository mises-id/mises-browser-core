// Copyright (c) 2021 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at https://mozilla.org/MPL/2.0/.
import styled from 'styled-components/native'
// import { AlertCircleIcon, ArrowRightIcon } from 'brave-ui/components/icons'

import { WalletButton } from '../../shared/style'

interface StyleProps {
  orb: string
}

export const StyledWrapper = styled.View`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`

export const TransactionValue = styled.Text`
  font-family: Poppins;
  font-size: 18px;
  line-height: 22px;
  letter-spacing: 0.02em;
  color: ${(p) => p.theme.color.text01};
  font-weight: 600;
`

export const PanelDescription = styled.Text`
  font-family: Poppins;
  font-size: 12px;
  letter-spacing: 0.01em;
  color: ${(p) => p.theme.color.text02};
  height: 18px;
`

export const FromCircle = styled.View<Partial<StyleProps>>`
  width: 40px;
  height: 40px;
  border-radius: 100%;
  background-image: url(${(p) => p.orb});
  background-size: cover;
`

export const ToCircle = styled.View<Partial<StyleProps>>`
  width: 24px;
  height: 24px;
  border-radius: 100%;
  background-image: url(${(p) => p.orb});
  background-size: cover;
  position: absolute;
  left: 24px;
`

export const OrbContainer = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: relative;
  padding-right: 12px;
  margin-bottom: 10px;
`

export const DetailRow = styled.View`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  padding: 6px;
`

export const DetailTitle = styled.Text`
  font-family: Poppins;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0.01em;
  color: ${(p) => p.theme.color.text01};
  font-weight: 600;
`

export const SpacerText = styled.Text`
  font-family: Poppins;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0.01em;
  color: ${(p) => p.theme.color.text02};
  font-weight: 600;
  margin: 0px 6px;
`

export const DetailButton = styled(WalletButton)`
  font-family: Poppins;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0.01em;
  color: ${(p) => p.theme.color.interactive05};
  background-image: none;
  background-color: none;;
  cursor: pointer;
  border: none;
  margin: 0px;
  padding: 0px;
`

export const StatusRow = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

export const BalanceColumn = styled.View`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
`

export const FromToRow = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  width: 100%;
  margin-bottom: 8px;
`

export const ArrowIcon = styled.View`
  width: auto;
  height: 16px;
  margin-right: 6px;
  margin-left: 6px;
  color: ${(p) => p.theme.color.text03};
`

export const AccountNameText = styled.Text`
  cursor: default;
  font-family: Poppins;
  font-size: 13px;
  line-height: 20px;
  font-weight: 600;
  letter-spacing: 0.01em;
  color: ${(p) => p.theme.color.text02};
`

export const AlertIcon = styled.View`
  width: 14px;
  height: 14px;
  color: ${(p) => p.theme.color.interactive05};
  padding-left: 2px;
`
