// Copyright (c) 2022 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at https://mozilla.org/MPL/2.0/.

import * as React from 'react'

import { StyledWrapper, Star } from './style'

export interface Props {
  active: boolean
  onCheck?: (status: boolean) => void
}

export const AssetWishlistStar = (props: Props) => {
  const { active, onCheck } = props

  const onClick = () => {
    if (onCheck) {
      onCheck(!active)
    }
  }
  return (
    <StyledWrapper>
      <Star
        active={active}
        onPress={onClick}
      />
    </StyledWrapper>
  )
}
