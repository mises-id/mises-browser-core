// Copyright (c) 2021 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at https://mozilla.org/MPL/2.0/.
import styled from 'styled-components/native'
// import { CaratStrongDownIcon } from 'brave-ui/components/icons'
import Refresh from '../../../assets/svg-icons/refresh-icon.svg'
import ClipboardIcon from '../../../assets/svg-icons/clipboard-icon.svg'
import { BuySendSwapInputType } from './index'
import { AssetIconProps, AssetIconFactory, WalletButton } from '../../shared/style'

interface StyleProps {
  componentType: BuySendSwapInputType
  spin: number
  hasError: boolean
  isSelected: boolean
  isSlippage: boolean
  isERC721: boolean
  isWarning: boolean
}

export const Row = styled.View<Partial<StyleProps>>`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: ${(p) => p.componentType === 'exchange' ? 'flex-start' : 'space-between'};
`

export const FromBalanceText = styled.Text<Partial<StyleProps>>`
  font-family: Poppins;
  font-size: 12px;
  margin-top: 4px;
  margin-bottom: ${(p) => p.componentType === 'exchange' ? '0px' : '2px'};
  letter-spacing: 0.01em;
  color: ${(p) => p.theme.color.text03};
`

export const AssetButton = styled(WalletButton) <Partial<StyleProps>>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: ${(p) => p.isERC721 ? '100%' : 'auto'};
  cursor: pointer;
  background-image: none;
  background-color: none;;
  border: none;
  padding: 0px;
  margin: 0px;
`

export const ButtonLeftSide = styled.View<Partial<StyleProps>>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

// Construct styled-component using JS object instead of string, for editor
// support with custom AssetIconFactory.
//
// Ref: https://styled-components.com/docs/advanced#style-objects
export const AssetIcon = AssetIconFactory<AssetIconProps>({
  width: '24px',
  height: '24px'
})

export const AssetTicker = styled.Text`
  font-family: Poppins;
  font-size: 20px;
  line-height: 30px;
  letter-spacing: 0.02em;
  font-weight: 600;
  margin-right: 4px;
  color: ${(p) => p.theme.color.text01};
  cursor: pointer;
`

export const CaratDownIcon = styled.View`
  width: 12px;
  height: auto;
  color: ${(p) => p.theme.color.text02};
`

export const PresetRow = styled.View`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
`

export const PresetButton = styled(WalletButton) <Partial<StyleProps>>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-image: none;
  background-color: none;;
  border: none;
  font-weight: 600;
  font-family: Poppins;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0.01em;
  padding: 2px 0px;
  width: 48px;
  border-radius: 4px;
  background-color: ${(p) => p.isSelected ? p.isSlippage ? p.theme.color.interactive05 : p.theme.color.divider01 : 'none'};
  color: ${(p) => p.isSlippage && p.isSelected ? p.theme.palette.white : p.theme.color.interactive05};
  @media (prefers-color-scheme: dark) {
    color: ${(p) => p.isSlippage && p.isSelected ? p.theme.palette.white : p.theme.palette.blurple300};
  }
`

// export const SlippageInput = styled(Input)<Partial<StyleProps>>`
//   --main-bg-color: ${(p) => p.theme.color.interactive05};
//   width: 48px;
//   background-image: none;
//   background: ${(p) => p.isSelected ? 'var(--main-bg-color)' : 'none'};
//   font-family: Poppins;
//   font-size: 12px;
//   line-height: 18px;
//   letter-spacing: 0.01em;
//   font-weight: 600;
//   text-align: center;
//   padding: 1px;
//   border-radius: 4px;
//   border: none;
//   border: 1px solid ${(p) => p.isSelected ? p.theme.color.interactive05 : p.theme.color.interactive08};
//   color: ${(p) => p.isSelected ? p.theme.palette.white : p.theme.color.text03};
//   ::placeholder {
//     color: ${(p) => p.theme.color.text03};
//   }
//   ::-webkit-inner-spin-button {
//       -webkit-appearance: none;
//       margin: 0;
//   }
//   ::-webkit-outer-spin-button {
//       -webkit-appearance: none;
//       margin: 0;
//   }
// `

export const MarketLimitButton = styled(WalletButton)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-image: none;
  background-color: none;;
  border: none;
  font-family: Poppins;
  font-size: 13px;
  margin-top: 4px;
  letter-spacing: 0.01em;
  padding: 0px;
  color: ${(p) => p.theme.color.interactive05};
`

export const RefreshButton = styled(WalletButton)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-image: none;
  background-color: none;;
  border: none;
  width: 18px;
  height: 18px;
  padding: 0px;
  background-color: ${(p) => p.theme.color.divider01};
  border-radius: 100%;
`

export const RefreshIcon = styled.View<Partial<StyleProps>>`
  width: 12px;
  height: 12px;
  background-color: ${(p) => p.theme.color.interactive07};
  -webkit-mask-image: url(${Refresh});
  mask-image: url(${Refresh});
  animation: ${(p) => p.spin === 1 ? 'spin 1s 1' : 'none'};
  @keyframes spin {
    0% {
      transform: rotate(0deg)
    }
    100% {
      transform: rotate(-360deg)
    }
  }
`

// export const Input = styled.input<Partial<StyleProps>>`
//   width: 100%;
//   background-image: none;
//   background-color: ${(p) => p.theme.color.background02};
//   border: none;
//   font-family: Poppins;
//   font-size: ${(p) => p.componentType === 'toAddress' ? '14px' : '20px'};
//   line-height: ${(p) => p.componentType === 'exchange' ? '0px' : '30px'};
//   letter-spacing: 0.02em;
//   font-weight: ${(p) => p.componentType === 'toAddress' ? '400' : '600'};
//   padding: 0px;
//   margin: ${(p) => p.componentType === 'exchange' ? '0px' : '4px 0px'};
//   color: ${(p) => p.hasError ? p.theme.color.errorText : p.componentType === 'toAddress' ? p.theme.color.text02 : p.theme.color.text01};
//   ::placeholder {
//     color: ${(p) => p.theme.color.text02};
//   }
//   ::-webkit-inner-spin-button {
//       -webkit-appearance: none;
//       margin: 0;
//   }
//   ::-webkit-outer-spin-button {
//       -webkit-appearance: none;
//       margin: 0;
//   }
// `

export const SelectText = styled.Text`
  font-family: Poppins;
  font-size: 13px;
  margin: 2px 0px;
  line-height: 20px;
  letter-spacing: 0.01em;
  color: ${(p) => p.theme.color.text03};
`

export const SelectValueText = styled.Text`
  font-family: Poppins;
  font-size: 13px;
  margin: 2px 0px;
  line-height: 20px;
  font-weight: 600;
  letter-spacing: 0.01em;
  color: ${(p) => p.theme.color.text01};
  margin-right: 4px;
`

export const PasteButton = styled(WalletButton)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  cursor: pointer;
  background-image: none;
  background-color: none;;
  border: none;
  margin: 0px;
  padding: 0px;
  border-radius: 100%;
  background-color: ${(p) => p.theme.color.divider01};
`

export const PasteIcon = styled.View`
  width: 12px;
  height: 12px;
  background-color: ${(p) => p.theme.color.interactive07};
  -webkit-mask-image: url(${ClipboardIcon});
  mask-image: url(${ClipboardIcon});
  mask-size: 100%;
`

export const WarningText = styled.Text<Partial<StyleProps>>`
  font-family: Poppins;
  letter-spacing: 0.01em;
  font-size: 12px;
  color: ${(p) => p.isWarning ? p.theme.color.interactive03 : p.theme.color.errorText};
  word-break: break-word;
`

export const AddressConfirmationText = styled.Text`
  cursor: default;
  font-family: Poppins;
  letter-spacing: 0.01em;
  font-size: 12px;
  color: ${(p) => p.theme.color.text02};
`

export const LearnMoreButton = styled(WalletButton)`
  cursor: pointer;
  background-image: none;
  background-color: none;;
  border: none;
  font-family: Poppins;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.01em;
  color: ${(p) => p.theme.color.interactive05};
  margin: 0px;
  padding: 0px;
`

export const WarningRow = styled.View<Partial<StyleProps>>`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  flex-wrap: wrap;
`

export const Spacer = styled.View`
  padding-right: 8px;
`
