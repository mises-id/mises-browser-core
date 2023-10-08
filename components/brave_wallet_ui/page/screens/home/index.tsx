import * as React from "react";
import { FunctionComponent, useCallback, useRef } from "react";
import { RefreshControl, ScrollView } from "react-native";
import { PageWithScrollViewInBottomTabView } from "../../components/page";
import { useStyle } from "../../styles";
import { BIP44Selectable } from "./bip44-selectable";
import { AccountCard } from "./account-card";

export const HomeScreen: FunctionComponent = () => {
  const [refreshing] = React.useState(false);

  const style = useStyle();

  const scrollViewRef = useRef<ScrollView | null>(null);

  const onRefresh = useCallback(() => {
    console.log("onRefresh");
  }, []);

  return (
    <PageWithScrollViewInBottomTabView
      backgroundMode="gradient"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ref={scrollViewRef}
    >
      <BIP44Selectable />
      <AccountCard containerStyle={style.flatten(["margin-y-card-gap"])} />
    </PageWithScrollViewInBottomTabView>
  );
};
