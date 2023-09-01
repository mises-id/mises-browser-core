import * as React from "react";
import { FunctionComponent, useState } from "react";
import { PageWithScrollView } from "../../../components/page";
import { useStyle } from "../../../styles";
import { useSmartNavigation } from "../../../navigation";
import { Controller, useForm } from "react-hook-form";
import { TextInput } from "../../../components/input";
import { View } from "react-native";
import { Button } from "../../../components/button";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { WalletPageActions } from "../../../../page/actions";
// import { MultiKeyStoreInfoElem } from "@keplr-wallet/background";

interface FormData {
  mnemonic: string;
  name: string;
  password: string;
  confirmPassword: string;
}

export const RenameAccountScreen: FunctionComponent = () => {
  const style = useStyle();

  // const { analyticsStore, keyRingStore } = useStore();

  const smartNavigation = useSmartNavigation();

  const route = useRoute<
    RouteProp<
      Record<
        string,
        {
          keyRingStore: any;
        }
      >,
      string
    >
  >();
  // const bip44Option = useBIP44Option();

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormData>();

  const [isCreating, setIsCreating] = useState(false);
  const selectedAccount = React.useMemo(() => {
    return route.params.keyRingStore
  }, [route.params.keyRingStore])

  const dispatch = useDispatch();
  // const [updateError, setUpdateError] = React.useState<boolean>(false)


  const onClose = handleSubmit(async () => {
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

  const onSubmitUpdateName = React.useCallback(() => {
    if (selectedAccount) {
      setIsCreating(true);
      const isDerived = selectedAccount.accountType === 'Primary'
      const payload = {
        address: selectedAccount.address,
        name: getValues('name'),
        isDerived: isDerived
      }
      const result = dispatch(WalletPageActions.updateAccountName(payload))
      return result ? onClose() : null
    }
    return null
  }, [selectedAccount, dispatch, onClose])

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
              onSubmitEditing={onSubmitUpdateName}
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
      <Button text="Next" size="large" loading={isCreating} onPress={onSubmitUpdateName} />
      {/* Mock element for bottom padding */}
      <View style={style.flatten(["height-page-pad"])} />
    </PageWithScrollView>
  );
};
