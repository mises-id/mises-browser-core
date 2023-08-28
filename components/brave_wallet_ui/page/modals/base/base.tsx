import * as React from "react";
import { FunctionComponent, useMemo } from "react";
import { ViewStyle } from "react-native";
import ModalComponent from "react-native-modal";
import { useModalState } from "./hooks";

export interface ModalBaseProps {
  align?: "top" | "center" | "bottom";
  isOpen: boolean;
  onOpenTransitionEnd?: () => void;
  onCloseTransitionEnd?: () => void;
  children: any;
  containerStyle?: ViewStyle;
}

export const ModalBase: FunctionComponent<ModalBaseProps> = ({
  children,
  align = "bottom",
  isOpen,
  onOpenTransitionEnd,
  onCloseTransitionEnd,
  containerStyle,
}) => {
  const justifyContent = useMemo(() => {
    switch (align) {
      case "top":
        return {
          justifyContent: "flex-start",
        };
      case "bottom":
        return {
          justifyContent: "flex-end",
        };
      case "center":
        return {
          justifyContent: "center",
          alignItems: "center",
        };
      default:
        return {
          justifyContent: "flex-end",
        };
    }
  }, [align]);

  const modal = useModalState();

  return (
    <ModalComponent
      isVisible={isOpen}
      onModalShow={onOpenTransitionEnd}
      onModalHide={onCloseTransitionEnd}
      onBackdropPress={modal.close}
      style={{
        ...(justifyContent as any),
        ...containerStyle,
      }}
    >
      {children}
    </ModalComponent>
  );
};
