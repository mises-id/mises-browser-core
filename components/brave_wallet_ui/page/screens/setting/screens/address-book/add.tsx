import * as React from "react";
import { FunctionComponent, useState } from "react";
import { PageWithScrollView } from "../../../../components/page";
import { useStyle } from "../../../../styles";
import { View } from "react-native";
import { TextInput } from "../../../../components/input";
import { Button } from "../../../../components/button";
import { useSmartNavigation } from "../../../../navigation";

export const AddAddressBookScreen: FunctionComponent = () => {
  // const route = useRoute<
  //   RouteProp<
  //     Record<
  //       string,
  //       {
  //         chainId: string;
  //         addressBookConfig: AddressBookConfig;
  //       }
  //     >,
  //     string
  //   >
  // >();

  const smartNavigation = useSmartNavigation();
  // const addressBookConfig = route.params.addressBookConfig;

  const style = useStyle();

  const [name, setName] = useState("");
  // const recipientConfig = useRecipientConfig(chainStore, route.params.chainId, {
  //   allowHexAddressOnEthermint: true,
  // });
  // const memoConfig = useMemoConfig(chainStore, route.params.chainId);

  return (
    <PageWithScrollView
      backgroundMode="tertiary"
      contentContainerStyle={style.get("flex-grow-1")}
      style={style.flatten(["padding-x-page"])}
    >
      <View style={style.flatten(["height-page-pad"])} />
      <TextInput
        label="Nickname"
        value={name}
        onChangeText={(text: string) => setName(text)}
      />
      {/* <AddressInput
        label="Address"
        recipientConfig={recipientConfig}
        memoConfig={memoConfig}
        disableAddressBook={true}
      /> */}
      <View style={style.flatten(["flex-1"])} />
      <Button
        text="Save"
        size="large"
        disabled={!name}
        onPress={async () => {
          if (name) {
            // await addressBookConfig.addAddressBook({
            //   name,
            //   address: recipientConfig.rawRecipient,
            //   memo: memoConfig.memo,
            // });

            smartNavigation.goBack();
          }
        }}
      />
      <View style={style.flatten(["height-page-pad"])} />
    </PageWithScrollView>
  );
};
