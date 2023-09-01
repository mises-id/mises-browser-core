import * as React from "react";
import { FunctionComponent } from "react";
import { KeyStoreItem, RightArrow } from "../components";
import { useStyle } from "../../../styles";
import { useSmartNavigation } from "../../../navigation";
import { View } from "react-native";
import { useUnsafeWalletSelector } from "../../../../common/hooks/use-safe-selector";
import { WalletSelectors } from "../../../../common/selectors";
import { shortenAddress } from "../../../common";

export const SettingSelectAccountItem: FunctionComponent = () => {
  const style = useStyle();
  const selectedAccount = useUnsafeWalletSelector(WalletSelectors.selectedAccount)

  const smartNavigation = useSmartNavigation();

  return (
    <React.Fragment>
      <View
        style={style.flatten([
          "height-1",
          "background-color-gray-50",
          "dark:background-color-platinum-500@75%",
        ])}
      />
      {selectedAccount ? <KeyStoreItem
        containerStyle={style.flatten(["padding-left-10"])}
        defaultRightWalletIconStyle={style.flatten(["margin-right-2"])}
        label={selectedAccount?.name}
        paragraph={shortenAddress(selectedAccount.address)}
        right={<RightArrow />}
        topBorder={false}
        bottomBorder={false}
        onPress={() => {
          smartNavigation.navigateSmart("SettingSelectAccount", {});
        }}
      /> : null}
      <View
        style={style.flatten([
          "height-1",
          "background-color-gray-50",
          "dark:background-color-platinum-500@75%",
        ])}
      />
    </React.Fragment>
  );
};
