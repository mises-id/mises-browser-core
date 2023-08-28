import * as React from "react";
import { FunctionComponent } from "react";
import { Text, View } from "react-native";
import { RectButton } from "../../components/rect-button";
import { useStyle } from "../../styles";

export const FunctionTabs: FunctionComponent = () => {
  const style = useStyle();

  // const [activeTab, setactiveTab] = useState(0);

  return (
    <View style={style.flatten(["flex", "flex-row", "margin-top-18"])}>
      <RectButton
        rippleColor={
          style.flatten(["color-gray-200", "dark:color-platinum-300"]).color
        }
        underlayColor={
          style.flatten(["color-gray-300", "dark:color-platinum-200"]).color
        }
        style={style.flatten(["flex-1", "flex", "items-center"])}
        activeOpacity={0.2}
      >
        <View>
          <Text style={style.flatten(["margin-10"])}>Tokens</Text>
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
      >
        <View>
          <Text style={style.flatten(["margin-10", "color-text-high"])}>
            Activity
          </Text>
        </View>
      </RectButton>
    </View>
  );
};
