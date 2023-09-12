import * as React from "react";
import { FunctionComponent, useEffect } from "react";
import { PageWithScrollView } from "../../../../components/page";
import { useStyle } from "../../../../styles";
import { Text, View } from "react-native";
import { useSmartNavigation } from "../../../../navigation";
import { shortenAddress } from "../../../../common";
import { TrashCanIcon } from "../../../../components/icon";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RectButton } from "../../../../components/rect-button";
import { TouchableOpacity } from "react-native-gesture-handler";
import { HeaderRightButton } from "../../../../components/header";
import { HeaderAddIcon } from "../../../../components/header/icon";
import { AddressBookIcon } from "../../../../components/icon";
import { useConfirmModal } from "../../../../providers/confirm-modal";

const addressBookItemComponent = {
  inTransaction: RectButton,
  inSetting: View,
};

export const AddressBookScreen: FunctionComponent = () => {
  const confirmModal = useConfirmModal();

  const route = useRoute<
    RouteProp<
      Record<
        string,
        {
          recipientConfig?: any;
          memoConfig?: any;
        }
      >,
      string
    >
  >();

  const recipientConfig = route.params.recipientConfig;
  const memoConfig = route.params.memoConfig;

  const style = useStyle();

  const smartNavigation = useSmartNavigation();

  // const chainId = recipientConfig
  //   ? recipientConfig.chainId
  //   : chainStore.current.chainId;

  const chainId = "mainnet";
  // const addressBookConfig = useAddressBookConfig(
  //   new AsyncKVStore("address_book"),
  //   chainStore,
  //   chainId,
  //   {
  //     setRecipient: (recipient: string) => {
  //       if (recipientConfig) {
  //         recipientConfig.setRawRecipient(recipient);
  //       }
  //     },
  //     setMemo: (memo: string) => {
  //       if (memoConfig) {
  //         memoConfig.setMemo(memo);
  //       }
  //     },
  //   }
  // );
  const addressBookConfig = {
    addressBookDatas: [
      {
        name: "13123",
        address: "0x2a65806c935891630DC666978a87cd50b2666666",
      },
    ],
    selectAddressAt: (i: number) => {},
    removeAddressBook: (i: number) => {},
  };
  useEffect(() => {
    smartNavigation.setOptions({
      // eslint-disable-next-line react/display-name
      headerRight: () => (
        <HeaderRightButton
          onPress={() => {
            smartNavigation.navigateSmart("AddAddressBook", {
              chainId,
              addressBookConfig,
            });
          }}
        >
          <HeaderAddIcon />
        </HeaderRightButton>
      ),
    });
  }, [addressBookConfig, chainId, smartNavigation, style]);

  const isInTransaction = recipientConfig != null || memoConfig != null;
  const AddressBookItem =
    addressBookItemComponent[isInTransaction ? "inTransaction" : "inSetting"];

  return addressBookConfig.addressBookDatas.length > 0 ? (
    <PageWithScrollView backgroundMode="secondary">
      <View style={style.flatten(["height-card-gap"])} />
      {addressBookConfig.addressBookDatas.map((data, i) => {
        return (
          <React.Fragment key={i.toString()}>
            <AddressBookItem
              style={style.flatten([
                "background-color-white",
                "dark:background-color-platinum-600",
                "padding-x-18",
                "padding-y-14",
              ])}
              enabled={isInTransaction}
              onPress={() => {
                if (isInTransaction) {
                  addressBookConfig.selectAddressAt(i);
                  smartNavigation.goBack();
                }
              }}
            >
              <View
                style={style.flatten([
                  "flex-row",
                  "justify-between",
                  "items-center",
                ])}
              >
                <View>
                  <Text
                    style={style.flatten([
                      "subtitle2",
                      "color-text-middle",
                      "margin-bottom-4",
                    ])}
                  >
                    {data.name}
                  </Text>
                  <Text
                    style={style.flatten([
                      "text-caption1",
                      "font-medium",
                      "color-blue-400",
                    ])}
                  >
                    {shortenAddress(data.address)}
                  </Text>
                </View>
                <TouchableOpacity
                  style={style.flatten(["padding-left-8", "padding-y-12"])}
                  onPress={async () => {
                    if (
                      await confirmModal.confirm({
                        title: "Remove Address",
                        paragraph:
                          "Are you sure you want to remove this address?",
                        yesButtonText: "Remove",
                        noButtonText: "Cancel",
                      })
                    ) {
                      await addressBookConfig.removeAddressBook(i);
                    }
                  }}
                >
                  <TrashCanIcon
                    color={
                      style.flatten([
                        "color-gray-100",
                        "dark:color-platinum-300",
                      ]).color
                    }
                    size={24}
                  />
                </TouchableOpacity>
              </View>
            </AddressBookItem>
            {addressBookConfig.addressBookDatas.length - 1 !== i ? (
              <View
                style={style.flatten([
                  "height-1",
                  "background-color-gray-50",
                  "dark:background-color-platinum-500",
                ])}
              />
            ) : null}
          </React.Fragment>
        );
      })}
    </PageWithScrollView>
  ) : (
    <PageWithScrollView
      backgroundMode="secondary"
      contentContainerStyle={style.flatten(["flex-grow-1"])}
      scrollEnabled={false}
    >
      <View style={style.flatten(["flex-1"])} />
      <View style={style.flatten(["justify-center", "items-center"])}>
        <View style={style.flatten(["margin-bottom-21"])}>
          <AddressBookIcon
            color={
              style.flatten(["color-gray-200", "dark:color-platinum-300"]).color
            }
            height={56}
          />
        </View>
        <Text
          style={style.flatten([
            "subtitle2",
            "color-gray-100",
            "dark:color-platinum-300",
          ])}
        >
          Address book is empty
        </Text>
      </View>
      <View style={style.flatten(["margin-top-68", "flex-1"])} />
    </PageWithScrollView>
  );
};

export * from "./add";
