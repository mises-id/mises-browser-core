import * as React from "react";
import { FunctionComponent } from "react";
import { Card, CardBody } from "../../components/card";
import { Text, View, ViewStyle } from "react-native";
import { useStyle } from "../../styles";
import { AddressCopyable } from "../../components/address-copyable";
// import { useSmartNavigation } from "../../navigation";
import { NetworkErrorView } from "./network-error-view";
import { FunctionModules } from "./function-modules";
import { FunctionTabs } from "./function-tabs";

export const AccountCard: FunctionComponent<{
  containerStyle?: ViewStyle;
}> = ({ containerStyle }) => {
  const style = useStyle();

  // const smartNavigation = useSmartNavigation();

  return (
    <Card style={containerStyle}>
      <CardBody style={style.flatten(["padding-bottom-0"])}>
        <View style={style.flatten(["flex", "items-center"])}>
          <Text
            style={style.flatten(["h4", "color-text-high", "margin-bottom-8"])}
          >
            {"222"}
          </Text>
          <AddressCopyable
            address={"0xab4709e064D2ed9F6dE2c009C5E573bB40C63570"}
          />
          <View style={style.flatten(["margin-top-28", "margin-bottom-16"])}>
            <View style={style.flatten(["items-center", "justify-center"])}>
              <Text style={style.flatten(["h3", "color-text-high"])}>
                {"0 ETH"}
              </Text>
            </View>
          </View>
        </View>
        <FunctionModules />
        <FunctionTabs />
      </CardBody>
      <NetworkErrorView />
    </Card>
  );
};
