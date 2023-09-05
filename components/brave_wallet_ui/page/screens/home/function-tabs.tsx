import * as React from "react";
import { FunctionComponent } from "react";
import { Text, View } from "react-native";
import { RectButton } from "../../components/rect-button";
import { useStyle } from "../../styles";
import AssetsList from "./assets-list";
import Activity from "./activity";
// import { TabRowRN } from "../../../components/extension/shared-panel-styles";

export const FunctionTabs: FunctionComponent = () => {
  const style = useStyle();

  const [activeTab, setactiveTab] = React.useState(0);

  return (
    <View>
      <View style={style.flatten(["flex", "flex-row"])}>
        {/* <TabRowRN>
          <PanelTab
            isSelected={activeTab === 0}
            onSubmit={() => setactiveTab(0)}
            text={'Tokens'}
          />
          <PanelTab
            isSelected={activeTab === 1}
            onSubmit={() => setactiveTab(1)}
            text={'Activity'}
          />
        </TabRowRN> */}
        <RectButton
          rippleColor={
            style.flatten(["color-gray-200", "dark:color-platinum-300"]).color
          }
          underlayColor={
            style.flatten(["color-gray-300", "dark:color-platinum-200"]).color
          }
          style={style.flatten(["flex-1", "flex", "items-center"])}
          activeOpacity={0.2}
          onPress={() => {
            setactiveTab(0)
          }}
        >
          <View style={style.flatten([`${activeTab === 0 ? 'border-width-bottom-3' : 'border-width-bottom-0'}`, 'border-color-blue-400'])}>
            <Text style={style.flatten(["margin-y-10", "margin-x-20", `${activeTab === 0 ? 'color-text-high' : 'color-text-low'}`])}>Tokens</Text>
          </View>
        </RectButton>
        <RectButton
          rippleColor={
            style.flatten(["color-gray-200", "dark:color-platinum-300"]).color
          }
          underlayColor={
            style.flatten(["color-gray-300", "dark:color-platinum-200"]).color
          }
          style={style.flatten(["flex-1", "flex", "items-center"])}
          activeOpacity={0.2}
          onPress={() => {
            setactiveTab(1)
          }}
        >
          <View style={style.flatten([`${activeTab === 1 ? 'border-width-bottom-3' : 'border-width-bottom-0'}`, 'border-color-blue-400'])}>
            <Text style={style.flatten(["margin-y-10", "margin-x-20", `${activeTab === 1 ? 'color-text-high' : 'color-text-low'}`])}>
              Activity
            </Text>
          </View>
        </RectButton>
      </View>
      {activeTab === 0 ? <AssetsList /> : null }
      {activeTab === 1 ? <Activity /> : null }
    </View>
  );
};
