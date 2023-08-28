import * as React from "react";
import { FunctionComponent } from "react";
import { TextStyle, ViewStyle } from "react-native";
import { TextInput } from "./input";

export const MemoInput: FunctionComponent<{
  labelStyle?: TextStyle;
  containerStyle?: ViewStyle;
  inputContainerStyle?: ViewStyle;
  errorLabelStyle?: TextStyle;

  label: string;

  memoConfig: any;
}> = ({
  labelStyle,
  containerStyle,
  inputContainerStyle,
  errorLabelStyle,
  label,
  memoConfig,
}) => {
  return (
    <TextInput
      label={label}
      labelStyle={labelStyle}
      containerStyle={containerStyle}
      inputContainerStyle={inputContainerStyle}
      errorLabelStyle={errorLabelStyle}
      value={memoConfig.memo}
      onChangeText={(text: string) => {
        memoConfig.setMemo(text);
      }}
    />
  );
}
