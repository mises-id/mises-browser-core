// Copyright (c) 2022 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at https://mozilla.org/MPL/2.0/.

import * as React from 'react'

// Utils
import { getLocale } from '../../../../../common/locale'

// Styled components
import { QueueStepButton, QueueStepRow, QueueStepText, QueueStepButtonText } from './style'

// Hooks

interface IProps { transactionsQueueLength: any, transactionQueueNumber: any, queueNextTransaction: any }
export function TransactionQueueStep (props: IProps) {
  const { transactionsQueueLength, transactionQueueNumber, queueNextTransaction } = props
  if (transactionsQueueLength <= 1) {
    return null
  }

  return (
    <QueueStepRow>
      <QueueStepText>
        {transactionQueueNumber} {getLocale('braveWalletQueueOf')} {transactionsQueueLength}
      </QueueStepText>
      <QueueStepButton onPress={queueNextTransaction}>
        <QueueStepButtonText>
          {transactionQueueNumber === transactionsQueueLength
            ? getLocale('braveWalletQueueFirst')
            : getLocale('braveWalletQueueNext')}
        </QueueStepButtonText>
      </QueueStepButton>
    </QueueStepRow>
  )
}
