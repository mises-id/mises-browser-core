// Copyright (c) 2022 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at https://mozilla.org/MPL/2.0/.
import * as React from 'react'

// Types
import { TokenRegistry, BraveWallet } from '../../constants/types'

// Hooks
import { useLib } from './'
import { useGetNetworksQuery } from '../slices/api.slice'

// Utils
import { addLogoToToken } from '../async/lib'
import { WalletSelectors } from '../selectors'
import { useUnsafeWalletSelector } from './use-safe-selector'

export function useTokenRegistry () {
  // Hooks
  const { getTokenList } = useLib()

  const visibleTokens = useUnsafeWalletSelector(
    WalletSelectors.misesFullChainTokenList
  )

  // Redux
  const { data: networkList = [] } = useGetNetworksQuery()

  // Hook State
  const [tokenRegistry, setTokenRegistry] = React.useState<TokenRegistry>({})
  const [isLoading, setIsLoading] = React.useState<boolean>(true)

  React.useEffect(() => {
    let subscribed = true
    let registry = tokenRegistry
    let misesRegistry: TokenRegistry = {}
    visibleTokens.forEach(function (token) {
      if (token.contractAddress !== undefined) {
        if (misesRegistry[token.chainId] !== undefined) {
          misesRegistry[token.chainId].push(token);
        } else {
          misesRegistry[token.chainId] = [token];
        }
      } else {
        console.log('token', token)
      }
    });
    Promise.all(networkList.map(async (network) => {
      getTokenList(network).then(
        async (result) => {
          let formattedListWithIcons:BraveWallet.BlockchainToken[] =
            await Promise.all(result.tokens.map(async (token) => {
              return await addLogoToToken(token)
            }))
          if (misesRegistry[network.chainId] !== undefined) {
            formattedListWithIcons = formattedListWithIcons.concat(misesRegistry[network.chainId])
          }
          console.log('network', network, formattedListWithIcons)
          registry[network.chainId] = formattedListWithIcons
          
        }
      ).catch((error) => {
        if (!subscribed) {
          return
        }
        console.log(error)
        setIsLoading(false)
      })
    })).then(() => {
      if (!subscribed) {
        return
      }
      console.log('registry', registry)
      setTokenRegistry(registry)
      setIsLoading(false)
    })
    // cleanup
    return () => {
      subscribed = false
    }
  }, [tokenRegistry, networkList, getTokenList, visibleTokens])

  // Creates a flat list of all tokens in the tokenRegistry
  const fullTokenListAllChains: BraveWallet.BlockchainToken[] = React.useMemo(() => {
    return Object.keys(tokenRegistry).length === 0 ? [] : networkList.map((network) => tokenRegistry[network.chainId]).flat(1)
  }, [tokenRegistry, networkList, Object.keys(tokenRegistry).length])

  return { tokenRegistry, fullTokenListAllChains, isLoading }
}

export default useTokenRegistry
