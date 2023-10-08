// Copyright (c) 2022 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at https://mozilla.org/MPL/2.0/.

import * as React from 'react'
import { useHistory } from 'react-router'
import { useDispatch } from 'react-redux'

// utils
import { getLocale } from '../../../../../common/locale'

// images
// import WalletAccessSvg from './images/wallet-access.svg'

// routes
import { WalletRoutes } from '../../../../constants/types'

// actions
import { WalletPageActions } from '../../../actions'

// components
import { NavButton } from '../../../../components/extension/buttons/nav-button/index'

// styles
import {
  // Description,
  Title
} from '../onboarding.style'
import {
  ButtonContainer,
  IntroContainer,
  // IntroImg,
  MainWrapper
} from './onboarding-success.style'
import { Image } from 'react-native'
import { View } from 'react-native'

export const OnboardingSuccess = () => {
  // routing
  const history = useHistory()

  // redux
  const dispatch = useDispatch()

  // methods
  const onComplete = React.useCallback(() => {
    dispatch(WalletPageActions.walletSetupComplete(true))
    history.push(WalletRoutes.Portfolio)
  }, [])

  // const onClickBuyCrypto = React.useCallback(() => {
  //   dispatch(WalletPageActions.walletSetupComplete(true))
  //   history.push(WalletRoutes.FundWalletPageStart)
  // }, [])

  // const onClickDepositCrypto = React.useCallback(() => {
  //   dispatch(WalletPageActions.walletSetupComplete(true))
  //   history.push(WalletRoutes.DepositFundsPageStart)
  // }, [])

  // render
  return <MainWrapper>
    {/* <StyledWrapper>
      <CloseButtonContainer>
        <LinkText onPress={onComplete}>
          {getLocale('braveWalletButtonDone')}
        </LinkText>
      </CloseButtonContainer>
    </StyledWrapper> */}
    <View>
      <Image
        style={{
          width: '80%',
          height: '90px',
          marginLeft: '10%'
        }}
        fadeDuration={0}
        resizeMode="contain"
        source={require("../../../assets/logo/splash-image.png")}
      />
      <IntroContainer>
        <Title textAlign='center'>{
          getLocale('braveWalletOnboardingSuccessTitle')
        }</Title>

        {/* <Description>{
          getLocale('braveWalletOnboardingSuccessDescription')
        }</Description> */}

        {/* <IntroImg source={{uri: WalletAccessSvg}} style={{height: 138}}/> */}

      </IntroContainer>

      {/* <ArticleLinksContainer> */}
        {/* <LinkText
          rel="noreferrer"
          target='_blank'
          href='https://brave.com/learn/what-is-crypto-wallet/#how-to-use-a-crypto-wallet'
        >
          {getLocale('braveWalletLearnAboutMyWallet')}
        </LinkText> */}
      {/* </ArticleLinksContainer> */}

      <ButtonContainer>
        <NavButton
          buttonType='primary'
          text={getLocale('braveWalletButtonDone')}
          onSubmit={onComplete}
        />

        {/* <LinkText onPress={onClickDepositCrypto}>
          <DepositIcon />
          {getLocale('braveWalletDepositCryptoButton')}
        </LinkText> */}

      </ButtonContainer>
    </View>

  </MainWrapper>
}
