// Copyright (c) 2021 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at https://mozilla.org/MPL/2.0/.
import styled from 'styled-components/native'
// import { MoreVertRIcon, ArrowRightIcon } from 'brave-ui/components/icons'
import CoinsIconSVG from '../../../assets/svg-icons/coins-icon.svg'
import { WalletButton } from '../../shared/style'
import { OrbContainer } from '../../extension/transaction-detail-panel/style'
import { moreHorizontal } from '../../../assets/svg-icons/nav-button-icons'

interface StyleProps {
  orb: string
}

export const PortfolioTransactionItemWrapper = styled.TouchableOpacity<{ isFocused?: boolean, showTransactionPopup?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  width: 100%;
  margin: 14px 0px;
  position: relative;
  background-color: ${(p) => p.isFocused ? `${p.theme.color.text01}10` : 'none'};
  padding: 10px;
  border-radius: 10px;
  gap: 16px;
  position: relative;
  z-index: ${(p) => p.showTransactionPopup ? '10' : '2'};;
`

export const DetailRow = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  flex-wrap: wrap;
`

export const BalanceAndMoreRow = styled(DetailRow)`
  width: 88%;
`

export const AddressText = styled.Text`
  font-family: Poppins;
  font-size: 13px;
  line-height: 20px;
  letter-spacing: 0.01em;
  font-weight: 600;
  color: ${(p) => p.theme.color.text01};
  margin: 0px 5px;
`

export const DetailText = styled.Text`
  font-family: Poppins;
  font-size: 13px;
  line-height: 20px;
  letter-spacing: 0.01em;
  font-weight: 400;
  color: ${(p) => p.theme.color.text02};
`

export const FromCircle = styled.View<Partial<StyleProps>>`
  width: 40px;
  height: 40px;
  border-radius: 100%;
  background-image: url(${(p) => p.orb});
  background-size: cover;
  margin-right: 30px;
  @media screen and (max-width: 600px) {
    display: none
  }
`

export const ToCircle = styled.View<Partial<StyleProps>>`
  width: 24px;
  height: 24px;
  border-radius: 100%;
  background-image: url(${(p) => p.orb});
  background-size: cover;
  position: absolute;
  left: 26px;
  @media screen and (max-width: 600px) {
    display: none
  }
`

export const MoreButton = styled(WalletButton)`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-image: none;
  background-color: none;;
  border: none;
`

export const RejectedTransactionSpacer = styled.View`
  width: 38px;
`

export const MoreIcon = styled.View`
  color: ${(p) => p.theme.color.interactive08};
  width: 16px;
  height: 16px;
  color: ${(p) => p.theme.color.text02};
  background-color: ${(p) => p.theme.color.interactive07};
  -webkit-mask-image: url(${moreHorizontal});
  mask-image: url(${moreHorizontal});
`

export const DetailColumn = styled.View`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
`

export const DetailTextLight = styled.Text`
  font-family: Poppins;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0.01em;
  color: ${(p) => p.theme.color.text03};
  margin-right: 6px;
`

export const DetailTextDark = styled.Text`
  font-family: Poppins;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0.01em;
  color: ${(p) => p.theme.color.text02};
  margin-right: 6px;
`

export const DetailTextDarkBold = styled.Text`
  font-family: Poppins;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0.01em;
  font-weight: 600;
  color: ${(p) => p.theme.color.text02};
  margin-right: 6px;
`

export const BalanceColumn = styled.View`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  flex-direction: column;
  // width: 70%;
  flex: 1;
  width: 1px;
`

export const ArrowIcon = styled.View`
  width: auto;
  height: 16px;
  margin-right: 6px;
  color: ${(p) => p.theme.color.text03};
`

export const OrbAndTxDescriptionContainer = styled.View`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
  flex-wrap: wrap;
  width: 50%;
`

export const StatusRow = styled.View`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
  margin-right: 16px;
`

export const CoinsButton = styled(WalletButton)`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: default;
  background-image: none;
  background-color: none;;
  border: none;
  width: 24px;
  height: 24px;
  padding: 4px;
`

export const CoinsButtonSpacer = styled(WalletButton)`
  width: 24px;
  height: 24px;
  padding: 4px;
`

export const CoinsIcon = styled.View`
  position: absolute;
  width: 16px;
  height: 16px;
  top: 4.17%;
  background-image: url(${CoinsIconSVG});
`

export const AddressOrAsset = styled(WalletButton)`
  display: inline;
  cursor: pointer;
  background-image: none;
  background-color: none;;
  border: none;
  color: #4D54D2;
  padding: 0;
`

export const TransactionFeeTooltipTitle = styled.View`
  font-weight: 600;
  letter-spacing: 0.01em;
`

export const TransactionFeeTooltipBody = styled.View`
  font-weight: 400;
  letter-spacing: 0.01em;
`

export const StatusBalanceAndMoreContainer = styled.View`
  display: flex;
  align-self: flex-end;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  width: 50%;
`

export const OrbWrapper = styled(OrbContainer)`
  margin-bottom: 0px;
`
