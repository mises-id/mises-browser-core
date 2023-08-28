import * as React from "react";
import { FunctionComponent } from "react";
import { Text, View } from "react-native";
import { useStyle } from "../../styles";
import { ReceiveSymbol } from "../../components/transaction/receive-icon";
import { SendSymbol } from "../../components/transaction/send-icon";

export const FunctionModules: FunctionComponent = () => {
  const style = useStyle();
  return (
    <View style={style.flatten(["flex", "flex-row", "justify-center"])}>
      <View style={style.flatten(["flex", "items-center", "margin-10"])}>
        <SendSymbol size={35} color={style.get("color-blue-400").color} />
        <Text style={style.flatten(["h6", "color-text-high", "margin-top-4"])}>
          Send
        </Text>
      </View>
      <View style={style.flatten(["flex", "items-center", "margin-10"])}>
        <ReceiveSymbol size={35} color={style.get("color-blue-400").color} />
        <Text style={style.flatten(["h6", "color-text-high", "margin-top-4"])}>
          Receive
        </Text>
      </View>
    </View>
  );
};
