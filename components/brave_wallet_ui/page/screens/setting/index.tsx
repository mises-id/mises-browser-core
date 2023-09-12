import * as React from "react";
import { FunctionComponent } from "react";
import { PageWithScrollViewInBottomTabView } from "../../components/page";
import { SettingSectionTitle } from "./components";
import { SettingSelectAccountItem } from "./items/select-account";
// import { useSmartNavigation } from "../../navigation";
import { SettingRemoveAccountItem } from "./items/remove-account";
import { SettingViewPrivateDataItem } from "./items/view-private-data";
import { useStyle } from "../../styles";
import { View } from "react-native";
import { SettingThemeItem } from "./items/theme";
import { SettingViewSetLockTime } from "./items/view-set-lock-time";

export const SettingScreen: FunctionComponent = () => {
  const style = useStyle();

  // const smartNavigation = useSmartNavigation();

  // const showManageTokenButton = (() => {
  //   if (!chainStore.current.features) {
  //     return false;
  //   }

  //   if (chainStore.current.features.includes("cosmwasm")) {
  //     return true;
  //   }
  // })();

  return (
    <PageWithScrollViewInBottomTabView backgroundMode="secondary">
      <SettingSelectAccountItem />
      <SettingSectionTitle title="General" />
      {/* <SettingItem
        label="Address book"
        right={<RightArrow />}
        onPress={() => {
          smartNavigation.navigateSmart("AddressBook", {});
        }}
      /> */}
      {/* <SettingItem
        label="Manage tokens"
        right={<RightArrow />}
        onPress={() => {
          smartNavigation.navigateSmart("Setting.ManageTokens", {});
        }}
      /> */}
      <SettingViewSetLockTime />
      <SettingThemeItem />
      <SettingSectionTitle title="Security" />
      <SettingViewPrivateDataItem topBorder={true} />
      {/* <SettingBiometricLockItem /> */}
      {/*{keychainStore.isBiometrySupported || keychainStore.isBiometryOn ? (
        <SettingBiometricLockItem
          topBorder={!canShowPrivateData(keyRingStore.keyRingType)}
        />
      ) : null} */}
      <SettingRemoveAccountItem topBorder={true} />
      {/* Mock element for padding bottom */}
      <View style={style.get("height-16")} />
    </PageWithScrollViewInBottomTabView>
  );
};
