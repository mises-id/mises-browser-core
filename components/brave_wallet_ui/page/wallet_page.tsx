// Copyright (c) 2020 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at https://mozilla.org/MPL/2.0/.

import * as React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { initLocale } from 'brave-ui'
import { BrowserRouter } from 'react-router-dom'
// assets
import faveiconUrl from '../assets/svg-icons/mises-logo.png'

// utils
import { loadTimeData } from '../../common/loadTimeData'
import * as Lib from '../common/async/lib'

// actions
import * as WalletActions from '../common/actions/wallet_actions'

// contexts
import { LibContext } from '../common/context/lib.context'
import { ApiProxyContext } from '../common/context/api-proxy.context'

// components
import BraveCoreThemeProvider from '../../common/BraveCoreThemeProvider'
import Container from './container'
import { store, walletPageApiProxy } from './store'

// style
import walletDarkTheme from '../theme/wallet-dark'
import walletLightTheme from '../theme/wallet-light'
import 'emptykit.css'

import '@brave/leo/tokens/css/variables.css'
import { setIconBasePath } from '@brave/leo/react/icon'
// import { AppNavigation } from './navigation'
import { StyleProvider } from './styles'
// import { SafeAreaProvider } from 'react-native-safe-area-context'
// import { ModalsProvider } from './modals/base'
// import { LoadingScreenProvider } from './providers/loading-screen'
// import { ConfirmModalProvider } from './providers/confirm-modal'
// import { AppNavigation } from './navigation'
setIconBasePath('chrome://resources/brave-icons')

function App () {
  const [initialThemeType, setInitialThemeType] = React.useState<chrome.braveTheme.ThemeType>()
  React.useEffect(() => {
    setInitialThemeType("Light");
    //chrome.braveTheme.getBraveThemeType(setInitialThemeType)
  }, [])

  React.useEffect(() => {
    /** Sets FAVICON for Wallet Pages */
    let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement
    if (!link) {
      link = document.createElement('link')
      link.rel = 'icon'
      document.getElementsByTagName('head')[0].appendChild(link)
    }
    link.href = faveiconUrl
  }, [])

  // const ThemeStatusBar: React.FunctionComponent = () => {
  //   const style = useStyle();

  //   return (
  //     <StatusBar
  //       translucent={true}
  //       backgroundColor="#FFFFFF00"
  //       barStyle={style.get("status-bar-style")}
  //     />
  //   );
  // };

  return (
    <Provider store={store}>
      <BrowserRouter>
        {initialThemeType &&
          <BraveCoreThemeProvider
            initialThemeType={initialThemeType}
            dark={walletDarkTheme}
            light={walletLightTheme}
          >
            <ApiProxyContext.Provider value={walletPageApiProxy}>
              <LibContext.Provider value={Lib}>
                <StyleProvider>
                  <Container />
                  {/* <SafeAreaProvider>
                    <ModalsProvider>
                      <LoadingScreenProvider>
                        <ConfirmModalProvider>
                          <AppNavigation />
                        </ConfirmModalProvider>
                      </LoadingScreenProvider>
                    </ModalsProvider>
                  </SafeAreaProvider> */}
                </StyleProvider>
              </LibContext.Provider>
            </ApiProxyContext.Provider>
          </BraveCoreThemeProvider>
        }
      </BrowserRouter>
    </Provider>
  )
}

function initialize () {
  initLocale(loadTimeData.data_)
  store.dispatch(WalletActions.initialize())
  render(<App />, document.getElementById('root'))
}

document.addEventListener('DOMContentLoaded', initialize)
