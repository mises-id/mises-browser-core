// Copyright (c) 2022 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at https://mozilla.org/MPL/2.0/.

import styled, { css } from 'styled-components/native'

// types
import { PanelButtonTypes } from './index'

// images
import CloseIcon from '../../../../assets/svg-icons/close.svg'
import KeyIcon from '../../../../assets/svg-icons/key-icon.svg'
import CheckIcon from '../../assets/filled-checkmark.svg'

// styles
import { walletButtonFocusMixin } from '../../../shared/style'

interface StyledButtonProps {
  buttonType: PanelButtonTypes
  disabled?: boolean
  addTopMargin?: boolean
  to?: string // for links & routes
  maxHeight?: string
  minHeight?: string
  minWidth?: string
}

const StyledButtonCssMixin = (p: StyledButtonProps) => {
  return css<StyledButtonProps>`
    ${walletButtonFocusMixin}
    font-family: Poppins;
    font-style: normal;
    min-width: ${(p) => p?.minWidth || 'unset'};
    min-height: ${(p) => p?.minHeight || 'unset'};
    max-height: ${(p) => p?.maxHeight || 'unset'};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: ${(p) => p.disabled ? 'default' : 'pointer'};
    border-radius: 40px;
    padding: 10px 22px;
    margin-top: ${(p) => p?.addTopMargin ? '8px' : '0px'};

    background-color: ${(p) =>
      p.disabled
        ? p.theme.color.disabled
        : p.buttonType === 'primary' ||
          p.buttonType === 'confirm' ||
          p.buttonType === 'sign'
            ? p.theme.palette.blurple500
            : p.buttonType === 'danger'
              ? p.theme.color.errorBorder
              : 'transparent'
    };

    border: ${(p) =>
      p.buttonType === 'secondary' ||
      p.buttonType === 'reject'
        ? `1px solid ${p.theme.color.interactive08}`
        : 'none'
    };

    margin-right: ${(p) =>
      p.buttonType === 'primary' ||
      p.buttonType === 'confirm' ||
      p.buttonType === 'sign'
        ? '0px'
        : '8px'
    };

    pointer-events: ${(p) => p.disabled ? 'none' : 'auto'};

    text-decoration: none;
  `
}

export const StyledButton = styled.View<StyledButtonProps>`
  ${(p) => StyledButtonCssMixin(p)}
`

export const StyledLink = styled.Text<StyledButtonProps>`
  ${(p) => StyledButtonCssMixin(p)}
`

export const ButtonText = styled.Text<{
  buttonType: PanelButtonTypes
}>`
  font-size: 13px;
  font-weight: 600;
  line-height: 20px;
  color: ${(p) =>
    p.buttonType === 'secondary' ||
    p.buttonType === 'reject' ||
    p.buttonType === 'cancel'
      ? p.theme.color.interactive07
      : p.theme.palette.white
  };
`

export const RejectIcon = styled.View`
  width: 18px;
  height: 18px;
  background-color: ${(p) => p.theme.color.text02};
  -webkit-mask-image: url(${CloseIcon});
  mask-image: url(${CloseIcon});
  mask-size: 100%;
  margin-right: 10px;
`

export const SignIcon = styled.View`
  width: 18px;
  height: 18px;
  background-color: ${(p) => p.theme.palette.white};
  -webkit-mask-image: url(${KeyIcon});
  mask-image: url(${KeyIcon});
  mask-size: 100%;
  margin-right: 10px;
`

export const ConfirmIcon = styled.View`
  width: 18px;
  height: 18px;
  background-color: ${(p) => p.theme.palette.white};
  -webkit-mask-image: url(${CheckIcon});
  mask-image: url(${CheckIcon});
  mask-size: 100%;
  margin-right: 10px;
`
