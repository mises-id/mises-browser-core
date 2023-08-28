import * as React from "react";
import { FunctionComponent } from "react";
import { PageWithScrollView } from "../../components/page";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { useStyle } from "../../styles";
import { useSmartNavigation } from "../../navigation";
import { RightArrowIcon } from "../../components/icon";
import { RectButton } from "../../components/rect-button";
import { TokenSymbol } from "../../components/token-symbol";

export const TokensScreen: FunctionComponent = () => {
  // const style = useStyle();

  // const tokens = queryBalances.positiveNativeUnstakables
  //   .concat(queryBalances.nonNativeBalances)
  //   .sort((a, b) => {
  //     const aDecIsZero = a.balance.toDec().isZero();
  //     const bDecIsZero = b.balance.toDec().isZero();

  //     if (aDecIsZero && !bDecIsZero) {
  //       return 1;
  //     }
  //     if (!aDecIsZero && bDecIsZero) {
  //       return -1;
  //     }

  //     return a.currency.coinDenom < b.currency.coinDenom ? -1 : 1;
  //   });

  // const smartNavigation = useSmartNavigation();

  // const showAddTokenButton = (() => {
  //   if (!chainStore.current.features) {
  //     return false;
  //   }

  //   if (chainStore.current.features.includes("cosmwasm")) {
  //     return true;
  //   }
  // })();

  // useEffect(() => {
  //   if (showAddTokenButton) {
  //     smartNavigation.setOptions({
  //       // eslint-disable-next-line react/display-name
  //       headerRight: () => (
  //         <HeaderRightButton
  //           onPress={() => {
  //             smartNavigation.navigateSmart("Setting.AddToken", {});
  //           }}
  //         >
  //           <HeaderAddIcon />
  //         </HeaderRightButton>
  //       ),
  //     });
  //   } else {
  //     smartNavigation.setOptions({
  //       headerRight: undefined,
  //     });
  //   }
  // }, [showAddTokenButton, smartNavigation]);

  return (
    <PageWithScrollView backgroundMode="gradient">
      {/* {tokens.length > 0 ? (
        <Card style={style.flatten(["padding-bottom-14"])}>
          {tokens.map((token) => {
            return (
              <TokenItem
                key={token.currency.coinMinimalDenom}
                chainInfo={chainStore.current}
                balance={token.balance}
              />
            );
          })}
        </Card>
      ) : null} */}
    </PageWithScrollView>
  );
};

export const TokenItem: FunctionComponent<{
  containerStyle?: ViewStyle;

  chainInfo: {
    stakeCurrency: any;
  };
  balance: any;
}> = ({ containerStyle, chainInfo, balance }) => {
  const style = useStyle();

  const smartNavigation = useSmartNavigation();

  // The IBC currency could have long denom (with the origin chain/channel information).
  // Because it is shown in the title, there is no need to show such long denom twice in the actual balance.
  const balanceCoinDenom = (() => {
    if (
      "originCurrency" in balance.currency &&
      balance.currency.originCurrency
    ) {
      return balance.currency.originCurrency.coinDenom;
    }
    return balance.currency.coinDenom;
  })();

  return (
    <RectButton
      style={StyleSheet.flatten([
        style.flatten([
          "flex-row",
          "items-center",
          "padding-x-card-horizontal",
          "padding-y-14",
        ]),
        containerStyle,
      ])}
      onPress={() => {
        smartNavigation.navigateSmart("Send", {
          currency: balance.currency.coinMinimalDenom,
        });
      }}
    >
      <TokenSymbol
        style={style.flatten(["margin-right-12"])}
        size={44}
        chainInfo={chainInfo}
        currency={balance.currency}
      />
      <View>
        <Text
          style={style.flatten([
            "subtitle3",
            "color-text-low",
            "margin-bottom-4",
            "uppercase",
          ])}
        >
          {balance.currency.coinDenom}
        </Text>
        <Text
          style={style.flatten(["h5", "color-text-high", "max-width-240"])}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {`${balance
            .trim(true)
            .shrink(true)
            .maxDecimals(6)
            .upperCase(true)
            .hideDenom(true)
            .toString()} ${balanceCoinDenom}`}
        </Text>
      </View>
      <View style={style.get("flex-1")} />
      <RightArrowIcon
        height={16}
        color={
          style.flatten(["color-gray-200", "dark:color-platinum-300"]).color
        }
      />
    </RectButton>
  );
};
