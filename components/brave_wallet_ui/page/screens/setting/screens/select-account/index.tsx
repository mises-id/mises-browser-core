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

export const getKeyStoreParagraph = (keyStore: any) => {
  const bip44HDPath = keyStore.bip44HDPath
    ? keyStore.bip44HDPath
    : {
        account: 0,
        change: 0,
        addressIndex: 0,
      };

  switch (keyStore.type) {
    case "ledger":
      return `Ledger - m/44'/118'/${bip44HDPath.account}'${
        bip44HDPath.change !== 0 || bip44HDPath.addressIndex !== 0
          ? `/${bip44HDPath.change}/${bip44HDPath.addressIndex}`
          : ""
      }`;
    case "mnemonic":
      if (
        bip44HDPath.account !== 0 ||
        bip44HDPath.change !== 0 ||
        bip44HDPath.addressIndex !== 0
      ) {
        return `Mnemonic - m/44'/-/${bip44HDPath.account}'${
          bip44HDPath.change !== 0 || bip44HDPath.addressIndex !== 0
            ? `/${bip44HDPath.change}/${bip44HDPath.addressIndex}`
            : ""
        }`;
      }
      return;
    case "privateKey":
      // Torus key
      if (keyStore.meta?.email) {
        return keyStore.meta.email;
      }
      return;
  }
};

export const SettingSelectAccountScreen: FunctionComponent = () => {
  const style = useStyle();

  const smartNavigation = useSmartNavigation();

  // const googleTorusKeyStores = useMemo(() => {
  //   return keyRingStore.multiKeyStoreInfo.filter(
  //     (keyStore) =>
  //       keyStore.type === "privateKey" &&
  //       keyStore.meta &&
  //       keyStore.meta.email &&
  //       // In prior version, only the google sign in option exists.
  //       // But, now, there are two types of sign in (google, apple).
  //       // `socialType` in meta is introduced to determine which social sign in was used.
  //       // If there is no `socialType` field in meta, just assume that it was google sign in.
  //       (!keyStore.meta.socialType || keyStore.meta.socialType === "google")
  //   );
  // }, [keyRingStore.multiKeyStoreInfo]);

  // const appleTorusKeyStores = useMemo(() => {
  //   return keyRingStore.multiKeyStoreInfo.filter(
  //     (keyStore) =>
  //       keyStore.type === "privateKey" &&
  //       keyStore.meta &&
  //       keyStore.meta.email &&
  //       keyStore.meta.socialType === "apple"
  //   );
  // }, [keyRingStore.multiKeyStoreInfo]);

  // const mnemonicKeyStores = useMemo(() => {
  //   return keyRingStore.multiKeyStoreInfo.filter(
  //     (keyStore) => !keyStore.type || keyStore.type === "mnemonic"
  //   );
  // }, [keyRingStore.multiKeyStoreInfo]);

  // const ledgerKeyStores = useMemo(() => {
  //   return keyRingStore.multiKeyStoreInfo.filter(
  //     (keyStore) => keyStore.type === "ledger"
  //   );
  // }, [keyRingStore.multiKeyStoreInfo]);

  // const privateKeyStores = useMemo(() => {
  //   return keyRingStore.multiKeyStoreInfo.filter(
  //     (keyStore) => keyStore.type === "privateKey" && !keyStore.meta?.email
  //   );
  // }, [keyRingStore.multiKeyStoreInfo]);

  // const loadingScreen = useLoadingScreen();

  // const selectKeyStore = async (
  //   keyStore: MultiKeyStoreInfoWithSelectedElem
  // ) => {
  //   const index = keyRingStore.multiKeyStoreInfo.indexOf(keyStore);
  //   if (index >= 0) {
  //     await loadingScreen.openAsync();
  //     await keyRingStore.changeKeyRing(index);
  //     loadingScreen.setIsLoading(false);

  //     smartNavigation.navigateSmart("Home", {});
  //   }
  // };

  // const renderKeyStores = (title: string, keyStores: any[]) => {
  //   return (
  //     <React.Fragment>
  //       {keyStores.length > 0 ? (
  //         <React.Fragment>
  //           <KeyStoreSectionTitle title={title} />
  //           {keyStores.map((keyStore, i) => {
  //             return (
  //               <KeyStoreItem
  //                 key={i.toString()}
  //                 label={keyStore.meta?.name || "Mises Account"}
  //                 secondLabel={keyStore.selected ? "(selected)" : ""}
  //                 paragraph={getKeyStoreParagraph(keyStore)}
  //                 topBorder={i === 0}
  //                 bottomBorder={keyStores.length - 1 !== i}
  //                 right={
  //                   <RectButton
  //                     style={style.flatten([
  //                       "height-full",
  //                       "width-40",
  //                       "items-center",
  //                       "justify-center",
  //                     ])}
  //                     hitSlop={{ top: 50, bottom: 50 }}
  //                     onPress={() => {
  //                       setselectKeyRingStore(keyStore);
  //                       setIsOpenModal(true);
  //                     }}
  //                   >
  //                     <MoreIcon
  //                       color={style.get("color-text-low").color}
  //                       size={24}
  //                     />
  //                   </RectButton>
  //                 }
  //                 onPress={async () => {
  //                   // await selectKeyStore(keyStore);
  //                 }}
  //               />
  //             );
  //           })}
  //         </React.Fragment>
  //       ) : null}
  //     </React.Fragment>
  //   );
  // };

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
  const [selectKeyRingStore, setselectKeyRingStore] = useState<any>();

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
    if (selectKeyRingStore?.type === "privateKey") {
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
      {/* {renderKeyStores("private key", privateKeyStores)} */}
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
          // const index = keyRingStore.multiKeyStoreInfo.findIndex(
          //   (keyStore) =>
          //     JSON.stringify(keyStore) === JSON.stringify(selectKeyRingStore)
          // );
          // if (index >= 0) {
          //   const privateData = await keyRingStore.showKeyRing(index, password);
          //   smartNavigation.navigateSmart("Setting.ViewPrivateData", {
          //     privateData: privateData,
          //     privateDataType: keyRingStore.keyRingType,
          //   });
          //   setselectKeyRingStore(undefined);
          // }
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
          // const index = keyRingStore.multiKeyStoreInfo.findIndex(
          //   (keyStore) =>
          //     JSON.stringify(keyStore) === JSON.stringify(selectKeyRingStore)
          // );
          // if (index >= 0) {
          //   await keyRingStore.deleteKeyRing(index, password);
          //   setselectKeyRingStore(undefined);
          // }
        }}
      />
    </PageWithScrollViewInBottomTabView>
  );
};
