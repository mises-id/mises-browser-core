import * as React from "react";
import { FunctionComponent, useState } from "react";
import { PageWithScrollView } from "../../../components/page";
import { useStyle } from "../../../styles";
import { useSmartNavigation } from "../../../navigation";
import { Controller, useForm } from "react-hook-form";
import { TextInput } from "../../../components/input";
import { View } from "react-native";
import { Button } from "../../../components/button";
import { useDispatch } from "react-redux";
import { WalletActions } from "../../../../common/actions";
import { BraveWallet } from "../../../../constants/types";

interface FormData {
  name: string;
}

export const AddAccountScreen: FunctionComponent = () => {
  const style = useStyle();

  const smartNavigation = useSmartNavigation();

  // const bip44Option = useBIP44Option();

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormData>();

  const dispatch = useDispatch();
  const [isCreating, setIsCreating] = useState(false);

  const submit = handleSubmit(async () => {
    setIsCreating(true);
    dispatch(WalletActions.addAccount({ accountName: getValues("name"), coin: BraveWallet.CoinType.ETH }))
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
          required: "Name is required",
        }}
        render={({ field: { onChange, onBlur, value, ref } }) => {
          return (
            <TextInput
              label="Wallet nickname"
              containerStyle={style.flatten(["padding-bottom-6"])}
              returnKeyType="done"
              onSubmitEditing={submit}
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
