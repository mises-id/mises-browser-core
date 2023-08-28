import React from "react";
import {
  FixedHeightSortableList,
  FixedHeightSortableListProps,
} from "../fixed-height-sortable-list";
import { useStyle } from "../../styles";
import { usePageRegisterScrollYValue, useSetFocusedScreen } from "./utils";
import {
  NativeScrollPoint,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";
import { BackgroundMode, ScreenBackground } from "./background";
import { useAnimatedScrollHandler } from "react-native-reanimated";

export function PageWithFixedHeightSortableList<Item extends { key: string }>(
  props: FixedHeightSortableListProps<Item> & {
    disableSafeArea?: boolean;
    backgroundMode: BackgroundMode;
  }
) {
  const style = useStyle();

  useSetFocusedScreen();
  const scrollY = usePageRegisterScrollYValue();

  const {
    style: propStyle,
    disableSafeArea,
    backgroundMode,
    onScroll,
    ...restProps
  } = props;

  const ContainerElement = disableSafeArea ? View : SafeAreaView;
  console.log(onScroll, "onScrollonScroll");
  const scrollHandler = useAnimatedScrollHandler(() => {
    return (
      onScroll &&
      onScroll({
        nativeEvent: {
          contentOffset: ({
            y: scrollY,
          } as unknown) as NativeScrollPoint,
        },
      } as any)
    );
  });
  return (
    <React.Fragment>
      <ScreenBackground backgroundMode={backgroundMode} />
      <ContainerElement style={style.get("flex-1")}>
        <FixedHeightSortableList
          style={StyleSheet.flatten([
            style.flatten(["flex-1", "padding-0", "overflow-visible"]),
            propStyle,
          ])}
          onScroll={scrollHandler}
          {...restProps}
        />
      </ContainerElement>
    </React.Fragment>
  );
}
