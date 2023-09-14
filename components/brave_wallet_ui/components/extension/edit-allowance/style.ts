// Copyright (c) 2021 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at https://mozilla.org/MPL/2.0/.
import styled from 'styled-components/native'

export const StyledWrapper = styled.View`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  width: 100%;
  height: 87%;
  padding: 5px 15px 15px 15px;
`

export const FormColumn = styled.View`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  align-self: center;
`

export const Input = styled.TextInput`
  box-sizing: border-box;
  width: 100%;
  background-image: none;
  background-color: ${(p) => p.theme.color.background02};
  border: ${(p) => `1px solid ${p.theme.color.interactive08}`};
  border-radius: 4px;
  font-family: Poppins;
  font-style: normal;
  font-size: 13px;
  line-height: 20px;
  letter-spacing: 0.01em;
  padding: 10px;
  margin-bottom: 8px;
  color: ${(p) => p.theme.color.text01};
  ::placeholder {
    font-family: Poppins;
    font-style: normal;
    font-size: 12px;
    letter-spacing: 0.01em;
    color: ${(p) => p.theme.color.text03};
    font-weight: normal;
  }
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  ::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`

export const ButtonRow = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  width: 100%;
`

export const Description = styled.Text`
  width: 275px;
  font-family: Poppins;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0.01em;
  text-align: flex-start;
  color: ${(p) => p.theme.color.text02};
`

export const AllowanceOption = styled.View`
  display: block;
  width: 239px;
`

export const AllowanceTitle = styled.View`
  font-family: Poppins;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 18px;
  color: ${(p) => p.theme.color.text01};
  padding-bottom: 6px;
`

export const AllowanceContent = styled.View`
  font-family: Poppins;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.01em;
  color: ${(p) => p.theme.color.text01};
`
