// Copyright (c) 2023 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// You can obtain one at https://mozilla.org/MPL/2.0/.

import styled from 'styled-components/native'

export const Wrapper = styled.View`
  --display-text: none;
  --icon-margin-right: 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: var(--nav-background);
  border-top-width: 1px;
  border-style: solid;
  border-color: var(--nav-border);
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: visible;
  z-index: 10;
  transition-duration: 0.1s;
  &:hover {
    --display-text: flex;
    --icon-margin-right: 16px;
  }
`

export const Section = styled.View<{ showBorder?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  width: 100%;
  padding: 8px 0px;
`
