// Copyright (c) 2022 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at https://mozilla.org/MPL/2.0/.

import styled from 'styled-components/native'

// Shared Styles

export const Container = styled.View`
  background-color: ${(p) => p.theme.color.background02};
  border-radius: 24px;
  box-sizing: border-box;
  justify-content: flex-start;
  width: 100%;
  position: relative;
  z-index: 9;
  display: flex;
  font-family: 'Poppins';
  color: ${(p) => p.theme.color.text01};
  font-weight: 400;
  font-size: 18px;
  line-height: 20px;
  letter-spacing: 0.02em;
`
