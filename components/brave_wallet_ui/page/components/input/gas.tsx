import * as React from "react";
import { FunctionComponent } from "react";
import { TextStyle, ViewStyle } from "react-native";
import { TextInput } from "./input";

export const GasInput: FunctionComponent<{
  labelStyle?: TextStyle;
  containerStyle?: ViewStyle;
  inputContainerStyle?: ViewStyle;

  label: string;

  gasConfig: any;
}> = ({
  labelStyle,
  containerStyle,
  inputContainerStyle,
  label,
  gasConfig,
}) => {
  return (
    <TextInput
      labelStyle={labelStyle}
      containerStyle={containerStyle}
      inputContainerStyle={inputContainerStyle}
      label={label}
      value={gasConfig.gasRaw}
      onChangeText={(text) => {
        gasConfig.setGas(text);
      }}
      keyboardType="number-pad"
    />
  );
};
