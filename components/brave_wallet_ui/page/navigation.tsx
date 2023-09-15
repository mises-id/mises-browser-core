import * as React from "react";
import { FunctionComponent, useEffect, useMemo, useRef } from "react";
import {
  FocusedScreenProvider,
  useFocusedScreen,
} from "./providers/focused-screen";
import { PageScrollPositionProvider } from "./providers/page-scroll-position";
import { useStyle } from "./styles";
import {
  NavigationContainer,
  NavigationContainerRef,
  DefaultTheme,
  DarkTheme,
  useNavigation,
  ParamListBase,
  DrawerActions,
  StackActions,
} from "@react-navigation/native";
import {
  createStackNavigator,
  StackNavigationProp,
  TransitionPresets,
} from "@react-navigation/stack";
import {
  createDrawerNavigator,
  DrawerContent,
  useDrawerStatus,
} from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createSmartNavigatorProvider, SmartNavigator } from "./hooks/index";
import { UnlockScreen } from "./screens/unlock";
import Svg, { Path, Rect } from "react-native-svg";
import { StyleSheet, Text, View } from "react-native";
import { BorderlessButton } from "react-native-gesture-handler";
import { BlurredBottomTabBar } from "./components/bottom-tabbar";
import {
  HeaderAtSecondaryScreenOptionsPreset,
  HeaderLeftButton,
  HeaderOnGradientScreenOptionsPreset,
  HeaderOnSecondaryScreenOptionsPreset,
  HeaderOnTertiaryScreenOptionsPreset,
  HeaderRightButton,
  TransparentHeaderOptionsPreset,
} from "./components/header";
// import { ScanIcon } from "./components/icon";
import { HomeScreen } from "./screens/home";

import { SettingScreen } from "./screens/setting";
import { ViewPrivateDataScreen } from "./screens/setting/screens/view-private-data";
import {
  AddAddressBookScreen,
  AddressBookScreen,
} from "./screens/setting/screens/address-book";
import { SettingSelectAccountScreen } from "./screens/setting/screens/select-account";
import { RegisterIntroScreen } from "./screens/register";
import {
  NewMnemonicScreen,
  RecoverMnemonicScreen,
  VerifyMnemonicScreen,
  AddAccountScreen,
} from "./screens/register/mnemonic";
import { RegisterEndScreen } from "./screens/register/end";
import { RecoverPrivateScreen } from "./screens/register/mnemonic/recover-private";
import { SendScreen } from "./screens/send";
import { TokensScreen } from "./screens/tokens";
import { ManageWalletConnectScreen } from "./screens/manage-wallet-connect";
import {
  TxFailedResultScreen,
  TxPendingResultScreen,
  TxSuccessResultScreen,
} from "./screens/tx-result";
import { HeaderAddIcon } from "./components/header/icon";
import {
  SettingAddTokenScreen,
  SettingManageTokensScreen,
} from "./screens/setting/screens/token";
import { RenameAccountScreen } from "./screens/register/mnemonic/rename-account";
// import { useDispatch } from "react-redux";
import { useSafePageSelector, useSafeWalletSelector } from "../common/hooks/use-safe-selector";
import { WalletSelectors } from "../common/selectors";
import { PageSelectors } from "./selectors";
import ConfirmSendScreen from "./screens/send/confirmSend";
import { useGetSelectedChainQuery, useGetVisibleNetworksQuery, useSetNetworkMutation } from "../common/slices/api.slice";
import { useDispatch } from "react-redux";
import { WalletActions } from "../common/actions";
import { SelectorModal } from "./components/input";

const { SmartNavigatorProvider, useSmartNavigation } =
  createSmartNavigatorProvider(
    new SmartNavigator({
      "Register.Intro": {
        upperScreenName: "Register",
      },
      "Register.NewMnemonic": {
        upperScreenName: "Register",
      },
      "Register.VerifyMnemonic": {
        upperScreenName: "Register",
      },
      "Register.RecoverMnemonic": {
        upperScreenName: "Register",
      },
      "Register.RecoverPrivateKey": {
        upperScreenName: "Register",
      },
      "Register.NewLedger": {
        upperScreenName: "Register",
      },
      "Register.TorusSignIn": {
        upperScreenName: "Register",
      },
      "Register.End": {
        upperScreenName: "Register",
      },
      Home: {
        upperScreenName: "Main",
      },
      Send: {
        upperScreenName: "Others",
      },
      Tokens: {
        upperScreenName: "Others",
      },
      Camera: {
        upperScreenName: "Others",
      },
      ManageWalletConnect: {
        upperScreenName: "Others",
      },
      "Staking.Dashboard": {
        upperScreenName: "Others",
      },
      "Transaction.Dashboard": {
        upperScreenName: "Others",
      },
      "Validator.Details": {
        upperScreenName: "Others",
      },
      "Validator.List": {
        upperScreenName: "Others",
      },
      Delegate: {
        upperScreenName: "Others",
      },
      Undelegate: {
        upperScreenName: "Others",
      },
      Redelegate: {
        upperScreenName: "Others",
      },
      Governance: {
        upperScreenName: "Others",
      },
      "Governance Details": {
        upperScreenName: "Others",
      },
      Setting: {
        upperScreenName: "Settings",
      },
      SettingSelectAccount: {
        upperScreenName: "Settings",
      },
      "Register.AddAccount": {
        upperScreenName: "Register",
      },
      "Setting.ViewPrivateData": {
        upperScreenName: "Settings",
      },
      "Setting.RenameAccount": {
        upperScreenName: "Others",
      },
      "Setting.Version": {
        upperScreenName: "Settings",
      },
      "Setting.ChainList": {
        upperScreenName: "ChainList",
      },
      "Setting.AddToken": {
        upperScreenName: "Others",
      },
      "Setting.ManageTokens": {
        upperScreenName: "Others",
      },
      AddressBook: {
        upperScreenName: "AddressBooks",
      },
      AddAddressBook: {
        upperScreenName: "AddressBooks",
      },
      Result: {
        upperScreenName: "Others",
      },
      TxPendingResult: {
        upperScreenName: "Others",
      },
      TxSuccessResult: {
        upperScreenName: "Others",
      },
      TxFailedResult: {
        upperScreenName: "Others",
      },
      "Web.Intro": {
        upperScreenName: "Web",
      },
      "Web.Osmosis": {
        upperScreenName: "Web",
      },
      "Web.OsmosisFrontier": {
        upperScreenName: "Web",
      },
      "Web.Stargaze": {
        upperScreenName: "Web",
      },
      "Web.Umee": {
        upperScreenName: "Web",
      },
      "Web.Junoswap": {
        upperScreenName: "Web",
      },
    }).withParams<{
      "Register.VerifyMnemonic": {
        newMnemonicConfig: Record<'password' | 'mnemonic', string>;
      };
      "Register.RecoverPrivateKey": {
        registerConfig: any;
      };
      "Register.NewLedger": {
        registerConfig: any;
      };
      "Register.TorusSignIn": {
        registerConfig: any;
        type: "google" | "apple";
      };
      "Register.End": {
        password?: string;
      };
      Send: {
        chainId?: string;
        currency?: string;
        recipient?: string;
      };
      "Validator.Details": {
        validatorAddress: string;
      };
      "Validator.List": {
        validatorSelector?: (validatorAddress: string) => void;
      };
      Delegate: {
        validatorAddress: string;
      };
      Undelegate: {
        validatorAddress: string;
      };
      Redelegate: {
        validatorAddress: string;
      };
      "Governance Details": {
        proposalId: string;
      };
      "Setting.ViewPrivateData": {
        privateData: string;
        privateDataType: 'mnemonic' | 'privateKey';
      };
      "Setting.RenameAccount": {
        keyRingStore: any | undefined;
      };
      AddressBook: {
        recipientConfig?: any;
        memoConfig?: any;
      };
      AddAddressBook: {
        chainId: string;
        addressBookConfig: any;
      };
      TxPendingResult: {
        chainId?: string;
        txHash: string;
      };
      TxSuccessResult: {
        chainId?: string;
        txHash: string;
      };
      TxFailedResult: {
        chainId?: string;
        txHash: string;
      };
    }>()
  );

export { useSmartNavigation };

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();


const HomeScreenHeaderLeft: FunctionComponent = () => {
  const style = useStyle();

  // const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
  const { data: selectedNetwork } = useGetSelectedChainQuery()
  const dispatch = useDispatch()
  return (
    <HeaderLeftButton
      onPress={() => {
        dispatch(WalletActions.setChainPop(true))
      }}
    >
      <View style={
        style.flatten([
          "padding-left-6",
          "padding-right-8",
          "padding-y-6",
          "border-radius-12",
          "background-color-gray-50",
          "dark:background-color-platinum-500",
          "flex-row",
          "items-center",
        ])
      }>
        <Text
          numberOfLines={1}
          style={
            StyleSheet.flatten([
              style.flatten([
                "subtitle3",
                'margin-right-4',
                'dark:color-white',
              ])])}
        >
          {selectedNetwork?.chainName}
        </Text>
        <Svg fill="none" viewBox="0 0 1024 1024" width="14" height="8"><Path d="M517.688889 796.444444c-45.511111 0-85.333333-17.066667-119.466667-51.2L73.955556 381.155556c-22.755556-22.755556-17.066667-56.888889 5.688888-79.644445 22.755556-22.755556 56.888889-17.066667 79.644445 5.688889l329.955555 364.088889c5.688889 5.688889 17.066667 11.377778 28.444445 11.377778s22.755556-5.688889 34.133333-17.066667l312.888889-364.088889c22.755556-22.755556 56.888889-28.444444 79.644445-5.688889 22.755556 22.755556 28.444444 56.888889 5.688888 79.644445L637.155556 739.555556c-28.444444 39.822222-68.266667 56.888889-119.466667 56.888888 5.688889 0 0 0 0 0z" fill="#9A9AA2"></Path></Svg>
      </View>
    </HeaderLeftButton>
  );
};

// const HomeScreenHeaderRight: FunctionComponent = () => {
//   const style = useStyle();

//   const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

//   return (
//     <React.Fragment>
//       <HeaderRightButton
//         onPress={() => {
//           navigation.navigate("Others", {
//             screen: "Camera",
//           });
//         }}
//       >
//         <ScanIcon
//           size={28}
//           color={
//             style.flatten(["color-blue-400", "dark:color-platinum-50"]).color
//           }
//         />
//       </HeaderRightButton>
//     </React.Fragment>
//   );
// };

export const MainNavigation: FunctionComponent = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        ...TransitionPresets.SlideFromRightIOS,
        headerMode: "screen",
      }}
      initialRouteName="Home"
    >
      <Stack.Screen
        options={{
          ...HeaderOnGradientScreenOptionsPreset,

          headerTitle: "",
          headerLeft: () => <HomeScreenHeaderLeft />,
          // headerRight: () => <HomeScreenHeaderRight />,
        }}
        name="Home"
        component={HomeScreen}
      />
    </Stack.Navigator>
  );
};

export const SettingStackScreen: FunctionComponent = () => {
  const style = useStyle();

  return (
    <Stack.Navigator
      screenOptions={{
        ...TransitionPresets.SlideFromRightIOS,
        headerTitleStyle: style.flatten(["h5", "color-text-high"]),
        headerMode: "screen",
      }}
    >
      <Stack.Screen
        options={{
          ...HeaderAtSecondaryScreenOptionsPreset,
          title: "Settings",
          headerTitleStyle: style.flatten(["h3", "color-text-high"]),
        }}
        name="Setting"
        component={SettingScreen}
      />
      <Stack.Screen
        name="SettingSelectAccount"
        options={{
          ...HeaderOnSecondaryScreenOptionsPreset,
          title: "Select Account",
        }}
        component={SettingSelectAccountScreen}
      />
      <Stack.Screen
        name="Setting.ViewPrivateData"
        options={{
          ...HeaderOnSecondaryScreenOptionsPreset,
        }}
        component={ViewPrivateDataScreen}
      />
    </Stack.Navigator>
  );
};

export const AddressBookStackScreen: FunctionComponent = () => {
  const style = useStyle();

  return (
    <Stack.Navigator
      screenOptions={{
        ...TransitionPresets.SlideFromRightIOS,
        headerTitleStyle: style.flatten(["h5", "color-text-high"]),
        headerMode: "screen",
      }}
    >
      <Stack.Screen
        options={{
          ...HeaderOnSecondaryScreenOptionsPreset,
          title: "Address Book",
        }}
        name="AddressBook"
        component={AddressBookScreen}
      />
      <Stack.Screen
        options={{
          ...HeaderOnTertiaryScreenOptionsPreset,
          title: "New Address Book",
        }}
        name="AddAddressBook"
        component={AddAddressBookScreen}
      />
    </Stack.Navigator>
  );
};

export const MainTabNavigation: FunctionComponent = () => {
  const style = useStyle();

  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

  const focusedScreen = useFocusedScreen();
  const drawerStatus = useDrawerStatus();
  const isDrawerOpen = useMemo(() => drawerStatus === "open", [drawerStatus]);

  useEffect(() => {
    // When the focused screen is not "Home" screen and the drawer is open,
    // try to close the drawer forcely.
    if (focusedScreen.name !== "Home" && isDrawerOpen) {
      navigation.dispatch(DrawerActions.toggleDrawer());
    }
  }, [focusedScreen.name, isDrawerOpen, navigation]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          const size = 24;

          switch (route.name) {
            case "Main":
              return (
                <Svg width={size} height={size} fill="none" viewBox="0 0 24 24">
                  <Rect
                    width="8"
                    height="8"
                    x="3"
                    y="3"
                    fill={color}
                    rx="1.5"
                  />
                  <Rect
                    width="8"
                    height="8"
                    x="3"
                    y="13"
                    fill={color}
                    rx="1.5"
                  />
                  <Rect
                    width="8"
                    height="8"
                    x="13"
                    y="3"
                    fill={color}
                    rx="1.5"
                  />
                  <Rect
                    width="8"
                    height="8"
                    x="13"
                    y="13"
                    fill={color}
                    rx="1.5"
                  />
                </Svg>
              );
            case "Settings":
              return (
                <Svg width={size} height={size} fill="none" viewBox="0 0 24 24">
                  <Path
                    fill={color}
                    d="M12 2c-.528 0-1.046.045-1.55.131l-.311 1.302c-.484 2.023-2.544 3.225-4.52 2.635l-1.084-.325A10.124 10.124 0 003 8.598l.805.781a3.663 3.663 0 010 5.242L3 15.402c.36 1.043.882 2.006 1.535 2.855l1.084-.325c1.976-.59 4.036.612 4.52 2.635l.31 1.302a9.187 9.187 0 003.101 0l.311-1.302c.484-2.023 2.544-3.225 4.52-2.635l1.084.325A10.124 10.124 0 0021 15.402l-.805-.781a3.663 3.663 0 010-5.242L21 8.598a10.113 10.113 0 00-1.535-2.855l-1.084.325c-1.976.59-4.036-.612-4.52-2.635l-.31-1.302A9.184 9.184 0 0012 2zm0 7.273c1.491 0 2.7 1.22 2.7 2.727 0 1.506-1.209 2.727-2.7 2.727S9.3 13.507 9.3 12c0-1.506 1.209-2.727 2.7-2.727z"
                  />
                </Svg>
              );

            default:
              return <Svg width={size} height={size} fill="none" viewBox="0 0 24 24">
                <Path
                  fill={color}
                  d="M12 2c-.528 0-1.046.045-1.55.131l-.311 1.302c-.484 2.023-2.544 3.225-4.52 2.635l-1.084-.325A10.124 10.124 0 003 8.598l.805.781a3.663 3.663 0 010 5.242L3 15.402c.36 1.043.882 2.006 1.535 2.855l1.084-.325c1.976-.59 4.036.612 4.52 2.635l.31 1.302a9.187 9.187 0 003.101 0l.311-1.302c.484-2.023 2.544-3.225 4.52-2.635l1.084.325A10.124 10.124 0 0021 15.402l-.805-.781a3.663 3.663 0 010-5.242L21 8.598a10.113 10.113 0 00-1.535-2.855l-1.084.325c-1.976.59-4.036-.612-4.52-2.635l-.31-1.302A9.184 9.184 0 0012 2zm0 7.273c1.491 0 2.7 1.22 2.7 2.727 0 1.506-1.209 2.727-2.7 2.727S9.3 13.507 9.3 12c0-1.506 1.209-2.727 2.7-2.727z"
                />
              </Svg>;
          }
        },
        tabBarButton: (props) => (
          <View
            style={{
              display: "flex",
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-ignore */}
            <BorderlessButton
              {...props}
              activeOpacity={1}
              rippleColor={style.get("color-rect-button-default-ripple").color}
              style={{
                height: "100%",
                aspectRatio: 1.9,
                maxWidth: "100%",
              }}
            />
          </View>
        ),
      })}
      tabBarOptions={{
        activeTintColor: style.flatten([
          "color-blue-400",
          "dark:color-platinum-50",
        ]).color,
        inactiveTintColor: style.flatten([
          "color-gray-200",
          "dark:color-platinum-300",
        ]).color,
        style: {
          borderTopWidth: 0.5,
          borderTopColor: style.get("blurred-tabbar-top-border"),
          backgroundColor: style.get("color-blurred-tabbar-background").color,
          shadowColor: style.get("color-transparent").color,
          elevation: 0,
          paddingLeft: 30,
          paddingRight: 30,
        },
        showLabel: false,
      }}
      tabBar={(props: any) => (
        <BlurredBottomTabBar {...props} enabledScreens={["Home"]} />
      )}
    >
      <Tab.Screen name="Main" component={MainNavigation} />
      {/* <Tab.Screen name="Web" component={WebNavigation} /> */}
      <Tab.Screen
        name="Settings"
        component={SettingStackScreen}
        options={{
          unmountOnBlur: true,
        }}
      />
    </Tab.Navigator>
  );
};

export const MainTabNavigationWithDrawer: FunctionComponent = () => {
  const style = useStyle();

  const focused = useFocusedScreen();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        // If the focused screen is not "Home" screen,
        // disable the gesture to open drawer.
        swipeEnabled: focused.name === "Home",
        headerShown: false,
        drawerType: "slide",
        overlayColor: style.flatten([
          "color-gray-700@50%",
          "dark:color-gray-700@75%",
        ]).color,
        drawerStyle: { width: "75%" },
      }}
    >
      <Drawer.Screen name="MainTab" component={MainTabNavigation} />
    </Drawer.Navigator>
  );
};

export const RegisterNavigation: FunctionComponent = () => {
  const style = useStyle();

  return (
    <Stack.Navigator
      screenOptions={{
        ...TransitionPresets.SlideFromRightIOS,
        headerTitleStyle: style.flatten(["h5", "color-text-high"]),
        headerMode: "screen",
      }}
      initialRouteName="Register.Intro"
    >
      <Stack.Screen
        options={{
          ...TransparentHeaderOptionsPreset,
          title: "",
          headerShown: false,
        }}
        name="Register.Intro"
        component={RegisterIntroScreen}
      />
      <Stack.Screen
        options={{
          ...TransparentHeaderOptionsPreset,
          title: "Create New Account",
        }}
        name="Register.AddAccount"
        component={AddAccountScreen}
      />
      <Stack.Screen
        options={{
          ...HeaderOnTertiaryScreenOptionsPreset,
          title: "Create New Mnemonic",
        }}
        name="Register.NewMnemonic"
        component={NewMnemonicScreen}
      />
      <Stack.Screen
        options={{
          ...HeaderOnTertiaryScreenOptionsPreset,
          title: "Verify Mnemonic",
        }}
        name="Register.VerifyMnemonic"
        component={VerifyMnemonicScreen}
      />
      <Stack.Screen
        options={{
          ...HeaderOnTertiaryScreenOptionsPreset,
          title: "Import Existing Wallet",
        }}
        name="Register.RecoverMnemonic"
        component={RecoverMnemonicScreen}
      />
      <Stack.Screen
        options={{
          ...HeaderOnTertiaryScreenOptionsPreset,
          title: "Import PrivateKey Wallet",
        }}
        name="Register.RecoverPrivateKey"
        component={RecoverPrivateScreen}
      />
      <Stack.Screen
        options={{
          ...TransparentHeaderOptionsPreset,
          headerShown: false,
        }}
        name="Register.End"
        component={RegisterEndScreen}
      />
    </Stack.Navigator>
  );
};
export const OtherNavigation: FunctionComponent = () => {
  const style = useStyle();

  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

  return (
    <Stack.Navigator
      screenOptions={{
        ...TransitionPresets.SlideFromRightIOS,
        headerTitleStyle: style.flatten(["h5", "color-text-high"]),
        headerMode: "screen",
      }}
    >
      <Stack.Screen
        options={{
          ...HeaderOnTertiaryScreenOptionsPreset,
          title: "Send",
        }}
        name="Send"
        component={SendScreen}
      />
      <Stack.Screen
        options={{
          ...HeaderOnTertiaryScreenOptionsPreset,
          title: "Confirm",
        }}
        name="ConfirmSend"
        component={ConfirmSendScreen}
      />
      <Stack.Screen
        options={{
          ...HeaderOnGradientScreenOptionsPreset,
          title: "Tokens",
        }}
        name="Tokens"
        component={TokensScreen}
      />
      <Stack.Screen
        options={{
          ...HeaderOnSecondaryScreenOptionsPreset,
          title: "WalletConnect",
        }}
        name="ManageWalletConnect"
        component={ManageWalletConnectScreen}
      />
      <Stack.Screen
        options={{
          gestureEnabled: false,
          headerShown: false,
        }}
        name="TxPendingResult"
        component={TxPendingResultScreen}
      />
      <Stack.Screen
        options={{
          gestureEnabled: false,
          headerShown: false,
        }}
        name="TxSuccessResult"
        component={TxSuccessResultScreen}
      />
      <Stack.Screen
        options={{
          gestureEnabled: false,
          headerShown: false,
        }}
        name="TxFailedResult"
        component={TxFailedResultScreen}
      />
      <Stack.Screen
        options={{
          ...HeaderOnTertiaryScreenOptionsPreset,
          title: "Add Token",
        }}
        name="Setting.AddToken"
        component={SettingAddTokenScreen}
      />
      <Stack.Screen
        options={{
          ...HeaderOnSecondaryScreenOptionsPreset,
          title: "Manage Tokens",
          headerRight: () => (
            <HeaderRightButton
              onPress={() => {
                navigation.navigate("Setting.AddToken");
              }}
            >
              <HeaderAddIcon />
            </HeaderRightButton>
          ),
        }}
        name="Setting.ManageTokens"
        component={SettingManageTokensScreen}
      />

      <Stack.Screen
        name="Setting.RenameAccount"
        options={{
          ...HeaderAtSecondaryScreenOptionsPreset,
          title: "Change account name",
        }}
        component={RenameAccountScreen}
      />
    </Stack.Navigator>
  );
};

export const AppNavigation: FunctionComponent = () => {
  const navigationRef = useRef<NavigationContainerRef<any> | null>(null);
  const routeNameRef = useRef<string | null>(null);

  const style = useStyle();

  const isWalletCreated = useSafeWalletSelector(WalletSelectors.isWalletCreated)
  const isWalletLocked = useSafeWalletSelector(WalletSelectors.isWalletLocked)
  const hasInitialized = useSafeWalletSelector(WalletSelectors.hasInitialized)

  // page selectors (safe)
  const setupStillInProgress = useSafePageSelector(PageSelectors.setupStillInProgress)
  // computed
  const walletNotYetCreated = (!isWalletCreated || setupStillInProgress) // false || false 

  const [setNetwork] = useSetNetworkMutation()

  const { data: networks = [] } = useGetVisibleNetworksQuery()

  const showChainPop = useSafeWalletSelector(WalletSelectors.showChainPop)

  const dispatch = useDispatch()
  const { data: selectedNetwork } = useGetSelectedChainQuery()
  const [selectedNetworkKey, setselectedNetworkKey] = React.useState<string | undefined>(selectedNetwork?.chainId)

  const selectNetworks = useMemo(() => {
    return networks.map(val => ({
      label: val.chainName,
      key: val.chainId
    }))

  }, [networks])

  useEffect(() => {
    console.log(walletNotYetCreated, "walletNotYetCreated", !isWalletLocked && isWalletCreated, "!isWalletLocked && isWalletCreated", isWalletLocked && isWalletCreated, "isWalletLocked && isWalletCreated")
    if(!navigationRef.current) {
      return;
    }
    if (walletNotYetCreated) {
      console.log('walletNotYetCreated')
      navigationRef.current?.dispatch(StackActions.replace("Register"))
      return
    }
    if (!isWalletLocked && isWalletCreated) {
      console.log('MainTabDrawer')
      navigationRef.current?.dispatch(StackActions.replace("MainTabDrawer"));
    }

    if (isWalletLocked && isWalletCreated) {
      console.log('Unlock')
      navigationRef.current?.dispatch(StackActions.replace("Unlock"));
    }
  }, [walletNotYetCreated, isWalletLocked, isWalletCreated, navigationRef.current])
  
  if(!hasInitialized) {
    return <></>
  }

  return (
    <PageScrollPositionProvider>
      <FocusedScreenProvider>
        <SmartNavigatorProvider>
          <NavigationContainer
            ref={navigationRef}
            theme={style.theme === "dark" ? DarkTheme : DefaultTheme}
            onReady={() => {
              const routerName = navigationRef.current?.getCurrentRoute();
              if (routerName) {
                routeNameRef.current = routerName.name;
                // analyticsStore.logPageView(routerName.name);
              }
            }}
            onStateChange={() => {
              const routerName = navigationRef.current?.getCurrentRoute();
              if (routerName) {
                const previousRouteName = routeNameRef.current;
                const currentRouteName = routerName.name;

                if (previousRouteName !== currentRouteName) {
                  // analyticsStore.logPageView(currentRouteName);
                }

                routeNameRef.current = currentRouteName;
              }
            }}
          >
            <Stack.Navigator
              initialRouteName={'Unlock'}
              screenOptions={{
                headerShown: false,
                headerMode: "screen",
                ...TransitionPresets.SlideFromRightIOS,
                animationEnabled: false
              }}
            >
              <Stack.Screen name="Unlock" component={UnlockScreen} />
              <Stack.Screen
                name="MainTabDrawer"
                component={MainTabNavigationWithDrawer}
              />
              <Stack.Screen
                name="AddressBooks"
                component={AddressBookStackScreen}
              />
              <Stack.Screen name="Register" component={RegisterNavigation} />
              <Stack.Screen name="Others" component={OtherNavigation} />
            </Stack.Navigator>
          </NavigationContainer>
          {/* <ModalsRenderer /> */}
        </SmartNavigatorProvider>
      </FocusedScreenProvider>
      <SelectorModal
        isOpen={showChainPop}
        close={() => {
          dispatch(WalletActions.setChainPop(false))
        }}
        items={selectNetworks}
        selectedKey={selectedNetworkKey}
        maxItemsToShow={4}
        setSelectedKey={(key) => {
          const network = networks.find(val => val.chainId === key);
          if (network) {
            setNetwork(network);
          }
          dispatch(WalletActions.setChainPop(false))
          setselectedNetworkKey(key)
        }}
        modalPersistent={false}
      />
    </PageScrollPositionProvider>
  );
};
