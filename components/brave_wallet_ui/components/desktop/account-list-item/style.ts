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

export const StyledWrapper = styled.View`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  width: 100%;
  padding: 7px;
  background-color: none;
  border-radius: 10px;
  --show-buttons: none;
  &:hover {
    --show-buttons: flex;
    background-color: ${(p) => p.theme.color.interactive08}15;
  }
`

export const NameAndIcon = styled.View`
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
  display: var(--show-buttons);
  align-items: flex-end;
  justify-content: center;
  flex-direction: row;
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
