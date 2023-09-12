import * as React from "react";
import {FunctionComponent, useState, useEffect } from "react";
import {
  Keyboard,
  KeyboardEvent,
  Platform,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { useStyle } from "../../styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  Easing,
  useAnimatedReaction,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import ReactNativeModal from "react-native-modal";

// CONTRACT: Use with { disableSafeArea: true, align: "bottom" } modal options.
export const CardModal: FunctionComponent<{
  title?: string;
  right?: React.ReactElement;
  childrenContainerStyle?: ViewStyle;
  children: any;
  disableGesture?: boolean;
  isOpen?: boolean;
  close?: () => void;
}> = ({
  title,
  right,
  children,
  childrenContainerStyle,
  disableGesture = false,
  isOpen,
  close
}) => {
  const style = useStyle();
  const safeAreaInsets = useSafeAreaInsets();

  const [softwareKeyboardBottomPadding, setSoftwareKeyboardBottomPadding] =
    useState(0);

  useEffect(() => {
    const onKeyboarFrame = (e: KeyboardEvent) => {
      setSoftwareKeyboardBottomPadding(
        e.endCoordinates.height - safeAreaInsets.bottom
      );
    };
    const onKeyboardClearFrame = () => {
      setSoftwareKeyboardBottomPadding(0);
    };

    // No need to do this on android
    if (Platform.OS !== "android") {
      Keyboard.addListener("keyboardWillShow", onKeyboarFrame);
      Keyboard.addListener("keyboardWillChangeFrame", onKeyboarFrame);
      Keyboard.addListener("keyboardWillHide", onKeyboardClearFrame);

      return () => {
        // Keyboard.removeListener("keyboardWillShow", onKeyboarFrame);
        // Keyboard.removeListener("keyboardWillChangeFrame", onKeyboarFrame);
        // Keyboard.removeListener("keyboardWillHide", onKeyboardClearFrame);
      };
    }
    return () => {

    }
  }, [safeAreaInsets.bottom]);

  const animatedKeyboardPaddingBottomValue = useSharedValue(0);

  useAnimatedReaction(
    () => softwareKeyboardBottomPadding,
    (value) => {
      if (value > 0) {
        animatedKeyboardPaddingBottomValue.value = withTiming(
          softwareKeyboardBottomPadding,
          {
            duration: 175,
            easing: Easing.linear,
          }
        );
      } else {
        animatedKeyboardPaddingBottomValue.value = 0;
      }
    }
  );

  return (
    <ReactNativeModal isVisible={isOpen} style={{
      justifyContent: "flex-end",
    }} onBackdropPress={close}>
      <Animated.View
        style={StyleSheet.flatten([
          style.flatten([
            "background-color-background-tertiary",
            "border-radius-top-left-8",
            "border-radius-top-right-8",
            "overflow-hidden",
          ]),
          {
            paddingBottom: animatedKeyboardPaddingBottomValue,
          }
        ])}
      >
        <PanGestureHandler enabled={!disableGesture}>
          {/* Below view is not animated, but to let the gesture handler to accept the animated block, you should set the children of the gesture handler as the Animated.View */}
          <Animated.View style={style.flatten(["padding-x-page"])}>
            <View style={style.flatten(["items-center", "margin-bottom-16"])}>
              {!disableGesture ? (
                <View
                  style={style.flatten([
                    "margin-top-8",
                    "width-58",
                    "height-5",
                    "border-radius-16",
                    "background-color-gray-100",
                    "dark:background-color-platinum-400",
                  ])}
                />
              ) : null}
            </View>
            {title ? (
              <React.Fragment>
                <View
                  style={style.flatten([
                    "flex-row",
                    "items-center",
                    "margin-bottom-16",
                  ])}
                >
                  <Text style={style.flatten(["h4", "color-text-high"])}>
                    {title}
                  </Text>
                  {right}
                </View>
                <View
                  style={style.flatten([
                    "height-1",
                    "background-color-gray-50",
                    "dark:background-color-platinum-500",
                  ])}
                />
              </React.Fragment>
            ) : null}
          </Animated.View>
        </PanGestureHandler>
        <View
          style={StyleSheet.flatten([
            style.flatten(["padding-page", "padding-top-16"]),
            childrenContainerStyle,
          ])}
        >
          {children}
        </View>
      </Animated.View>
    </ReactNativeModal>
  );
};
