// Copyright (c) 2021 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at https://mozilla.org/MPL/2.0/.
import styled from 'styled-components/native'

export const StyledWrapper = styled.View <{ noPadding?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  // justify-content: center;
  width: 100%;
  height: 100%;
  padding: ${(p) => p.noPadding ? '0px' : '15px'};
  background-color: ${(p) => p.theme.color.background02};
 `
