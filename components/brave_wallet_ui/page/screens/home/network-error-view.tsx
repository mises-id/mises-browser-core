import * as React from "react";
import {FunctionComponent, useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
  Easing,
  useAnimatedReaction,
  useSharedValue,
} from "react-native-reanimated";
import { AlertIcon, RefreshIcon } from "../../components/icon";
import { useStyle } from "../../styles";
import { useNetInfo } from "@react-native-community/netinfo";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useSpinAnimated } from "../../components/spinner";

export const NetworkErrorView: FunctionComponent = () => {
  const style = useStyle();

  const extraHeight = 32;

  const netInfo = useNetInfo();
  const networkIsConnected =
    typeof netInfo.isConnected !== "boolean" || netInfo.isConnected;

  const [isOpen, setIsOpen] = useState(false);
  const [isRefreshable, setIsRefreshable] = useState(true);
  const [message, setMessage] = useState("");

  const prevNetworkIsConnected = useRef(true);
  useEffect(() => {
    if (!networkIsConnected) {
      setIsOpen(true);
      setMessage("No internet connection");
      setIsRefreshable(false);
    } else {
      setIsOpen(false);

      // If the network is recovered.
      // if (!prevNetworkIsConnected.current) {
      //   ObservableQuery.refreshAllObserved();
      // }
    }

    return () => {
      prevNetworkIsConnected.current = networkIsConnected;
    };
  }, [networkIsConnected]);

  // useEffect(() => {
  //   if (networkIsConnected) {
  //     const error =
  //       queryStakable.error || queryDelegated.error || queryUnbonding.error;

  //     if (error) {
  //       const errorData = error.data as { error?: string } | undefined;
  //       const message = (() => {
  //         if (errorData?.error) {
  //           return "Failed to get response\n" + errorData.error;
  //         }

  //         return error.message || "Unknown error";
  //       })();

  //       setIsOpen(true);
  //       setMessage(message);
  //       setIsRefreshable(true);
  //     } else {
  //       setIsOpen(false);
  //     }
  //   }
  // }, [
  //   queryStakable.error,
  //   queryDelegated.error,
  //   queryUnbonding.error,
  //   networkIsConnected,
  // ]);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const spinAnimated = useSpinAnimated(isRefreshing);

  // useEffect(() => {
  //   if (isRefreshing) {
  //     if (
  //       !queryStakable.isFetching &&
  //       !queryDelegated.isFetching &&
  //       !queryUnbonding.isFetching
  //     ) {
  //       setIsRefreshing(false);
  //     }
  //   }
  // }, [
  //   isRefreshing,
  //   queryDelegated.isFetching,
  //   queryStakable.isFetching,
  //   queryUnbonding.isFetching,
  // ]);

  const [childLayout, setChildLayout] = useState<{
    width: number;
    height: number;
  }>({
    width: 0,
    height: 0,
  });

  const progress = useSharedValue(0);

  useAnimatedReaction(
    () => isOpen,
    (value) => {
      progress.value = value
        ? withTiming(1, {
            duration: 500,
            easing: Easing.out(Easing.cubic),
          })
        : withTiming(0, {
            duration: 330,
            easing: Easing.out(Easing.sin),
          });
    }
  );

  const animatedHeight = useAnimatedStyle(() => {
    return {
      height: progress.value === 1 ? childLayout.height + extraHeight : 0,
    };
  }, [progress]);

  return (
    <Animated.View
      style={{
        overflow: "hidden",
        ...animatedHeight,
        justifyContent: "center",
      }}
    >
      <View
        style={style.flatten([
          "flex-row",
          "items-center",
          "background-color-red-50@95%",
          "dark:background-color-red-500@40%",
          "padding-left-26",
          "padding-right-24",
          "height-80",
        ])}
        onLayout={(e) => {
          setChildLayout(e.nativeEvent.layout);
        }}
      >
        <View style={style.flatten(["margin-right-16"])}>
          <AlertIcon
            color={style.flatten(["color-red-400", "dark:color-red-300"]).color}
            size={24}
          />
        </View>
        <View style={style.flatten(["flex-1", "overflow-visible"])}>
          <Text
            style={style.flatten([
              "subtitle2",
              "color-red-400",
              "dark:color-red-300",
              "overflow-visible",
            ])}
          >
            {message}
          </Text>
        </View>
        {isRefreshable ? (
          <TouchableOpacity
            disabled={isRefreshing}
            onPress={() => {
              setIsRefreshing(true);
              // ObservableQuery.refreshAllObservedIfError();
            }}
            style={style.flatten([
              "background-color-red-100",
              "justify-center",
              "items-center",
              "width-32",
              "height-32",
              "border-radius-64",
              "margin-left-16",
            ])}
          >
            <Animated.View style={spinAnimated}>
              <RefreshIcon color={style.get("color-red-300").color} size={24} />
            </Animated.View>
          </TouchableOpacity>
        ) : null}
      </View>
    </Animated.View>
  );
};
