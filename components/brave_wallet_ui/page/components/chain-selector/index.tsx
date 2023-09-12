import * as React from "react";
import { FunctionComponent } from "react";
import { CardModal } from "../../modals/card";
import { ScrollView} from "react-native";
import { useStyle } from "../../styles";

export const ChainSelectorModal: FunctionComponent<{
  isOpen: boolean;
  close: () => void;
  chainIds: string[];
  onSelectChain: (chainId: string) => void;
}> = ({ chainIds, onSelectChain, isOpen, close }) => {
  const style = useStyle();

  return (
    <CardModal
      title="Select Chain"
      isOpen={isOpen}
      close={close}
      childrenContainerStyle={style.flatten(["padding-0"])}
    >
      <ScrollView
        style={style.flatten(["max-height-600"])}
        indicatorStyle={style.theme === "dark" ? "white" : "black"}
      >
        {/* {chainIds.map((chainId) => {
          const chainName = chainStore.hasChain(chainId)
            ? chainStore.getChain(chainId).chainName
            : chainId;

          const chainImage = chainStore.hasChain(chainId)
            ? chainStore.getChain(chainId).raw.chainSymbolImageUrl
            : undefined;

          return (
            <RectButton
              key={chainId}
              style={style.flatten([
                "padding-x-20",
                "padding-y-15",
                "flex-row",
                "items-center",
              ])}
              onPress={() => {
                onSelectChain(chainId);
              }}
            >
              <View
                style={style.flatten([
                  "width-40",
                  "height-40",
                  "border-radius-64",
                  "items-center",
                  "justify-center",
                  "background-color-blue-400",
                  "margin-right-12",
                ])}
              >
                {chainImage ? (
                  <FastImage
                    style={{
                      width: 30,
                      height: 30,
                    }}
                    resizeMode={FastImage.resizeMode.contain}
                    source={{
                      uri: chainImage,
                    }}
                  />
                ) : (
                  <VectorCharacter
                    char={chainName}
                    color="white"
                    height={14}
                  />
                )}
              </View>
              <Text style={style.flatten(["h5", "color-text-middle"])}>
                {chainName}
              </Text>
            </RectButton>
          );
        })} */}
      </ScrollView>
    </CardModal>
  );
}
