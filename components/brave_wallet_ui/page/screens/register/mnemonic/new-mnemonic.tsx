import * as React from "react";
import { FunctionComponent, useState, useEffect } from "react";
import { View, Text } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { PageWithScrollView } from "../../../components/page";
import { CheckIcon } from "../../../components/icon";
import { useStyle } from "../../../styles";
import { WordChip } from "../../../components/mnemonic";
import { Button } from "../../../components/button";
import Clipboard from "@react-native-clipboard/clipboard";
import { TextInput } from "../../../components/input";
import { Controller, useForm } from "react-hook-form";
import { useSmartNavigation } from "../../../navigation";
import { useSimpleTimer } from "../../../hooks";
import { PageSelectors } from "../../../../page/selectors";
import { WalletPageActions } from "../../../../page/actions";
import { useDispatch } from "react-redux";
import { useSafePageSelector } from '../../../../common/hooks/use-safe-selector'
import { Mnemonic } from "../../../common/mnemonic";

interface FormData {
  name: string;
  password: string;
  confirmPassword: string;
}

export const NewMnemonicScreen: FunctionComponent = () => {

  const style = useStyle();

  const smartNavigation = useSmartNavigation();

  
  const mnemonic = useSafePageSelector(PageSelectors.mnemonic)

  useEffect(() => {
    if(!mnemonic) {
      Mnemonic.generateSeed().then(mnemonicStr => {
        dispatch(WalletPageActions.walletCreated({ mnemonic: mnemonicStr }))
      });
    }
  }, [mnemonic])
  const {
    control,
    handleSubmit,
    setFocus,
    getValues,
    formState: { errors },
  } = useForm<FormData>();

  const words = React.useMemo(() => {
    return (mnemonic || '').split(' ')
  }, [mnemonic])

  const dispatch = useDispatch();
  
  const submit = handleSubmit(() => {
    // newMnemonicConfig.setName(getValues("name"));
    // newMnemonicConfig.setPassword(getValues("password"));
    if(mnemonic) {
      dispatch(WalletPageActions.createWallet({ password: getValues("password") }))
      smartNavigation.navigateSmart("Register.VerifyMnemonic", {
        newMnemonicConfig: {
          password: getValues("password"),
          mnemonic
        },
      });
    }
  });

  return (
    <PageWithScrollView
      backgroundMode="tertiary"
      contentContainerStyle={style.get("flex-grow-1")}
      style={style.flatten(["padding-x-page"])}
    >
      {/* Mock for flexible margin top */}
      <View style={style.flatten(["max-height-32", "flex-1"])} />
      <Text
        style={style.flatten([
          "h5",
          "color-text-middle",
          "margin-bottom-4",
          "text-center",
        ])}
      >
        Backup your mnemonic securely
      </Text>
      <WordsCard words={words} />
      <React.Fragment>
        <Controller
          control={control}
          rules={{
            required: "Password is required",
            validate: (value: string) => {
              if (value.length < 8) {
                return "Password must be longer than 8 characters";
              }
              return true;
            },
          }}
          render={({ field: { onChange, onBlur, value, ref } }) => {
            return (
              <TextInput
                label="Password"
                returnKeyType="next"
                secureTextEntry={true}
                onSubmitEditing={() => {
                  setFocus("confirmPassword");
                }}
                error={errors.password?.message}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                ref={ref}
              />
            );
          }}
          name="password"
          defaultValue=""
        />
        <Controller
          control={control}
          rules={{
            required: "Confirm password is required",
            validate: (value: string) => {
              if (value.length < 8) {
                return "Password must be longer than 8 characters";
              }

              if (getValues("password") !== value) {
                return "Password doesn't match";
              }
              return true;
            },
          }}
          render={({ field: { onChange, onBlur, value, ref } }) => {
            return (
              <TextInput
                label="Confirm password"
                returnKeyType="done"
                secureTextEntry={true}
                onSubmitEditing={() => {
                  submit();
                }}
                error={errors.confirmPassword?.message}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                ref={ref}
              />
            );
          }}
          name="confirmPassword"
          defaultValue=""
        />
      </React.Fragment>
      <View style={style.flatten(["flex-1"])} />
      <Button text="Next" size="large" onPress={submit} />
      {/* Mock element for bottom padding */}
      <View style={style.flatten(["height-page-pad"])} />
    </PageWithScrollView>
  );
};

const WordsCard: FunctionComponent<{
  words: string[];
}> = ({ words }) => {
  const style = useStyle();
  const { isTimedOut, setTimer } = useSimpleTimer();

  /*
    On IOS, user can peek the words by right side gesture from the verifying mnemonic screen.
    To prevent this, hide the words if the screen lost the focus.
   */
  const [hideWord, setHideWord] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      setHideWord(false);
    } else {
      const timeout = setTimeout(() => {
        setHideWord(true);
      }, 500);
      return () => clearTimeout(timeout);
    }
    return () => {
      // noop
    };
  }, [isFocused]);

  return (
    <View
      style={style.flatten([
        "margin-top-14",
        "margin-bottom-16",
        "padding-24",
        "padding-x-28",
        "padding-bottom-12",
        "background-color-white",
        "dark:background-color-platinum-700",
        "border-radius-8",
        "flex-row",
        "flex-wrap",
      ])}
    >
      {words.map((word, i) => {
        return (
          <WordChip
            key={i.toString()}
            index={i + 1}
            word={word}
            hideWord={hideWord}
          />
        );
      })}
      <View style={style.flatten(["width-full"])}>
        <Button
          textStyle={style.flatten(
            ["text-button1", "color-blue-400", "dark:color-platinum-50"],
            [isTimedOut && "color-green-400"]
          )}
          mode="text"
          {...(isTimedOut && {
            rightIcon: (
              <View style={style.flatten(["margin-left-8"])}>
                <CheckIcon />
              </View>
            ),
          })}
          text="Copy to clipboard"
          onPress={() => {
            Clipboard.setString(words.join(" "));
            setTimer(3000);
          }}
        />
      </View>
    </View>
  );
};
