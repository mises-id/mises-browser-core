import * as React from "react";
import { FunctionComponent, useState } from "react";
import { SettingItem } from "../components";
import { useStyle } from "../../../styles";
import { PasswordInputModal } from "../../../modals/password-input/modal";
import { useDispatch } from "react-redux";
import { WalletActions } from "../../../../common/actions";
// import { useNavigation } from "@react-navigation/native";

export const SettingRemoveAccountItem: FunctionComponent<{
  topBorder?: boolean;
}> = ({ topBorder }) => {
  const style = useStyle();

  // const navigation = useNavigation();
  const dispatch = useDispatch()
  const [isOpenModal, setIsOpenModal] = useState(false);

  return (
    <React.Fragment>
      <SettingItem
        label="Delete this wallet"
        onPress={() => {
          setIsOpenModal(true);
        }}
        containerStyle={style.flatten(["margin-top-16"])}
        labelStyle={style.flatten(["subtitle1", "color-red-400"])}
        style={style.flatten([
          "justify-center",
          "dark:background-color-red-700@30%",
        ])}
        topBorder={topBorder}
        borderColor={style.flatten(["dark:color-red-600@50%"]).color}
        rippleColor={style.flatten(["dark:color-red-700"]).color}
        underlayColor={style.flatten(["dark:color-red-700"]).color}
      />
      <PasswordInputModal
        isOpen={isOpenModal}
        close={() => setIsOpenModal(false)}
        title="Remove Account"
        onEnterPassword={async (password) => {
          dispatch(WalletActions.lockWallet())
          // const index = keyRingStore.multiKeyStoreInfo.findIndex(
          //   (keyStore) => keyStore.selected
          // );

          // if (index >= 0) {
          //   await keyRingStore.deleteKeyRing(index, password);
          //   analyticsStore.logEvent("Account removed");

          //   if (keyRingStore.multiKeyStoreInfo.length === 0) {
          //     await keychainStore.reset();

          //     navigation.reset({
          //       index: 0,
          //       routes: [
          //         {
          //           name: "Unlock",
          //         },
          //       ],
          //     });
          //   }
          // }
        }}
      />
    </React.Fragment>
  );
};
