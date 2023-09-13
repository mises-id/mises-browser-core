// Copyright (c) 2022 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at https://mozilla.org/MPL/2.0/.

import styled from 'styled-components/native'

export const StyledWrapper = styled.View`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  background-color: ${(p) => p.theme.color.background01};
  overflow-y: auto;
 `

export const StyledContent = styled.View <{ isTabView?: boolean }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding-top: ${(p) => p.isTabView ? 0 : 32}px;
  padding-bottom: 0px;
 `
