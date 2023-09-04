import * as React from "react";
import { FunctionComponent } from "react";
import { Card, CardBody } from "../../components/card";
import { Text, View, ViewStyle } from "react-native";
import { useStyle } from "../../styles";
import { AddressCopyable } from "../../components/address-copyable";
// import { useSmartNavigation } from "../../navigation";
import { NetworkErrorView } from "./network-error-view";
import { FunctionModules } from "./function-modules";
import { FunctionTabs } from "./function-tabs";
import { useUnsafeWalletSelector } from "../../../common/hooks/use-safe-selector";
import { WalletSelectors } from "../../../common/selectors";
import { getBalance } from "../../../common/async/lib";
import Amount from "../../../utils/amount";
import { useGetDefaultNetworksQuery, useGetSelectedChainQuery } from "../../../common/slices/api.slice";
import { BraveWallet} from '../../../constants/types'

export const AccountCard: FunctionComponent<{
  containerStyle?: ViewStyle;
}> = ({ containerStyle }) => {
  const style = useStyle();

  // const smartNavigation = useSmartNavigation();
  const selectedAccount = useUnsafeWalletSelector(WalletSelectors.selectedAccount)
  const [balance, setBalance] = React.useState('')
  // queries
  const { data: selectedNetwork } = useGetSelectedChainQuery()
  const { data: defaultNetworks } = useGetDefaultNetworksQuery()

  const selectedNetworkParams = React.useMemo(() => {
    return (
      defaultNetworks?.find(
        (network: BraveWallet.NetworkInfo) =>
          network.coin === selectedAccount?.coin
      ) || selectedNetwork
    )
  }, [defaultNetworks, selectedAccount, selectedNetwork])


  React.useEffect(() => {
    if(selectedAccount?.address && selectedNetworkParams?.decimals) {
      getBalance(selectedAccount.address, selectedAccount.coin).then(result => {
        const amount = new Amount(result)
        .divideByDecimals(selectedNetworkParams.decimals)
      setBalance(amount.formatAsAsset(6, selectedNetworkParams.symbol))
      })
    }
  }, [selectedAccount?.address, selectedNetworkParams])
  
  return (
    <Card style={containerStyle}>
      <CardBody style={style.flatten(["padding-bottom-0"])}>
        <View style={style.flatten(["flex", "items-center"])}>
          <Text
            style={style.flatten(["h4", "color-text-high", "margin-bottom-8"])}
          >
            {selectedAccount?.name || 'Account'}
          </Text>
          {selectedAccount?.address ? <AddressCopyable
            address={selectedAccount?.address}
          />  : null}
          <View style={style.flatten(["margin-top-18", "margin-bottom-16"])}>
            <View style={style.flatten(["items-center", "justify-center"])}>
              <Text style={style.flatten(["h3", "color-text-high"])}>
                {balance || "0 ETH"}
              </Text>
            </View>
          </View>
        </View>
        <FunctionModules />
        <FunctionTabs />
      </CardBody>
      <NetworkErrorView />
    </Card>
  );
};
