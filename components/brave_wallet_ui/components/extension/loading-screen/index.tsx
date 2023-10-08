import * as React from 'react'
import misesLogoIcon from '../../../page/assets/logo/mises-symbol.png'
import {
  StyledWrapper,
  CenterContainer,
  MisesLogo
} from './style'
const LoadingScreen = () => {
  return (
    <StyledWrapper>
      <CenterContainer>
        <MisesLogo source={{
          uri: misesLogoIcon
        }}/>
      </CenterContainer>
    </StyledWrapper>
  )
}

export default LoadingScreen