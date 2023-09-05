import * as React from 'react'
import { useSafePanelSelector, useUnsafePanelSelector, useUnsafeWalletSelector } from '../common/hooks/use-safe-selector'
import { PanelSelectors } from '../panel/selectors'
import { useGetNetworkQuery, useGetSelectedChainQuery } from '../common/slices/api.slice'
import { BraveWallet } from '../constants/types'
import { Text } from 'react-native'
import AddSuggestedToken from './components/addSuggestedToken'
import { useDispatch } from 'react-redux'
import * as WalletPanelActions from './actions/wallet_panel_actions'
import { WalletSelectors } from '../common/selectors'
import AllowAddChangeNetworkPanel from './components/AllowAddChangeNetworkPanel'
// import { isHardwareAccount } from '../utils/address-utils'
// import SignPanel from './components/SignPanel'

interface IProps {
}
const RootRPCMethodsUI: React.FC<IProps> = () => {
  // redux
  const dispatch = useDispatch()

  const selectedPanel = useSafePanelSelector(PanelSelectors.selectedPanel)
  const switchChainRequest = useUnsafePanelSelector(PanelSelectors.switchChainRequest)
  const suggestedTokenRequest = useUnsafePanelSelector(PanelSelectors.suggestedTokenRequest)
  const activeOrigin = useUnsafeWalletSelector(WalletSelectors.activeOrigin)
  const addChainRequest = useUnsafePanelSelector(PanelSelectors.addChainRequest)
  // const signMessageData = useUnsafePanelSelector(PanelSelectors.signMessageData)
  // const accounts = useUnsafeWalletSelector(WalletSelectors.accounts)

  const { data: switchChainRequestNetwork } = useGetNetworkQuery(
    {
      chainId: switchChainRequest.chainId,
      // Passed ETH here since AllowAddChangeNetworkPanel
      // is only used for EVM networks
      // and switchChainRequest doesn't return coinType.
      coin: BraveWallet.CoinType.ETH
    },
    { skip: !switchChainRequest.chainId }
  )

  const onAddSuggestedToken = () => {
    if (!suggestedTokenRequest) {
      return
    }
    dispatch(WalletPanelActions.addSuggestTokenProcessed({ approved: true, contractAddress: suggestedTokenRequest.token.contractAddress }))
  }

  const onCancelAddSuggestedToken = () => {
    if (!suggestedTokenRequest) {
      return
    }
    dispatch(WalletPanelActions.addSuggestTokenProcessed({ approved: false, contractAddress: suggestedTokenRequest.token.contractAddress }))
  }

  const onApproveAddNetwork = () => {
    dispatch(WalletPanelActions.addEthereumChainRequestCompleted({ chainId: addChainRequest.networkInfo.chainId, approved: true }))
  }

  const onCancelAddNetwork = () => {
    dispatch(WalletPanelActions.addEthereumChainRequestCompleted({ chainId: addChainRequest.networkInfo.chainId, approved: false }))
  }

  const onApproveChangeNetwork = () => {
    dispatch(WalletPanelActions.switchEthereumChainProcessed({ approved: true, origin: switchChainRequest.originInfo.origin }))
  }

  const onCancelChangeNetwork = () => {
    dispatch(WalletPanelActions.switchEthereumChainProcessed({ approved: false, origin: switchChainRequest.originInfo.origin }))
  }

  // const onCancelSigning = () => {
  //   dispatch(WalletPanelActions.signMessageProcessed({
  //     approved: false,
  //     id: signMessageData[0].id
  //   }))
  // }

  // const onSignData = () => {
  //   if (isHardwareAccount(accounts, signMessageData[0].address)) {
  //     dispatch(WalletPanelActions.signMessageHardware(signMessageData[0]))
  //   } else {
  //     dispatch(WalletPanelActions.signMessageProcessed({
  //       approved: true,
  //       id: signMessageData[0].id
  //     }))
  //   }
  // }
  // queries
  const { data: selectedNetwork } = useGetSelectedChainQuery()
  


  if (selectedPanel === 'addSuggestedToken') {
    return <AddSuggestedToken
      onCancel={onCancelAddSuggestedToken}
      onAddToken={onAddSuggestedToken}
      originInfo={suggestedTokenRequest?.origin ?? activeOrigin}
      token={suggestedTokenRequest?.token}
      selectedNetwork={selectedNetwork}
    />
  }

  if (selectedPanel === 'addEthereumChain') {
    return <AllowAddChangeNetworkPanel
      originInfo={addChainRequest.originInfo}
      onApproveAddNetwork={onApproveAddNetwork}
      onApproveChangeNetwork={onApproveChangeNetwork}
      onCancel={onCancelAddNetwork}
      networkPayload={addChainRequest.networkInfo}
      panelType='add'
    />
  }

  if (selectedPanel === 'switchEthereumChain' && switchChainRequestNetwork) {
    return <AllowAddChangeNetworkPanel
      originInfo={switchChainRequest.originInfo}
      onApproveAddNetwork={onApproveAddNetwork}
      onApproveChangeNetwork={onApproveChangeNetwork}
      onCancel={onCancelChangeNetwork}
      networkPayload={switchChainRequestNetwork}
      panelType='change'
    />
  }

  if (selectedPanel === 'signData') {
    // <SignPanel
    //   signMessageData={signMessageData}
    //   accounts={accounts}
    //   onCancel={onCancelSigning}
    //   onSign={onSignData}
    //   selectedNetwork={selectedNetwork}
    //   // Pass a boolean here if the signing method is risky
    //   showWarning={false}
    // />
  }

  if (selectedPanel === 'signTransaction' || selectedPanel === 'signAllTransactions') {
  }

  if (
    selectedPanel === 'provideEncryptionKey' ||
    selectedPanel === 'allowReadingEncryptedMessage'
  ) {
  }

  if (selectedPanel === 'networks') {
  }

  if (selectedPanel === 'accounts') {
  }

  if (selectedPanel === 'apps') {
  }

  if (selectedPanel === 'connectWithSite') {
  }

  if (selectedPanel === 'assets') {
  }

  if (selectedPanel === 'sitePermissions') {
  }

  if (selectedPanel === 'createAccount') {
  }

  return <Text>Not support</Text>

}

export default RootRPCMethodsUI