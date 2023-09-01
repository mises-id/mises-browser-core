import * as React from "react";
import { FunctionComponent, useMemo, useState } from "react";
import { PageWithScrollViewInBottomTabView } from "../../../../components/page";
import { useStyle } from "../../../../styles";
import { View } from "react-native";
import { useSmartNavigation } from "../../../../navigation";
import { Button } from "../../../../components/button";
import { AccontSettingModal } from "../../../../modals/account";
import { PasswordInputModal } from "../../../../modals/password-input/modal";
import { getPrivateDataTitle } from "../view-private-data";
import { useUnsafeWalletSelector } from "../../../../../common/hooks/use-safe-selector";
import { WalletSelectors } from "../../../../../common/selectors";
import { KeyStoreItem, KeyStoreSectionTitle } from "../../components";
import { RectButton } from "../../../../components/rect-button";
import { MoreIcon } from "../../../../components/icon";
import { shortenAddress } from "../../../../common";
import { useDispatch } from "react-redux";
import { AccountsTabActions } from "../../../../reducers/accounts-tab-reducer";
import { WalletAccountType, BraveWallet } from "../../../../../constants/types";
import { useApiProxy } from "../../../../../common/hooks/use-api-proxy";
import { WalletPageActions } from "../../../../../page/actions";

export const SettingSelectAccountScreen: FunctionComponent = () => {
  const style = useStyle();

  const smartNavigation = useSmartNavigation();

  const accounts = useUnsafeWalletSelector(WalletSelectors.accounts)
  const mnemonicSeedAccounts = accounts.filter(val => val.accountType === 'Primary');
  const privateKeyAccounts = accounts.filter(val => val.accountType === 'Secondary');
  const selectedAccount = useUnsafeWalletSelector(WalletSelectors.selectedAccount)
  const dispatch = useDispatch()

  const renderKeyStores = (title: string, accountList: WalletAccountType[]) => {
    return (
      <React.Fragment>
        {accountList.length > 0 ? (
          <React.Fragment>
            <KeyStoreSectionTitle title={title} />
            {accountList.map((account, i) => {
              return (
                <KeyStoreItem
                  key={i.toString()}
                  label={account.name || "Mises Account"}
                  secondLabel={selectedAccount?.address.toLowerCase() === account.address.toLowerCase() ? "(selected)" : ""}
                  paragraph={shortenAddress(account.address)}
                  topBorder={i === 0}
                  bottomBorder={accountList.length - 1 !== i}
                  right={
                    <RectButton
                      style={style.flatten([
                        "height-full",
                        "width-40",
                        "items-center",
                        "justify-center",
                      ])}
                      hitSlop={{ top: 50, bottom: 50 }}
                      onPress={() => {
                        setselectKeyRingStore(account);
                        setIsOpenModal(true);
                      }}
                    >
                      <MoreIcon
                        color={style.get("color-text-low").color}
                        size={24}
                      />
                    </RectButton>
                  }
                  onPress={async () => {
                    console.log(account, "accountaccountaccount")
                    dispatch(AccountsTabActions.setSelectedAccount(account))
                    // await selectKeyStore(keyStore);
                  }}
                />
              );
            })}
          </React.Fragment>
        ) : null}
      </React.Fragment>
    );
  };

  const addAccount = () => {
    smartNavigation.navigateSmart("Register.AddAccount", {});
  };

  // const registerConfig = useRegisterConfig(keyRingStore, []);

  const importAccount = () => {
    // analyticsStore.logEvent("Import account started", {
    //   registerType: "seed",
    // });
    smartNavigation.navigateSmart("Register.RecoverPrivateKey", {
      registerConfig: undefined,
    });
  };

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectKeyRingStore, setselectKeyRingStore] = useState<WalletAccountType>();

  const selectOptions = useMemo(() => {
    const options = [
      {
        key: "viewPrivateKey",
        label: "View private key",
      },
      {
        key: "changeName",
        label: "Change account name",
      },
    ];
    if (selectKeyRingStore?.accountType === "Secondary") {
      options.push({
        key: "delete",
        label: "Delete account",
      });
    }
    return options;
  }, [selectKeyRingStore]);
  const [showPrivatePop, setshowPrivatePop] = useState(false);
  const [showDeletePop, setshowDeletePop] = useState(false);

  const itemClick = (key: string) => {
    setIsOpenModal(false);
    if (key === "viewPrivateKey") {
      setTimeout(() => {
        setshowPrivatePop(true);
      }, 500);
    }
    if (key === "changeName") {
      smartNavigation.navigateSmart("Setting.RenameAccount", {
        keyRingStore: selectKeyRingStore,
      });
    }
    if (key === "delete") {
      setTimeout(() => {
        setshowDeletePop(true);
      }, 500);
    }
  };

  const { keyringService } = useApiProxy()

  const onViewPrivateKey = React.useCallback(async (
    address: string,
    password: string,
    coin: BraveWallet.CoinType
  ) => {
    const { privateKey } = await keyringService.encodePrivateKeyForExport(
      address,
      password,
      coin
    )
    return privateKey
  }, [keyringService])

  return (
    <PageWithScrollViewInBottomTabView backgroundMode="secondary">
      <View
        style={style.flatten([
          "flex",
          "flex-row",
          "justify-end",
          "margin-top-12",
          "margin-right-12",
        ])}
      >
        <View style={style.flatten(["margin-right-12"])}>
          <Button text="Add" size="small" onPress={addAccount} />
        </View>
        <Button text="Import" size="small" onPress={importAccount} />
      </View>
      {renderKeyStores("mnemonic seed", mnemonicSeedAccounts)}
      {renderKeyStores("private key", privateKeyAccounts)}
      {/* {renderKeyStores("mnemonic seed", mnemonicKeyStores)} */}
      {/* Margin bottom for last */}
      <View style={style.get("height-16")} />
      <AccontSettingModal
        options={selectOptions}
        itemClick={itemClick}
        isOpen={isOpenModal}
        close={() => {
          setselectKeyRingStore(undefined);
          setIsOpenModal(false);
        }}
      />
      <PasswordInputModal
        isOpen={showPrivatePop}
        close={() => {
          setselectKeyRingStore(undefined);
          setshowPrivatePop(false);
        }}
        title={getPrivateDataTitle("privateKey", true)}
        onEnterPassword={async (password) => {
          if(selectKeyRingStore) {
            onViewPrivateKey(selectKeyRingStore.address, password, selectKeyRingStore.coin).then(privateData => {
              smartNavigation.navigateSmart("Setting.ViewPrivateData", {
                privateData,
                privateDataType: 'privateKey',
              });
              setselectKeyRingStore(undefined);
            })
          }
        }}
      />
      <PasswordInputModal
        isOpen={showDeletePop}
        close={() => {
          setselectKeyRingStore(undefined);
          setshowDeletePop(false);
        }}
        title={getPrivateDataTitle("privateKey", true)}
        onEnterPassword={async (password) => {
          if(selectKeyRingStore) {
            dispatch(WalletPageActions.removeImportedAccount({ address: selectKeyRingStore.address, coin: selectKeyRingStore.coin, password }))
          }
        }}
      />
    </PageWithScrollViewInBottomTabView>
  );
};
