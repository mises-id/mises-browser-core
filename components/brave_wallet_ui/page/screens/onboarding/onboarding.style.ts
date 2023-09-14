// Copyright (c) 2022 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at https://mozilla.org/MPL/2.0/.

import styled from 'styled-components/native'
import { Column } from '../../../components/shared/style'

// Layout
export const OnboardingWrapper = styled(Column)`
  width: 100%;
  height: 100%;
  display: flex;
  overflow-x: hidden;
`

export const NextButtonRow = styled.View`
  display: flex;
  flex-direction: row;
  align-self: center;
  align-items: center;
  justify-content: center;
  min-width: 100px;
  max-width: 226px;
  margin-bottom: 28px;
`

export const MainWrapper = styled.View<{ isTabView?: boolean }>`
  align-self: center;
  width: 100%;
  max-width: 456px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${(p) => p.theme.color.background02};
  padding: 30px;
  border-radius: ${(p) => p.isTabView ? 24 : 8}px;
  margin-top: 50px;
`

export const StyledWrapper = styled.View`
  width: 376px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

export const TitleAndDescriptionContainer = styled.View`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  margin-bottom: 24px;
`

// Text
export const Title = styled.Text<{
  maxWidth?: string
  textAlign?: 'right' | 'center'
}>`
  font-family: Poppins;
  font-size: 20px;
  font-weight: 600;
  color: ${(p) => p.theme.color.text01};
  letter-spacing: 0.02em;
  margin-bottom: 16px;
  max-width: ${(p) => p?.maxWidth || 'unset'};
  text-align: ${(p) => p?.textAlign || 'left'};
`

export const Description = styled.Text<{ textAlign?: 'right' | 'center' }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  font-family: Poppins;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  letter-spacing: 0.01em;
  line-height: 20px;
  color: ${(p) => p.theme.color.text02};
  text-align: ${(p) => p?.textAlign || 'left'};

  & > * > strong {
    font-weight: 600;
    font-size: 14px;
    color: ${(p) => p.theme.color.text01};
  }
`

// Phrase card
export const PhraseCard = styled.View`
  display: flex;
  // flex: 1;
  flex-direction: column;
  width: 376px;
  align-items: center;
`

export const PhraseCardTopRow = styled.View`
  display: flex;
  flex-direction: row;
  width: 375px;
  height: 40px;
  align-items: center;
  justify-content: flex-end;
  padding: 14px 8px;
`

export const PhraseCardBody = styled.View`
  width: 100%;
  border-style: solid;
  border-width: 1px;
  border-color: ${(p) => p.theme.color.divider01};
  border-radius: 4px;
`

export const PhraseCardBottomRow = styled(PhraseCardTopRow) <{
  centered?: boolean
}>`
  justify-content: ${(p) => p.centered ? 'center' : 'flex-start'};
  height: 40px;
  gap: 14px;
`
