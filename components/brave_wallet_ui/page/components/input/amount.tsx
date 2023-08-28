import * as React from "react";
import { FunctionComponent, useMemo } from "react";
import { TextInput } from "./input";
import { TextStyle, View, ViewStyle } from "react-native";
import { Button } from "../button";
import { useStyle } from "../../styles";

export const AmountInput: FunctionComponent<{
  labelStyle?: TextStyle;
  containerStyle?: ViewStyle;
  inputContainerStyle?: ViewStyle;
  errorLabelStyle?: TextStyle;

  label: string;

  amountConfig: any;
}> = ({
  labelStyle,
  containerStyle,
  inputContainerStyle,
  errorLabelStyle,
  label,
  amountConfig,
}) => {
  const style = useStyle();

  const error = amountConfig.error;
  const errorText: string | undefined = useMemo(() => {
    if (error) {
      switch (error.constructor) {
        default:
          return "Unknown error";
      }
    }
    return ''
  }, [error]);

  return (
    <TextInput
      label={label}
      labelStyle={labelStyle}
      containerStyle={containerStyle}
      inputContainerStyle={inputContainerStyle}
      errorLabelStyle={errorLabelStyle}
      value={amountConfig.amount}
      onChangeText={(text: string) => {
        amountConfig.setAmount(text);
      }}
      inputRight={
        <View
          style={style.flatten([
            "height-1",
            "overflow-visible",
            "justify-center",
          ])}
        >
          <Button
            text="MAX"
            mode={(() => {
              if (style.theme === "dark") {
                return "light";
              } else {
                return amountConfig.fraction === 1 ? "light" : "fill";
              }
            })()}
            size="small"
            style={style.flatten(["padding-x-5", "padding-y-3"])}
            containerStyle={style.flatten(
              ["height-24", "border-radius-4"],
              [
                !amountConfig.fraction &&
                "dark:background-color-platinum-500",
                amountConfig.fraction === 1 &&
                "dark:background-color-platinum-600",
              ]
            )}
            textStyle={style.flatten(
              ["normal-case", "text-caption2"],
              [
                !amountConfig.fraction && "dark:color-platinum-50",
                amountConfig.fraction === 1 && "dark:color-platinum-200",
              ]
            )}
            onPress={() => {
              amountConfig.setFraction(
                !amountConfig.fraction ? 1 : undefined
              );
            }}
          />
        </View>
      }
      error={errorText}
      keyboardType="numeric"
    />
  );
}
