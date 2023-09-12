import * as React from "react";
import { FunctionComponent } from "react";
import { Text, View } from "react-native";
import { useStyle } from "../../styles";
import { ReceiveSymbol } from "../../components/transaction/receive-icon";
import { SendSymbol } from "../../components/transaction/send-icon";
import { generateQRCode } from "../../../utils/qr-code-utils";
import { useUnsafeWalletSelector } from "../../../common/hooks/use-safe-selector";
import { WalletSelectors } from "../../../common/selectors";
import ReactNativeModal from "react-native-modal";
import { Image } from "react-native";
import { AddressCopyable } from "../../components/address-copyable";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { TouchableOpacity } from "react-native";

export const FunctionModules: FunctionComponent = () => {
  const style = useStyle();
  const [qrCode, setQRCode] = React.useState('')

  const [isOpen, setisOpen] = React.useState(false)
  const selectedAccount = useUnsafeWalletSelector(WalletSelectors.selectedAccount)

  React.useEffect(() => {
    let subscribed = true

    // fetch selected Account QR Code
    selectedAccount?.address && generateQRCode(selectedAccount.address).then(qr => {
      if (subscribed) {
        setQRCode(qr)
      }
    })
    // cleanup
    return () => {
      subscribed = false
    }
  }, [selectedAccount?.address])

  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
  return (
    <View style={style.flatten(["flex", "flex-row", "justify-center"])}>
      <TouchableOpacity style={style.flatten(["flex", "items-center", "margin-10"])} onPress={() => {
        navigation.navigate("Others", {
          screen: "Send",
        });
      }}>
        <SendSymbol size={35} color={style.get("color-blue-400").color} />
        <Text style={style.flatten(["h6", "color-text-high", "margin-top-4"])}>
          Send
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={style.flatten(["flex", "items-center", "margin-10"])} onPress={() => {
        setisOpen(true)
      }}>
        <ReceiveSymbol size={35} color={style.get("color-blue-400").color} />
        <Text style={style.flatten(["h6", "color-text-high", "margin-top-4"])}>
          Receive
        </Text>
      </TouchableOpacity>
      <ReactNativeModal
        onBackdropPress={()=>setisOpen(false)}
        isVisible={isOpen}
      >
        <View style={style.flatten(['padding-10', 'flex', 'justify-center', 'items-center', "background-color-white"])}>
          <Image
            style={{
              width: 300,
              height: 300,
            }}
            source={{
              uri: qrCode,
            }}
          />
          {selectedAccount?.address && <AddressCopyable address={selectedAccount?.address} />}
        </View>
      </ReactNativeModal>
    </View>
  );
};
