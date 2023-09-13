// Copyright (c) 2023 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// You can obtain one at https://mozilla.org/MPL/2.0/.

import styled from 'styled-components/native'

// Assets
import DayIcon from '../../../send/assets/assets/day-icon.svg'
import NightIcon from '../../../send/assets/assets/night-icon.svg'

// Shared Styles
import { StyledButton, StyledDiv } from '../../../send/shared.styles'

export const Button = styled(StyledButton)`
  background-color: ${(p) => p.theme.color.background01};
  border-radius: 100%;
  height: 40px;
  width: 40px;
  margin-right: 16px;
  &:hover {
    /* #f0f1fc does not exist in the design system */
    background-color: #f0f1fc;
  }
  @media (prefers-color-scheme: dark) {
    &:hover {
      /* #484b67 does not exist in the design system */
      background-color: #484b67;
    }
  }
`

export const ButtonIcon = styled(StyledDiv)`
  height: 20px;
  width: 20px;
  background-image: url(${DayIcon});
  background-size: cover;
  @media (prefers-color-scheme: dark) {
    background-image: url(${NightIcon});
  }
`
