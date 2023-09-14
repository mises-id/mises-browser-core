// Copyright (c) 2022 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at https://mozilla.org/MPL/2.0/.

import styled from 'styled-components/native'

// import { SettingsAdvancedIcon } from 'brave-ui/components/icons'
import ArrowDown2Icon from '../../../assets/svg-icons/arrow-down-2.svg'
import { AssetIconFactory, AssetIconProps, WalletButton } from '../../shared/style'

export const HeaderTitle = styled.View`
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 18px;
  display: flex;
  align-items: center;
  text-align: center;
  color: ${p => p.theme.color.text01};
  margin: 4px 0 8px 0;
`

export const ExchangeRate = styled.View`
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;

  display: flex;
  align-items: center;
  text-align: right;
  color: ${p => p.theme.color.text03};
`

export const SwapDetails = styled.View`
  position: relative;
  border-width: 1px;
  border-style: solid;
  border-color: ${(p) => p.theme.color.divider01};
  border-radius: 8px;
  height: 220px;
  width: calc(100% - 8px);
  margin: 8px 0;
`

export const SwapDetailsDivider = styled.View`
  position: absolute;
  top: 50%;
  border: 0.5px solid ${p => p.theme.color.divider01};
  width: 100%;
`

export const SwapDetailsArrowContainer = styled.View`
  top: calc(50% - 16px); // 16px = half of 32px (height)
  left: calc(50% - 16px); // 16px = half of 32px (width)
  position: absolute;
  border-width: 1px;
  border-style: solid;
  border-color: ${(p) => p.theme.color.divider01};
  background-color: ${p => p.theme.color.background01};
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`

export const SwapDetailsArrow = styled.View`
  -webkit-mask-image: url(${ArrowDown2Icon});
  mask-image: url(${ArrowDown2Icon});
  background-color: ${p => p.theme.color.interactive08};
  width: 12px;
  height: 16px;
`

export const SwapAssetContainer = styled.View<{ top: boolean }>`
  width: 100%;
  position: ${p => (p.top ? undefined : 'absolute')};
  top: ${p => (p.top ? undefined : '50%')};
`

export const SwapAssetHeader = styled.View`
  display: flex;
  justify-content: space-between;
  margin: 8px 12px;
`

export const SwapAssetTitle = styled.View`
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  color: ${p => p.theme.color.text03};
`

export const SwapAssetAddress = styled.View`
  border-width: 1px;
  border-style: solid;
  border-color: ${(p) => p.theme.color.divider01};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: fit-content;
`

export const AddressOrb = styled.View<{ orb: string }>`
  width: 12px;
  height: 12px;
  border-radius: 100%;
  background-image: url(${p => p.orb});
  background-size: cover;
  margin: 3px;
`

export const AccountNameText = styled.Text`
  cursor: default;
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;
  font-size: 10px;
  line-height: 15px;
  display: flex;
  align-items: center;
  text-align: right;
  letter-spacing: 0.01em;
  color: ${p => p.theme.color.text03};
  margin-right: 3px;
`

export const SwapAssetDetailsContainer = styled.View`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
  margin: 0 12px;
`

export const AssetIcon = AssetIconFactory<AssetIconProps>({
  width: '40px',
  height: 'auto'
})

export const SwapAmountColumn = styled.View`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
`

export const Spacer = styled.View`
  display: flex;
  height: 4px;
`

export const SwapAssetAmountSymbol = styled.Text`
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;
  font-size: 22px;
  display: flex;
  align-items: center;
  color: ${p => p.theme.color.text01};
`

export const NetworkDescriptionText = styled.Text`
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  display: flex;
  align-items: center;
  color: ${p => p.theme.color.text03};
`

export const NetworkFeeAndSettingsContainer = styled.View`
  display: flex;
  justify-content: space-between;
  width: calc(100% - 8px);
`

export const NetworkFeeContainer = styled.View``

export const NetworkFeeTitle = styled.View`
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 20px;
  color: ${p => p.theme.color.text03};
`

export const NetworkFeeValue = styled.View`
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 18px;
  display: flex;
  align-items: center;
  letter-spacing: 0.01em;
  color: ${p => p.theme.color.text02};
  gap: 6px;
`

export const Settings = styled(WalletButton)`
  display: flex;
  align-self: flex-start;
  cursor: pointer;
  border: none;
  background-image: none;
  background-color: none;;
`

export const SettingsIcon = styled.View`
  width: 14px;
  color: ${p => p.theme.color.text03};
`

export const FooterButton = styled(WalletButton)`
background-color: ${p => p.theme.color.interactive05};
  border-radius: 48px;
  height: 40px;
`
