import * as React from "react";
import { FunctionComponent } from "react";
import { StyleSheet, Text, ViewStyle, View } from "react-native";
import { useStyle } from "../../styles";
import Clipboard from "@react-native-clipboard/clipboard";
import { RectButton } from "../rect-button";
import { CopyIcon } from "../icon";
import { useSimpleTimer } from "../../hooks";
import { shortenAddress } from "../../common";
import { CheckIcon } from "../../components/icon";

export const AddressCopyable: FunctionComponent<{
  style?: ViewStyle;
  address: string;
  showAll?: boolean;
}> = ({ style: propStyle, address, showAll }) => {
  const style = useStyle();
  const { isTimedOut, setTimer } = useSimpleTimer();

  return (
    <RectButton
      style={StyleSheet.flatten([
        style.flatten([
          "padding-left-12",
          "padding-right-8",
          "padding-y-2",
          "border-radius-12",
          "background-color-gray-50",
          "dark:background-color-platinum-500",
          "flex-row",
          "items-center",
        ]),
        propStyle,
      ])}
      onPress={() => {
        Clipboard.setString(address);
        setTimer(2000);
      }}
      rippleColor={
        style.flatten(["color-gray-200", "dark:color-platinum-300"]).color
      }
      underlayColor={
        style.flatten(["color-gray-300", "dark:color-platinum-200"]).color
      }
      activeOpacity={0.2}
    >
      <Text
        style={style.flatten([
          "subtitle3",
          "color-gray-300",
          "dark:color-platinum-200",
        ])}
      >
        {showAll ? address :  shortenAddress(address)}
      </Text>
      <View style={style.flatten(["margin-left-4", "width-20"])}>
        {isTimedOut ? (
          <CheckIcon />
        ) : (
          <CopyIcon
            color={
              style.flatten(["color-gray-300", "dark:color-platinum-200"]).color
            }
            size={19}
          />
        )}
      </View>
    </RectButton>
  );
};
