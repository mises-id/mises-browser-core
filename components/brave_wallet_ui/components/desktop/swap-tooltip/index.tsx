// Copyright (c) 2021 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at https://mozilla.org/MPL/2.0/.
import * as React from 'react'

import {
  StyledWrapper,
  Tip,
  Pointer
} from './style'

export interface Props {
  children?: React.ReactNode
  text: string
}

function SwapTooltip (props: Props) {
  const { children, text } = props
  const [active, setActive] = React.useState(false)

  return (
    <StyledWrapper
      onPress={()=>setActive(!active)}
    >
      {children}
      {active &&
        <>
          <Pointer />
          <Tip>
            {text}
          </Tip>
        </>
      }
    </StyledWrapper>
  )
}

export default SwapTooltip
