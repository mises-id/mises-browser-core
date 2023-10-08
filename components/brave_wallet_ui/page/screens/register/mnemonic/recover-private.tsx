import * as React from "react";
import { FunctionComponent, useState } from "react";
import { PageWithScrollView } from "../../../components/page";
import { useStyle } from "../../../styles";
import { useSmartNavigation } from "../../../navigation";
import { Controller, useForm } from "react-hook-form";
import { TextInput } from "../../../components/input";
import { StyleSheet, View } from "react-native";
import { Button } from "../../../components/button";
import Clipboard from "@react-native-clipboard/clipboard";
// import { useBIP44Option } from "../bip44";
import { Buffer } from "buffer/";
import { useDispatch } from "react-redux";
import { WalletPageActions } from "../../../actions";
import { BraveWallet } from '../../../../constants/types'

interface FormData {
  privateKey: string;
  name: string;
}

export const RecoverPrivateScreen: FunctionComponent = () => {

  const style = useStyle();

  // const { analyticsStore } = useStore();

  const smartNavigation = useSmartNavigation();

  // const bip44Option = useBIP44Option();

  const {
    control,
    handleSubmit,
    setFocus,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormData>();

  const [isCreating, setIsCreating] = useState(false);
  const dispatch = useDispatch();
  const importAccount = React.useCallback((accountName: string, privateKey: string, coin: BraveWallet.CoinType) => {
    dispatch(WalletPageActions.importAccount({ accountName, privateKey, coin }))
  }, [])

  const submit = handleSubmit(async () => {
    setIsCreating(true);

    const privateKey = getValues("privateKey");

    importAccount(getValues("name"), privateKey.trim(), BraveWallet.CoinType.ETH)
    smartNavigation.reset({
      index: 0,
      routes: [
        {
          name: "MainTabDrawer",
          key: "MainTabDrawer",
        },
      ],
      key: "MainTabDrawer",
      type: "reset",
      stale: false,
      routeNames: ["MainTabDrawer"],
    });
  });

  return (
    <PageWithScrollView
      backgroundMode="tertiary"
      contentContainerStyle={style.get("flex-grow-1")}
      style={style.flatten(["padding-x-page"])}
    >
      <Controller
        control={control}
        rules={{
          required: "PrivateKey is required",
          validate: (value: string) => {
            value = value.replace("0x", "");
            if (value.length !== 64) {
              return "Invalid length of private key";
            }

            try {
              if (
                Buffer.from(value, "hex").toString("hex").toLowerCase() !==
                value.toLowerCase()
              ) {
                return "Invalid private key";
              }
            } catch {
              return "Invalid private key";
            }
            return true;
            // }
          },
        }}
        render={({ field: { onChange, onBlur, value, ref } }) => {
          return (
            <TextInput
              label="Wallet privateKey"
              returnKeyType="next"
              multiline={true}
              numberOfLines={4}
              inputContainerStyle={style.flatten([
                "padding-x-20",
                "padding-y-16",
              ])}
              bottomInInputContainer={
                <View style={style.flatten(["flex-row"])}>
                  <View style={style.flatten(["flex-1"])} />
                  <Button
                    containerStyle={style.flatten(["height-36"])}
                    style={style.flatten(["padding-x-12"])}
                    mode="text"
                    text="Paste"
                    onPress={async () => {
                      const text = await Clipboard.getString();
                      if (text) {
                        setValue("privateKey", text, {
                          shouldValidate: true,
                        });

                        setFocus("name");
                      }
                    }}
                  />
                </View>
              }
              style={StyleSheet.flatten([
                style.flatten(["h6", "color-text-middle"]),
                {
                  minHeight: 20 * 4,
                  textAlignVertical: "top",
                },
              ])}
              onSubmitEditing={() => {
                setFocus("name");
              }}
              error={errors.privateKey?.message}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              ref={ref}
            />
          );
        }}
        name="privateKey"
        defaultValue=""
      />
      <Controller
        control={control}
        rules={{
          required: "Name is required",
        }}
        render={({ field: { onChange, onBlur, value, ref } }) => {
          return (
            <TextInput
              label="Wallet nickname"
              containerStyle={style.flatten(["padding-bottom-6"])}
              returnKeyType={"next"}
              onSubmitEditing={() => {
                submit();
              }}
              error={errors.name?.message}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              ref={ref}
            />
          );
        }}
        name="name"
        defaultValue=""
      />
      <View style={style.flatten(["flex-1"])} />
      <Button text="Next" size="large" loading={isCreating} onPress={submit} />
      {/* Mock element for bottom padding */}
      <View style={style.flatten(["height-page-pad"])} />
    </PageWithScrollView>
  );
};
