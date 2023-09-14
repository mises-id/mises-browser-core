// Copyright (c) 2022 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at https://mozilla.org/MPL/2.0/.

import styled from 'styled-components/native'

export const StyledWrapper = styled.View`
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;

  & > div.infinite-scroll-component {
    width: 100%;
  }
`

export const TableWrapper = styled.View`
  width: 100%;
`

export const AssetsColumnWrapper = styled.View`
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  justify-content: left;
`

export const AssetsColumnItemSpacer = styled.View`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 19px;
`
export const TextWrapper = styled.View<{ alignment: 'right' | 'left' | 'center' }>`
  display: flex;
  justify-content: ${p => {
    switch (p.alignment) {
      case 'left':
        return 'flex-start'
      case 'right':
        return 'flex-end'
      case 'center':
        return 'center'
      default:
        return 'center'
    }
  }};
  width: 100%;
  min-width: 30px;
  font-family: Poppins;
  font-size: 14px;
  letter-spacing: 0.01em;
`

export const LineChartWrapper = styled.View`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 30px;
  max-width: 120px;
  margin: 0 auto;
`
export const LoadIconWrapper = styled.View`
  display: flex;
  justify-content: center;
`
export const CoinGeckoText = styled.Text`
  font-family: Arial;
  font-size: 10px;
  font-weight: normal;
  color: ${(p) => p.theme.color.text03};
  margin: 15px 0px;
`

export const ButtonsRow = styled.View`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-direction: row;
  position: relative;
  pointer-events: none;
`
