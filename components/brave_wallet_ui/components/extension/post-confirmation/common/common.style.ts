// Copyright (c) 2022 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at https://mozilla.org/MPL/2.0/.
import styled from 'styled-components/native'

import LinkSvg from '../../../../assets/svg-icons/link-icon.svg'
import LoadingIcon from '../../../../assets/svg-icons/loading-slow.svg'
import { WalletButton } from '../../../shared/style'

export const TransactionStatusIcon = styled.View`
  width: 112px;
  height: 112px;
  margin: 24px 0;
`

export const TransactionStatusText = styled.View`
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 27px;

  text-align: center;
  letter-spacing: 0.02em;
`

export const TransactionStatusDescription = styled.View`
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
  text-align: center;
  color: ${p => p.theme.color.text02};

  padding: 8px 16px;
  flex-grow: 1;
`

export const PendingTransactionsRow = styled.View`
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
  text-align: center;
  color: ${p => p.theme.color.text03};
  padding: 8px 16px;
  flex-grow: 1;
`

export const ButtonRow = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  width: 100%;
  padding-bottom: 22px;
`

export const LinkIcon = styled.View`
  width: 12px;
  height: 12px;
  background-image: url(${LinkSvg});
  margin-left: 8px;
`

export const DetailButton = styled(WalletButton)`
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 20px;
  text-align: center;
  color: ${p => p.theme.color.interactive05};
  background-image: none;
  background-color: none;;
  cursor: pointer;
  border: none;
  margin: 0;
  padding: 0;
`

export const Loader = styled.View`
  background-image: url(${LoadingIcon});
  width: 220px;
  height: 220px;
  margin: 36px 0;
  opacity: 0.4;
`
