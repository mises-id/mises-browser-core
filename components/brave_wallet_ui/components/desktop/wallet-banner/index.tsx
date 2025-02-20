// Copyright (c) 2021 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at https://mozilla.org/MPL/2.0/.
import * as React from 'react'
// Styled Components
import {
  StyledWrapper,
  WarningText,
  BannerButton,
  ButtonRow,
  BannerButtonText
} from './style'
import { getLocale } from '../../../../common/locale'
export interface Props {
  onClick: () => void
  onDismiss: () => void
  bannerType: 'warning' | 'danger'
  description: string
  buttonText: string
}

const WalletBanner = (props: Props) => {
  const { onDismiss, onClick, bannerType, description, buttonText } = props

  return (
    <StyledWrapper bannerType={bannerType}>
      <WarningText>{description}</WarningText>
      <ButtonRow>
        <BannerButton onPress={onClick} buttonType='primary'><BannerButtonText buttonType='primary'>{buttonText}</BannerButtonText></BannerButton>
        <BannerButton onPress={onDismiss} buttonType='secondary'><BannerButtonText buttonType='secondary'>{getLocale('braveWalletDismissButton')}</BannerButtonText></BannerButton>
      </ButtonRow>
    </StyledWrapper>
  )
}

export default WalletBanner
