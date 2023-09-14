// Copyright (c) 2023 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// You can obtain one at https://mozilla.org/MPL/2.0/.

import styled from 'styled-components/native'

import { Column } from '../../shared.styles'

export const StyledWrapper = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  position: fixed;
  z-index: 10;
  background-color: rgba(33, 37, 41, 0.32);
  backdrop-filter: blur(8px);
`

export const Modal = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 320px;
  background-color: ${(p) => p.theme.color.background02};
  border-radius: 16px;
  @media screen and (max-width: 600px) {
    width: 96%;
  }
`

export const InfoColumn = styled(Column)`
  /* rgb(240, 247, 252) does not exist in design system */
  background-color: rgb(240, 247, 252);
  border-radius: 8px;
  @media (prefers-color-scheme: dark) {
    /* rgb(2, 21, 35) does not exist in design system */
    background-color: rgb(2, 21, 35);
  }
`

export const InfoGraphic = styled.Image`
  width: 100%;
  height: auto;
`

export const Link = styled.Text`
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: ${(p) => p.theme.color.interactive05};
  margin: 0px;
  padding: 0px;
  text-decoration: none;
  cursor: pointer;
  @media (prefers-color-scheme: dark) {
    color: ${(p) => p.theme.color.interactive06};
  }
`
