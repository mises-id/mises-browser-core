import * as React from "react";
import { FunctionComponent, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { useStyle } from "../../styles";
import { TextInput } from "../../components/input";
import { Button } from "../../components/button";
import { useDispatch } from "react-redux";
// import { useStore } from "../../stores";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SimpleGradient } from "../../components/svg";
import { WalletActions } from "../../../common/actions";
import { StackActions, useNavigation } from "@react-navigation/native";
import { WalletSelectors } from '../../../common/selectors'
import { useSafeWalletSelector } from '../../../common/hooks/use-safe-selector'
/**
 * UnlockScreen is expected to be opened when the keyring store's state is "not loaded (yet)" or "locked" at launch.
 * And, this screen has continuity with the splash screen
 * @constructor
 */
export const UnlockScreen: FunctionComponent = () => {
  // const { keychainStore } = useStore();

  const style = useStyle();

  const navigation = useNavigation();


  // const [isSplashEnd, setIsSplashEnd] = useState(true);

  // const animatedContinuityEffectOpacity = useSharedValue(0);

  // const navigateToHomeOnce = useRef(false);

  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // const [isBiometricLoading, setIsBiometricLoading] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const hasIncorrectPassword = useSafeWalletSelector(WalletSelectors.hasIncorrectPassword)
  const dispatch = useDispatch();
  // const tryBiometric = useCallback(async () => {
  //   try {
  //     setIsBiometricLoading(true);
  //     // Because javascript is synchronous language, the loadnig state change would not delivered to the UI thread
  //     // So to make sure that the loading state changes, just wait very short time.
  //     await delay(10);
  //     await keychainStore.tryUnlockWithBiometry();
  //   } catch (e) {
  //     console.log(e);
  //     setIsBiometricLoading(false);
  //   }
  // }, [keychainStore]);

  const navigateToHomeOnce = React.useRef(false);
  const navigateToHome = React.useCallback(async () => {
    if (!navigateToHomeOnce.current && !hasIncorrectPassword) {
      // Wait the account of selected chain is loaded.
      navigation.dispatch(StackActions.replace("MainTabDrawer"));
    }
    navigateToHomeOnce.current = true;
  }, [hasIncorrectPassword, navigation]);

  const tryUnlock = async () => {
    try {
      setIsLoading(true);
      // Decryption needs slightly huge computation.
      // Because javascript is synchronous language, the loadnig state change would not delivered to the UI thread
      // before the actually decryption is complete.
      // So to make sure that the loading state changes, just wait very short time.
      dispatch(WalletActions.unlockWallet({ password }))
      // await keyRingStore.unlock(password);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
      setIsFailed(true);
    }
  };

  const isWalletLocked = useSafeWalletSelector(WalletSelectors.isWalletLocked)
  console.log(hasIncorrectPassword, 'hasIncorrectPassword', isWalletLocked, 'isWalletLocked')
  React.useEffect(() => {
    if (!isWalletLocked) {
      navigateToHome();
    }
  }, [isWalletLocked, navigateToHome]);
  // Invalid password 
  React.useEffect(() => {
    if (hasIncorrectPassword) {
      setIsLoading(false);
      setIsFailed(true);
      dispatch(WalletActions.hasIncorrectPassword(false))
    }
  }, [hasIncorrectPassword]);

  return (
    <React.Fragment>
      <UnlockScreenGradientBackground />
      <View style={style.flatten(["flex-1"])}>
        <KeyboardAwareScrollView
          contentContainerStyle={style.flatten(["flex-grow-1"])}
          indicatorStyle={style.theme === "dark" ? "white" : "black"}
        >
          <View style={style.get("flex-5")} />
          <Image
            style={StyleSheet.flatten([
              style.flatten(["width-full", "flex-2"]),
            ])}
            fadeDuration={0}
            resizeMode="contain"
            source={
              style.theme === "dark"
                ? require("../../assets/logo/splash-image-dark-mode.png")
                : require("../../assets/logo/splash-image.png")
            }
          />
          <View style={style.get("flex-3")} />
          <View style={style.flatten(["padding-x-page"])}>
            <TextInput
              containerStyle={style.flatten(["padding-bottom-40"])}
              label="Password"
              returnKeyType="done"
              secureTextEntry={true}
              value={password}
              error={isFailed ? "Invalid password" : undefined}
              onChangeText={setPassword}
              onSubmitEditing={tryUnlock}
            />
            <Button
              text="Unlock"
              size="large"
              loading={isLoading}
              onPress={tryUnlock}
            />
            {/* {keychainStore.isBiometryOn ? (
              <Button
                containerStyle={style.flatten(["margin-top-40"])}
                text="Use Biometric Authentication"
                mode="text"
                loading={isBiometricLoading}
                onPress={tryBiometric}
              />
            ) : null} */}
          </View>
          <View style={style.get("flex-7")} />
        </KeyboardAwareScrollView>
      </View>
    </React.Fragment>
  );
};
const UnlockScreenGradientBackground: FunctionComponent = () => {
  const style = useStyle();

  return (
    <View style={style.flatten(["absolute-fill"])}>
      <SimpleGradient
        degree={style.get("unlock-screen-gradient-background").degree}
        stops={style.get("unlock-screen-gradient-background").stops}
        fallbackAndroidImage={
          style.get("unlock-screen-gradient-background").fallbackAndroidImage
        }
      />
    </View>
  );
};
