import * as React from "react";
import { FunctionComponent, useState } from "react";
import { SettingItem } from "../components";
import { PasswordInputModal } from "../../../modals/password-input/modal";
import { getPrivateDataTitle } from "../screens/view-private-data";
// import { useSmartNavigation } from "../../../navigation";

export const SettingViewPrivateDataItem: FunctionComponent<{
  topBorder?: boolean;
}> = ({ topBorder }) => {
  // const smartNavigation = useSmartNavigation();

  const [isOpenModal, setIsOpenModal] = useState(false);

  return (
    <React.Fragment>
      <SettingItem
        label={getPrivateDataTitle("mnemonic")}
        onPress={() => {
          setIsOpenModal(true);
        }}
        topBorder={topBorder}
      />
      <PasswordInputModal
        isOpen={isOpenModal}
        close={() => setIsOpenModal(false)}
        title={getPrivateDataTitle("mnemonic", true)}
        onEnterPassword={async (password) => {
          // const index = keyRingStore.multiKeyStoreInfo.findIndex(
          //   (keyStore) => keyStore.selected
          // );

          // if (index >= 0) {
          //   const privateData = await keyRingStore.exportKeyRingDatas(password);
          //   smartNavigation.navigateSmart("Setting.ViewPrivateData", {
          //     privateData: privateData[0].key,
          //     privateDataType: keyRingStore.keyRingType,
          //   });
          // }
        }}
      />
    </React.Fragment>
  );
};
