import * as React from "react";
import { FunctionComponent } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { useStyle } from "../../styles";

export const CardBody: FunctionComponent<{
  style?: ViewStyle;
  children: any;
}> = ({ style: propStyle, children }) => {
  const style = useStyle();

  return (
    <View
      style={StyleSheet.flatten([
        style.flatten(["padding-x-card-horizontal", "padding-y-card-vertical"]),
        propStyle,
      ])}
    >
      {children}
    </View>
  );
};
