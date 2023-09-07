// Copyright (c) 2021 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at https://mozilla.org/MPL/2.0/.
import styled from 'styled-components/native'
// import { ArrowRightIcon } from 'brave-ui/components/icons'
import { WalletButton } from '../../shared/style'

interface StyleProps {
  orb: string
}

export const StyledWrapper = styled(WalletButton)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  width: 100%;
  margin: 8px 0px;
  cursor: pointer;
  outline: none;
  background-image: none;
  background-color: none;;
  border: none;
  border-radius: 8px;
  padding: 5px;
  &:hover {
    background-color: ${(p) => p.theme.color.background02};
  }
`

export const AddressText = styled.Text`
  font-family: Poppins;
  font-size: 13px;
  line-height: 20px;
  letter-spacing: 0.01em;
  font-weight: 600;
  color: ${(p) => p.theme.color.text01};
  margin: 0px 5px;
`

export const DetailText = styled.Text`
  font-family: Poppins;
  font-size: 13px;
  line-height: 20px;
  letter-spacing: 0.01em;
  font-weight: 400;
  color: ${(p) => p.theme.color.text02};
`

export const DetailWrappedText = styled(DetailText)`
  word-break: break-all;
  white-space: pre-line;
`

export const FromCircle = styled.View<Partial<StyleProps>>`
  width: 40px;
  height: 40px;
  border-radius: 100%;
  background-image: url(${(p) => p.orb});
  background-size: cover;
  margin-right: 20px;
`

export const ToCircle = styled.View<Partial<StyleProps>>`
  width: 24px;
  height: 24px;
  border-radius: 100%;
  background-image: url(${(p) => p.orb});
  background-size: cover;
  position: absolute;
  left: 42px;
`

export const DetailColumn = styled.View`
  display: flex;
  flex-direction: column;
  text-align: left;
`

export const BalanceColumn = styled.View`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  flex-direction: column;
`

export const ArrowIcon = styled.View`
  width: auto;
  height: 16px;
  margin-right: 6px;
  color: ${(p) => p.theme.color.text03};
  vertical-align: middle;
`

export const TransactionDetailRow = styled.View`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
`

export const StatusRow = styled.View`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
  align-self: flex-end;
`

export const StatusAndTimeRow = styled.View`
  display: flex;
  flex: 1;
  align-items: stretch;
  justify-content: space-between;
  flex-direction: row;
  width: 100%;
  margin-top: 8px;
`
