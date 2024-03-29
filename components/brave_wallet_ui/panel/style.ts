// Copyright (c) 2021 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at https://mozilla.org/MPL/2.0/.
import styled from 'styled-components/native'

export const PanelWrapper = styled.View<{
  isLonger?: boolean
  width?: number
  height?: number
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${(p) => p.width ? p.width+'px' : '100vw'};
  height: ${(p) => p.height ? p.height+'px' : p.isLonger ? '540px' : '100vh'};
`

export const WelcomePanelWrapper = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 250px;
`

export const SendWrapper = styled.View`
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  position: relative;
  padding: 0px 24px 12px;
  box-sizing: border-box;
`
