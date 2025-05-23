// Copyright (c) 2021 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at https://mozilla.org/MPL/2.0/.
import * as React from 'react'

// Styled Components
import { StyledButton, ButtonText, TabLine } from './style'

export interface Props {
  isSelected: boolean
  text: string
  onSubmit?: () => void
}

const PanelTab = (props: Props) => {
  const { onSubmit, text, isSelected } = props
  return (
    <StyledButton isSelected={isSelected} onPress={onSubmit}>
      <ButtonText isSelected={isSelected}>{text}</ButtonText>
      <TabLine isSelected={isSelected} />
    </StyledButton>
  )
}

export default PanelTab
