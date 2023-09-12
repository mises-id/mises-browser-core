import * as React from "react";
import { FunctionComponent } from "react";
import { CardModal } from "../card";
import { RectButton } from "../../components/rect-button";
import { Text } from "react-native";
import { useStyle } from "../../styles";

export interface option {
  key: string;
  label: string;
}

const AccontSettingModal: FunctionComponent<{
  isOpen: boolean;
  close: () => void;
  options: option[];
  itemClick: (key: string) => void;
}> = ({ options, itemClick, isOpen, close }) => {
  const style = useStyle();

  return (
    <CardModal title="Account" isOpen={isOpen} close={close}>
      {options?.map((val, index) => {
        return (
          <RectButton
            key={index}
            onPress={() => itemClick(val.key)}
            style={style.flatten(["padding-x-10", "padding-y-14"])}
          >
            <Text style={style.flatten(["h6", "color-text-high"])}>
              {val.label}
            </Text>
          </RectButton>
        );
      })}
    </CardModal>
  );
}
export { AccontSettingModal };
