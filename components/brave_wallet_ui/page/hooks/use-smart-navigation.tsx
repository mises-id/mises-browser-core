import {
  CommonActions,
  NavigationProp,
  NavigationState,
  StackActions,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import * as React from "react";
import { createContext, FunctionComponent, useContext } from "react";

export class SmartNavigator<
  Params extends Partial<Record<keyof Config, unknown>>,
  Config extends Record<
    string,
    {
      upperScreenName: string;
    }
  >
> {
  constructor(protected readonly config: Config) {}

  // Helper generic method to avoid bothering "require 2 generic" error on the constructor.
  withParams<
    Params extends Partial<Record<keyof Config, unknown>>
  >(): SmartNavigator<Params, Config> {
    return new SmartNavigator<Params, Config>(this.config);
  }

  navigateSmart<ScreenName extends keyof Config>(
    route: ReturnType<typeof useRoute>,
    navigation: NavigationProp<ReactNavigation.RootParamList>,
    screenName: ScreenName,
    params: Params[ScreenName] extends void ? undefined : Params[ScreenName]
  ): void {
    const currentScreenName = route.name as string;

    if (!(currentScreenName in this.config)) {
      throw new Error(
        `Can't get the current screen info: ${currentScreenName}`
      );
    }

    const currentScreen = this.config[currentScreenName];
    const targetScreen = this.config[screenName];

    if (currentScreen.upperScreenName === targetScreen.upperScreenName) {
      // eslint-disable-next-line @typescript-eslint/ban-types
      navigation.navigate(screenName as never, params as never);
    } else {
      navigation.navigate(
        targetScreen.upperScreenName as never,
        {
          screen: screenName,
          params,
        } as never
      );
    }
  }

  pushSmart<ScreenName extends keyof Config>(
    route: ReturnType<typeof useRoute>,
    navigation: NavigationProp<ReactNavigation.RootParamList>,
    screenName: ScreenName,
    params: Params[ScreenName] extends void ? undefined : Params[ScreenName]
  ): void {
    const currentScreenName = route.name as string;

    if (!(currentScreenName in this.config)) {
      throw new Error(
        `Can't get the current screen info: ${currentScreenName}`
      );
    }

    const currentScreen = this.config[currentScreenName];
    const targetScreen = this.config[screenName];

    if (currentScreen.upperScreenName === targetScreen.upperScreenName) {
      navigation.dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-types
        StackActions.push(screenName as string, params as object | undefined)
      );
    } else {
      navigation.dispatch(
        StackActions.push(targetScreen.upperScreenName, {
          screen: screenName,
          params,
        })
      );
    }
  }

  replaceSmart<ScreenName extends keyof Config>(
    route: ReturnType<typeof useRoute>,
    navigation: NavigationProp<ReactNavigation.RootParamList>,
    screenName: ScreenName,
    params: Params[ScreenName] extends void ? undefined : Params[ScreenName]
  ): void {
    const currentScreenName = route.name as string;

    if (!(currentScreenName in this.config)) {
      throw new Error(
        `Can't get the current screen info: ${currentScreenName}`
      );
    }

    const currentScreen = this.config[currentScreenName];
    const targetScreen = this.config[screenName];

    if (currentScreen.upperScreenName === targetScreen.upperScreenName) {
      navigation.dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-types
        StackActions.replace(screenName as string, params as object | undefined)
      );
    } else {
      navigation.dispatch(
        StackActions.replace(targetScreen.upperScreenName, {
          screen: screenName,
          params,
        })
      );
    }
  }

  reset(
    route: ReturnType<typeof useRoute>,
    navigation: NavigationProp<ReactNavigation.RootParamList>,
    params: NavigationState
  ): void {
    const currentScreenName = route.name as string;

    if (!(currentScreenName in this.config)) {
      throw new Error(
        `Can't get the current screen info: ${currentScreenName}`
      );
    }

    navigation.dispatch(CommonActions.reset(params));
  }

  setOptions(
    navigation: NavigationProp<ReactNavigation.RootParamList>,
    params: NavigationProp<ReactNavigation.RootParamList>
  ): void {
    navigation.setOptions(params);
  }

  goBack(navigation: NavigationProp<ReactNavigation.RootParamList>) {
    navigation.goBack();
  }
}

export const createSmartNavigatorProvider = <
  Params extends Partial<Record<keyof Config, unknown>>,
  Config extends Record<
    string,
    {
      upperScreenName: string;
    }
  >
>(
  navigator: SmartNavigator<Params, Config>
): {
  SmartNavigatorProvider: FunctionComponent<{ children: any }>;
  useSmartNavigation: () => ReturnType<typeof useNavigation> & {
    reset: (params: NavigationState) => void;
    setOptions: (params: any) => void;
    goBack: () => void;
    navigateSmart: <ScreenName extends keyof Config>(
      screenName: ScreenName,
      params: Params[ScreenName] extends void ? undefined : Params[ScreenName]
    ) => void;
    pushSmart: <ScreenName extends keyof Config>(
      screenName: ScreenName,
      params: Params[ScreenName] extends void ? undefined : Params[ScreenName]
    ) => void;
    replaceSmart: <ScreenName extends keyof Config>(
      screenName: ScreenName,
      params: Params[ScreenName] extends void ? undefined : Params[ScreenName]
    ) => void;
  };
} => {
  const context = createContext<SmartNavigator<Params, Config> | undefined>(
    undefined
  );

  return {
    // eslint-disable-next-line react/display-name
    SmartNavigatorProvider: ({ children }) => {
      return <context.Provider value={navigator}>{children}</context.Provider>;
    },
    useSmartNavigation: () => {
      const navigator = useContext(context);
      if (!navigator)
        throw new Error("You probably forgot to use SmartNavigationProvider");

      const nativeNavigation = useNavigation();
      const nativeRoute = useRoute();
      return {
        ...nativeNavigation,
        navigateSmart: <ScreenName extends keyof Config>(
          screenName: ScreenName,
          params: Params[ScreenName] extends void
            ? undefined
            : Params[ScreenName]
        ) => {
          navigator.navigateSmart(
            nativeRoute,
            nativeNavigation,
            screenName,
            params
          );
        },
        pushSmart: <ScreenName extends keyof Config>(
          screenName: ScreenName,
          params: Params[ScreenName] extends void
            ? undefined
            : Params[ScreenName]
        ) => {
          navigator.pushSmart(
            nativeRoute,
            nativeNavigation,
            screenName,
            params
          );
        },
        replaceSmart: <ScreenName extends keyof Config>(
          screenName: ScreenName,
          params: Params[ScreenName] extends void
            ? undefined
            : Params[ScreenName]
        ) => {
          navigator.replaceSmart(
            nativeRoute,
            nativeNavigation,
            screenName,
            params
          );
        },
        reset: (params: NavigationState) => {
          navigator.reset(nativeRoute, nativeNavigation, params);
        },
        setOptions: (params: any) => {
          navigator.setOptions(nativeNavigation, params);
        },
        goBack: () => {
          navigator.goBack(nativeNavigation);
        },
      };
    },
  };
};
