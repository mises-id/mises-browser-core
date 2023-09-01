import * as React from "react";
import { FunctionComponent } from "react";
import { StyleSheet, Text, ViewStyle, View } from "react-native";
import { useStyle } from "../../styles";
import Clipboard from "@react-native-clipboard/clipboard";
import { RectButton } from "../rect-button";
import { CopyIcon } from "../icon";
import { useSimpleTimer } from "../../hooks";
import LottieView from "lottie-react-native";
import { shortenAddress } from "../../common";

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
          <View style={style.flatten(["margin-left-2"])}>
            <View style={style.flatten(["width-20", "height-20"])}>
              <View
                style={StyleSheet.flatten([
                  style.flatten(["absolute", "justify-center", "items-center"]),
                  {
                    left: 0,
                    right: 4,
                    top: 0,
                    bottom: 0,
                  },
                ])}
              >
                <LottieView
                  // TODO: Change color of animated check button according to theme.
                  source={require("../../assets/lottie/check.json")}
                  colorFilters={[
                    {
                      keypath: "Shape Layer 2",
                      color: style.flatten([
                        "color-gray-300",
                        "dark:color-platinum-200",
                      ]).color,
                    },
                    {
                      keypath: "Shape Layer 1",
                      color: style.flatten([
                        "color-gray-300",
                        "dark:color-platinum-200",
                      ]).color,
                    },
                    {
                      keypath: "Layer 1 Outlines",
                      color: style.flatten(["color-white"]).color,
                    },
                  ]}
                  autoPlay
                  speed={2}
                  loop={false}
                  style={style.flatten(["width-58", "height-58"])}
                />
              </View>
            </View>
          </View>
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
