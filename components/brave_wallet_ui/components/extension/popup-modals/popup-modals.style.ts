// Copyright (c) 2022 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at https://mozilla.org/MPL/2.0/.
import styled from 'styled-components/native'

import CloseIcon from '../../../assets/svg-icons/close.svg'
import { WalletButton } from '../../shared/style'

export const StyledWrapper = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  position: fixed;
  z-index: 10;
  background-color: rgba(10, 10, 10, 0.2);
`

export const Modal = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 280px;
  max-width: 280px;
  background-color: ${(p) => p.theme.color.background02};
  border-radius: 4px;
`

export const Header = styled.View`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  padding: 16px;
  width: 100%;
`

export const Title = styled.Text`
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 27px;
  letter-spacing: 0.02em;
  margin-left: auto;
  color: ${(p) => p.theme.color.text01};
`

export const CloseButton = styled(WalletButton)`
  cursor: pointer;
  width: 16px;
  height: 16px;
  background-color: ${(p) => p.theme.color.interactive07};
  -webkit-mask-image: url(${CloseIcon});
  mask-image: url(${CloseIcon});
  border: none;
  margin-left: auto;
`
