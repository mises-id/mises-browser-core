// Copyright (c) 2022 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at https://mozilla.org/MPL/2.0/.

import styled from 'styled-components/native'
import { WalletButton } from '../style'
// import { CaratStrongDownIcon } from 'brave-ui/components/icons'

export const AdvancedButton = styled(WalletButton)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  cursor: pointer;
  background-image: none;
  background-color: none;;
  border: none;
  padding: 0px;
`

export const AdvancedIcon = styled.View <Partial<{ rotated: boolean }>>`
  width: 18px;
  height: 18px;
  color: ${(p) => p.theme.color.interactive07};
  transform: ${(p) => p.rotated ? 'rotate(180deg)' : 'rotate(0deg)'};
  margin-right: 10px;
`
export const ButtonRow = styled.View`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  margin-top: 12px;
`

export const ErrorText = styled.Text`
  font-family: Poppins;
  font-size: 12px;
  line-height: 18px;
  color: ${(p) => p.theme.color.errorText};
  margin-bottom: 10px;
`

export const DividerRow = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 10px;
`

export const SubDivider = styled.View`
  width: 100%;
  height: 2px;
  background-color: ${(p) => p.theme.color.divider01};
  margin-bottom: 12px;
`

export const DividerText = styled.Text`
  font-family: Poppins;
  font-size: 15px;
  line-height: 20px;
  letter-spacing: 0.04em;
  font-weight: 600;
  margin-bottom: 10px;
  color: ${(p) => p.theme.color.text03};
`
export const FormWrapper = styled.TouchableOpacity`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  margin-top: 10px;
`

export const FormRow = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 17px;
`

export const FormColumn = styled.View`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  width: 49%;
`

export const FullWidthFormColumn = styled(FormColumn)`
  width: 100%;
  margin-top: 8px;
`

export const InputLabel = styled.Text`
  font-family: Poppins;
  font-size: 14px;
  letter-spacing: 0.01em;
  line-height: 20px;
  color: ${(p) => p.theme.color.text02};
  margin-bottom: 6px;
`

// export const Input = styled.input`
//   width: ${p => p.width ? p.width : '265px'};
//   background-image: none;
//   background-color: ${(p) => p.theme.color.background02};
//   border: ${(p) => `1px solid ${p.theme.color.interactive08}`};
//   border-radius: 4px;
//   font-family: Poppins;
//   font-style: normal;
//   font-size: 13px;
//   line-height: 20px;
//   letter-spacing: 0.01em;
//   padding: 10px;
//   margin-bottom: 8px;
//   color: ${(p) => p.theme.color.text01};
//   ::placeholder {
//     font-family: Poppins;
//     font-style: normal;
//     font-size: 12px;
//     letter-spacing: 0.01em;
//     color: ${(p) => p.theme.color.text03};
//     font-weight: normal;
//   }
//   ::-webkit-inner-spin-button {
//     -webkit-appearance: none;
//     margin: 0;
//   }
//   ::-webkit-outer-spin-button {
//     -webkit-appearance: none;
//     margin: 0;
//   }
// `

export const ButtonRowSpacer = styled.View`
  display: flex;
  width: 100% auto;
  margin-top: 14px;
`
