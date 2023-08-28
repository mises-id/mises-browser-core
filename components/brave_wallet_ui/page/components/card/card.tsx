import * as React from "react";
import { FunctionComponent } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { useStyle } from "../../styles";

export const Card: FunctionComponent<{
  style?: ViewStyle;
  children: any;
}> = ({ style: propStyle, children }) => {
  const style = useStyle();

  return (
    <View
      style={StyleSheet.flatten([
        style.flatten([
          "width-full",
          "background-color-card",
          "overflow-hidden",
        ]),
        propStyle,
      ])}
    >
      {children}
    </View>
  );
};
