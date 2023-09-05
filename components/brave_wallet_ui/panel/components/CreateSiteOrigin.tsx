// Copyright (c) 2022 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at https://mozilla.org/MPL/2.0/.
import { getLocale } from '$web-common/locale'
import { useStyle } from '../../page/styles'
import * as React from 'react'
import { Text, View } from 'react-native'

export interface Props {
  originSpec: string
  eTldPlusOne: string
}

const CreateSiteOrigin = (props: Props) => {
  const { originSpec, eTldPlusOne } = props
  const style = useStyle()

  const url = React.useMemo(() => {
    if (originSpec === 'chrome://wallet') {
      return <Text style={style.flatten(['color-text-high'])}>{getLocale('braveWalletPanelTitle')}</Text>
    }
    if (eTldPlusOne) {
      const before = originSpec.split(eTldPlusOne)[0]
      const after = originSpec.split(eTldPlusOne)[1]
      // Will inherit styling from parent container
      return <View>
          <Text style={style.flatten(['subtitle3'])}>{before}</Text>
          <Text style={style.flatten(['subtitle3'])}>{eTldPlusOne}</Text>
          <Text style={style.flatten(['color-text-high'])}>{after}</Text>
        </View>
    }
    return <Text style={style.flatten(['color-text-high'])}>{originSpec}</Text>
  }, [eTldPlusOne, originSpec])

  return url;
}
export default CreateSiteOrigin
