// Copyright (c) 2022 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at https://mozilla.org/MPL/2.0/.

import * as React from 'react'
import { useSelector, useDispatch } from 'react-redux'

// Types
import { BraveWallet, NetworkFilterType, SupportedTestNetworks, WalletAccountType, WalletState } from '../../../constants/types'
import { LOCAL_STORAGE_KEYS } from '../../../common/constants/local-storage-keys'

// Components
import NetworkFilterItem from './network-filter-item'
import { CreateNetworkIcon } from '../../shared'

// Utils
import { WalletActions } from '../../../common/actions'
import { getLocale } from '../../../../common/locale'
import { accountInfoEntityAdaptor } from '../../../common/slices/entities/account-info.entity'

// Options
import {
  AllNetworksOption,
  SupportedTopLevelChainIds
} from '../../../options/network-filter-options'
import { AllAccountsOption } from '../../../options/account-filter-options'

// Styled Components
import {
  StyledWrapper,
  DropDown,
  DropDownButton,
  DropDownIcon,
  SelectorLeftSide,
  DropDownText,
  SecondaryNetworkText,
  ClickAwayArea
} from './style'
import {
  useGetNetworkQuery,
  useGetSelectedChainQuery,
  useGetVisibleNetworksQuery,
  useSetNetworkMutation
} from '../../../common/slices/api.slice'

interface Props {
  networkListSubset?: BraveWallet.NetworkInfo[]
  selectedNetwork?: BraveWallet.NetworkInfo
  selectedAccount?: Pick<WalletAccountType, 'address' | 'coin' | 'name'>
  onSelectNetwork?: (network: BraveWallet.NetworkInfo) => void
  isLeft?: boolean,
  hiddenText?: boolean,
  shape?: 'rounded' | undefined
}

export const NetworkFilterSelector = ({
  networkListSubset,
  onSelectNetwork,
  selectedNetwork: networkProp,
  selectedAccount: accountProp,
  isLeft,
  hiddenText,
  shape
}: Props) => {
  // state
  const [showNetworkFilter, setShowNetworkFilter] = React.useState<boolean>(false)
  const [setNetwork] = useSetNetworkMutation()
  // redux
  const dispatch = useDispatch()
  const accounts = useSelector(({ wallet }: { wallet: WalletState }) => wallet.accounts)
  const { currentData: selectedNetworkGlobal } = useGetSelectedChainQuery(undefined)
  const selectedNetworkFilterData = useSelector(({ wallet }: { wallet: WalletState }) => wallet.selectedNetworkFilter)
  const selectedAccountFilter = useSelector(({ wallet }: { wallet: WalletState }) => wallet.selectedAccountFilter)

  const selectedNetworkFilter = React.useMemo(() => {
    return selectedNetworkGlobal || selectedNetworkFilterData
  }, [selectedNetworkGlobal, selectedNetworkFilterData])

  const [oldSelectedNetwork, setoldSelectedNetwork] = React.useState<NetworkFilterType>()

  React.useEffect(() => {
    if(oldSelectedNetwork?.chainId !== selectedNetworkFilter.chainId) {
      console.log(selectedNetworkFilter, "selectedNetworkFilter")
      console.log(oldSelectedNetwork, "oldSelectedNetwork")
      setoldSelectedNetwork(selectedNetworkFilter)
      onSelectAndClose(selectedNetworkFilter as BraveWallet.NetworkInfo)
    }
  }, [selectedNetworkFilter])
  
  // queries
  const { data: reduxNetworkList } = useGetVisibleNetworksQuery(undefined, {
    skip: !!networkListSubset
  })
  const { data: selectedNetworkFromFilter } = useGetNetworkQuery(
    selectedNetworkFilter,
    {
      skip:
        !!networkProp ||
        !selectedNetworkFilter ||
        selectedNetworkFilter.chainId === AllNetworksOption.chainId
    }
  )

  const selectedNetwork =
    networkProp ||
    (selectedNetworkFilter.chainId === AllNetworksOption.chainId
      ? AllNetworksOption
      : selectedNetworkFromFilter || AllNetworksOption)

  const selectedAccount =
    accountProp ||
    [...accounts, AllAccountsOption].find(
      (account) => account.id === selectedAccountFilter
    ) ||
    AllAccountsOption

  // memos & computed
  const accountId = accountInfoEntityAdaptor.selectId(selectedAccount)

  // memos
  const filteredNetworks: BraveWallet.NetworkInfo[] = React.useMemo(() => {
    // Filters networks by coinType if a selectedAccountFilter is selected
    const networks =
      accountId === AllAccountsOption.id
        ? networkListSubset
        : networkListSubset?.filter(
            (network) => network.coin === selectedAccount.coin
          )
    return networks || reduxNetworkList
  }, [networkListSubset, reduxNetworkList, accountId, selectedAccount.coin])

  const sortedNetworks = React.useMemo(() => {
    const onlyMainnets = filteredNetworks.filter((network) =>
      SupportedTopLevelChainIds.includes(network.chainId)
    )
    const removedMainnets = filteredNetworks.filter(
      (network) => !SupportedTopLevelChainIds.includes(network.chainId)
    )
    return [...onlyMainnets, ...removedMainnets]
  }, [filteredNetworks])

  const primaryNetworks = React.useMemo(() => {
    const onlyMainnets = filteredNetworks.filter((network) =>
      SupportedTopLevelChainIds.includes(network.chainId)
    )
    return [...onlyMainnets]
  }, [sortedNetworks])

  const secondaryNetworks = React.useMemo(() => {
    const primaryList = [...SupportedTopLevelChainIds, ...SupportedTestNetworks]
    return sortedNetworks.filter((network) => !primaryList.includes(network.chainId))
  }, [sortedNetworks])

  const testNetworks = React.useMemo(() => {
    return filteredNetworks.filter((network) =>
      SupportedTestNetworks.includes(network.chainId)
    )
  }, [filteredNetworks])

  const toggleShowNetworkFilter = React.useCallback(() => {
    setShowNetworkFilter(prev => !prev)
  }, [])

  const hideNetworkFilter = React.useCallback(() => {
    setShowNetworkFilter(false)
  }, [])

  const onSelectAndClose = React.useCallback((network: BraveWallet.NetworkInfo) => {
    if (onSelectNetwork) {
      onSelectNetwork(network)
    } else {
      const networkFilter = {
        chainId: network.chainId,
        coin: network.coin
      }
      window.localStorage.setItem(LOCAL_STORAGE_KEYS.PORTFOLIO_NETWORK_FILTER_OPTION, JSON.stringify(networkFilter))
      dispatch(WalletActions.setSelectedNetworkFilter(networkFilter))
      setNetwork(networkFilter)
    }

    hideNetworkFilter()
  }, [onSelectNetwork, hideNetworkFilter])

  // render
  return (
    <StyledWrapper>
      <DropDownButton
        shape={shape}
        onPress={toggleShowNetworkFilter}>
        <SelectorLeftSide>
          {selectedNetwork.chainId !== AllNetworksOption.chainId &&
            <CreateNetworkIcon network={selectedNetwork} marginRight={14} size='big' />
          }
          {!hiddenText && <DropDownText>{selectedNetwork.chainName}</DropDownText>}
        </SelectorLeftSide>
        <DropDownIcon isOpen={showNetworkFilter}/>
      </DropDownButton>

      {showNetworkFilter &&
        <DropDown isLeft={isLeft}>
          {primaryNetworks.map((network: BraveWallet.NetworkInfo) =>
            <NetworkFilterItem
              key={`${network.chainId + network.chainName}`}
              network={network}
              onSelectNetwork={onSelectAndClose}
              selectedNetwork={selectedNetwork}
            >
            </NetworkFilterItem>
          )}

          {secondaryNetworks.length > 0 &&
            <>
              <SecondaryNetworkText>{getLocale('braveWalletNetworkFilterSecondary')}</SecondaryNetworkText>
              {secondaryNetworks.map((network) =>
                <NetworkFilterItem
                  key={`${network.chainId + network.chainName}`}
                  network={network}
                  onSelectNetwork={onSelectAndClose}
                  selectedNetwork={selectedNetwork}
                />
              )}
            </>
          }

          {testNetworks.length > 0 &&
            <>
              <SecondaryNetworkText>{getLocale('braveWalletNetworkFilterTestNetworks')}</SecondaryNetworkText>
              {testNetworks.map((network) =>
                <NetworkFilterItem
                  key={`${network.chainId + network.chainName}`}
                  network={network}
                  onSelectNetwork={onSelectAndClose}
                  selectedNetwork={selectedNetwork}
                />
              )}
            </>
          }
        </DropDown>
      }
      {showNetworkFilter &&
        <ClickAwayArea onPress={hideNetworkFilter} />
      }
    </StyledWrapper >
  )
}

export default NetworkFilterSelector
