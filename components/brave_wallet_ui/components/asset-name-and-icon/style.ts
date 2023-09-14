// Copyright (c) 2022 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at https://mozilla.org/MPL/2.0/.

import styled from 'styled-components/native'

export const StyledWrapper = styled.View`
  display: flex;
  flex-direction: row;
  height: 40px;

`

export const AssetIcon = styled.Image`
  width: 40px;
  height: auto;
  margin-right: 12px;
`

export const NameAndSymbolWrapper = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  padding-top: 1px
  padding-bottom: 1px
`

export const AssetName = styled.Text`
  font-family: Poppins;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.01em;
  color: ${p => p.theme.color.text01};
`

export const AssetSymbol = styled(AssetName)`
  color: ${p => p.theme.color.text03};
  text-transform: uppercase;
`
