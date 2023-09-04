import * as React from "react";
import { FunctionComponent } from "react";
import { PageWithScrollView } from "../../components/page";
import { View } from "react-native";
import { useStyle } from "../../styles";
import { Selector, SelectorModal, TextInput} from "../../components/input";
import { useUnsafeWalletSelector } from "../../../common/hooks/use-safe-selector";
import { WalletSelectors } from "../../../common/selectors";
import { useBalanceUpdater, usePreset, useSend } from "../../../common/hooks";
import { TouchableOpacity } from "react-native";
import { AddressBookIcon } from "../../components/icon";
import { getLocale } from "$web-common/locale";
import Amount from "../../../utils/amount";
import { useGetSelectedChainQuery, useGetVisibleNetworksQuery } from "../../../common/slices/api.slice";
import { shortenAddress } from "../../common";
import { BraveWallet, CoinTypesMap, WalletAccountType } from '../../../constants/types'
import { getBalance } from "../../../utils/balance-utils";
import { AllNetworksOption } from "../../../options/network-filter-options";
import { Button } from "../../components/button";
// import { RouteProp, useRoute } from "@react-navigation/native";

export const SendScreen: FunctionComponent = () => {

  const style = useStyle();
  // Wallet Selectors
  // Selectors
  const accounts = useUnsafeWalletSelector(WalletSelectors.accounts)
  const selectedAccount = useUnsafeWalletSelector(WalletSelectors.selectedAccount)

  // Queries
  const { data: selectedNetwork } = useGetSelectedChainQuery()
  // const spotPrices = useUnsafeWalletSelector(WalletSelectors.transactionSpotPrices)
  // const defaultCurrencies = useUnsafeWalletSelector(WalletSelectors.defaultCurrencies)
    const userVisibleTokensInfo = useUnsafeWalletSelector(WalletSelectors.userVisibleTokensInfo)
    const { data: networks } = useGetVisibleNetworksQuery()

  const accountsByNetwork = React.useMemo(() => {
    return accounts.filter((account) => account.coin === selectedNetwork?.coin && account.keyringId === selectedAccount?.keyringId || selectedAccount?.address.toLowerCase() !== account.address.toLowerCase()).map(val => {
      return {
        label: val.name,
        paragraph: shortenAddress(val.address),
        key: val.address
      }
    })
  }, [accounts, selectedNetwork, selectedAccount])
  // Hooks
  useBalanceUpdater()

  const {
    toAddressOrUrl,
    // toAddress,
    enableEnsOffchainLookup,
    showEnsOffchainWarning,
    setShowEnsOffchainWarning,
    addressError,
    addressWarning,
    sendAmount,
    selectedSendAsset,
    sendAmountValidationError,
    setSendAmount,
    updateToAddressOrUrl,
    submitSend,
    selectSendAsset,
    searchingForDomain,
    processAddressOrUrl
  } = useSend(true)

  const handleInputAddressChange = React.useCallback(
    (value: string) => {
      updateToAddressOrUrl(value)
    },
    [updateToAddressOrUrl]
  )

  const sendAssetBalance = React.useMemo(() => {
    return getBalance(selectedAccount, selectedSendAsset)
  }, [selectedAccount, selectedSendAsset])

  const insufficientFundsError = React.useMemo((): boolean => {
    if (!selectedSendAsset) {
      return false
    }

    const amountWei = new Amount(sendAmount).multiplyByDecimals(
      selectedSendAsset.decimals
    )

    if (amountWei.isZero()) {
      return false
    }

    return amountWei.gt(sendAssetBalance)
  }, [sendAssetBalance, sendAmount, selectedSendAsset])

  const reviewText = React.useMemo(() => {
    if(
      addressError !== undefined &&
      addressError !== '' &&
      addressError !== getLocale('braveWalletNotValidChecksumAddressError')
    ) {
      return addressError
    }
    if(
      addressWarning !== undefined &&
      addressWarning !== '' &&
      addressWarning !== getLocale('braveWalletAddressMissingChecksumInfoWarning')
    ) {
      return addressWarning
    }
    return '';
  }, [addressError, addressWarning])

  const sendErrorText = React.useMemo(() => {
    if(sendAmountValidationError) {
      return getLocale('braveWalletDecimalPlacesError');
    }
    if(
      insufficientFundsError
    ) {
      return getLocale('braveWalletNotEnoughFunds')
    }
    return '';
  }, [insufficientFundsError, sendAmountValidationError])

  const [selectedKey, setSelectedKey] = React.useState<string | undefined>('');
  const [selectedTokenKey, setSelectedTokenKey] = React.useState<string | undefined>('');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  // queries
  const [selectedNetworkFilter, setSelectedNetworkFilter] = React.useState<BraveWallet.NetworkInfo>(selectedNetwork || AllNetworksOption)
  React.useEffect(() => {
    selectedNetwork && setSelectedNetworkFilter(selectedNetwork)
  }, [selectedNetwork])
  

  const getTokenListByAccount = React.useCallback((account: WalletAccountType) => {
    if (!account || !networks) {
      return []
    }
    // Since LOCALHOST's chainId is shared between coinType's
    // this check will make sure we are returning the correct
    // LOCALHOST asset for each account.
    const coinName = CoinTypesMap[account?.coin ?? 0]
    const localHostCoins = userVisibleTokensInfo.filter((token) => token.chainId === BraveWallet.LOCALHOST_CHAIN_ID)
    const accountsLocalHost = localHostCoins.find((token) => token.symbol.toUpperCase() === coinName)

    const chainList = networks
      .filter(
        (network) =>
          network.coin === account?.coin &&
          (network.coin !== BraveWallet.CoinType.FIL)
      )
      .map((network) => network.chainId)

    const list = userVisibleTokensInfo.filter(
      (token) =>
        token.chainId !== BraveWallet.LOCALHOST_CHAIN_ID &&
        chainList.includes(token?.chainId ?? '')
    )
    console.log(chainList, list)

    if (accountsLocalHost && (account.keyringId !== BraveWallet.FILECOIN_KEYRING_ID)) {
      list.push(accountsLocalHost)
      return list
    }

    return list.filter((token) => token.visible)
  }, [userVisibleTokensInfo, networks])

  const getTokenListWithBalances = React.useCallback((account: WalletAccountType) => {
    return getTokenListByAccount(account).filter((token) => getBalance(account, token) > '0')
  }, [getTokenListByAccount])

  const getTokensByNetwork = React.useCallback((account) => {
    return getTokenListWithBalances(account).filter((token) =>
      token.chainId === selectedNetworkFilter.chainId &&
      token.coin === selectedNetworkFilter.coin
    )
  }, [selectedNetworkFilter.chainId, selectedNetworkFilter.coin])

  const tokenItems = React.useMemo(() => {
    return getTokensByNetwork(selectedAccount).map(token => {
      return {
        label: token.symbol,
        key: token.symbol + token.chainId,
      }
    })
  }, [selectedAccount])
  console.log(tokenItems)

  const tokensByNetworkList = React.useMemo(() => {
    return getTokensByNetwork(selectedAccount)
  }, [selectedAccount])

  const handleInputAmountChange = React.useCallback(
    (value: string) => {
      setSendAmount(value)
    },
    []
  )

  const onSelectPresetAmount = usePreset(
    {
      onSetAmount: setSendAmount,
      asset: selectedSendAsset
    }
  )

  const setPresetAmountValue = React.useCallback((percent: number) => {
    onSelectPresetAmount(percent)
  }, [onSelectPresetAmount])

  const onClickReviewOrENSConsent = React.useCallback(() => {
    if (showEnsOffchainWarning) {
      enableEnsOffchainLookup()
      setShowEnsOffchainWarning(false)
      processAddressOrUrl(toAddressOrUrl)
      return
    }
    submitSend()
  }, [
    showEnsOffchainWarning,
    setShowEnsOffchainWarning,
    submitSend,
    enableEnsOffchainLookup,
    processAddressOrUrl,
    toAddressOrUrl
  ])

  const isReviewButtonDisabled = React.useMemo(() => {
    // We only need to check if showEnsOffchainWarning is true here to return
    // false early before any other checks are made. This is to allow the button
    // to be pressed to enable offchain lookup.
    return !showEnsOffchainWarning &&
      (searchingForDomain ||
        toAddressOrUrl === '' ||
        parseFloat(sendAmount) === 0 ||
        sendAmount === '' ||
        insufficientFundsError ||
        (addressError !== undefined && addressError !== '') ||
        sendAmountValidationError !== undefined)
  },
    [
      toAddressOrUrl,
      sendAmount,
      insufficientFundsError,
      addressError,
      sendAmountValidationError,
      searchingForDomain,
      showEnsOffchainWarning
    ]
  )

  const selectedPendingTransaction = useUnsafeWalletSelector(WalletSelectors.selectedPendingTransaction)
  
  React.useEffect(() => {
    console.log(selectedPendingTransaction)
  }, [selectedPendingTransaction])
  

  return (
    <PageWithScrollView
      backgroundMode="tertiary"
      contentContainerStyle={style.get("flex-grow-1")}
      style={style.flatten(["padding-x-page"])}
    >
      <View style={style.flatten(["height-page-pad"])} />
      <TextInput
        label={'Recipient'}
        error={reviewText}
        value={toAddressOrUrl}
        onChangeText={handleInputAddressChange}
        inputRight={
          <View
            style={style.flatten([
              "height-1",
              "overflow-visible",
              "justify-center",
            ])}
          >
            <TouchableOpacity
              style={style.flatten(["padding-4"])}
              onPress={() => {
                setIsModalOpen(true)
              }}
            >
              <AddressBookIcon
                color={
                  style.flatten(["color-blue-400", "dark:color-blue-100"])
                    .color
                }
                height={18}
              />
            </TouchableOpacity>
          </View>
        }
        autoCorrect={false}
        autoCapitalize="none"
      />
      <Selector
        label="Token"
        placeHolder="Select Token"
        maxItemsToShow={4}
        items={tokenItems}
        selectedKey={selectedTokenKey}
        setSelectedKey={(key) =>{
          const findItem = tokensByNetworkList.find(val => val.symbol + val.chainId === key);
          if(findItem) {
            selectSendAsset(findItem);
          } else {
            selectSendAsset(undefined);
          }
          setSelectedTokenKey(key);
        }}
      />
      <TextInput
      label={"Amount"}
      value={sendAmount}
      onChangeText={handleInputAmountChange}
      inputRight={
        <View
          style={style.flatten([
            "height-1",
            "overflow-visible",
            "justify-center",
          ])}
        >
          <Button
            text="MAX"
            mode={(() => {
              if (style.theme === "dark") {
                return "light";
              } else {
                return "fill";
              }
            })()}
            size="small"
            style={style.flatten(["padding-x-5", "padding-y-3"])}
            containerStyle={style.flatten(
              ["height-24", "border-radius-4", "dark:background-color-platinum-600"],
            )}
            textStyle={style.flatten(
              ["normal-case", "text-caption2", "dark:color-platinum-200"],
            )}
            onPress={() => {
              setPresetAmountValue(1)
            }}
          />
        </View>
      }
      error={sendErrorText}
      keyboardType="numeric"
    />
      {/* <MemoInput label="Memo (Optional)" memoConfig={sendConfigs.memoConfig} /> */}
      {/* <FeeButtons
        label="Fee"
        gasLabel="gas"
        feeConfig={sendConfigs.feeConfig}
        gasConfig={sendConfigs.gasConfig}
      /> */}
      <View style={style.flatten(["flex-1"])} />
      <Button
        text="Send"
        size="large"
        onPress={onClickReviewOrENSConsent}
        loading={searchingForDomain}
        disabled={isReviewButtonDisabled}
      />
      <View style={style.flatten(["height-page-pad"])} />
      {/* account list */}
      <SelectorModal
        isOpen={isModalOpen}
        close={() => setIsModalOpen(false)}
        items={accountsByNetwork}
        selectedKey={selectedKey}
        maxItemsToShow={4}
        setSelectedKey={(key)=>{
          setSelectedKey(key)
          handleInputAddressChange(key || '')
        }}
        modalPersistent={false}
      />
    </PageWithScrollView>
  );
};
