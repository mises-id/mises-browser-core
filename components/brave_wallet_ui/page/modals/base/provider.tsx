import * as React from "react";
import { FunctionComponent, useEffect, useMemo, useState } from "react";
import { AppState, BackHandler, View, ViewStyle } from "react-native";
import { ModalBase } from "./base";
import { ModalContext } from "./hooks";
import { ModalTransisionProvider } from "./transition";

export interface ModalOptions {
  readonly align?: "top" | "center" | "bottom";
  readonly transitionVelocity?: number;
  readonly openTransitionVelocity?: number;
  readonly closeTransitionVelocity?: number;
  // Acceleration based on 100
  readonly transitionAcceleration?: number;
  readonly disableBackdrop?: boolean;
  readonly disableClosingOnBackdropPress?: boolean;
  readonly transparentBackdrop?: boolean;
  readonly backdropMaxOpacity?: number;
  readonly blurBackdropOnIOS?: boolean;

  readonly containerStyle?: ViewStyle;
  readonly disableSafeArea?: boolean;
}

export interface Modal {
  readonly key: string;
  readonly element: React.ElementType;
  isOpen: boolean;
  props: any;
  close: () => void;
  onCloseTransitionEnd: () => void;
  options: ModalOptions;
}

export class ModalsRendererState {
  protected _modals: Modal[] = [];

  protected static lastKey: number = 0;

  protected static getKey(): string {
    ModalsRendererState.lastKey++;
    return ModalsRendererState.lastKey.toString();
  }

  get modals(): Modal[] {
    return this._modals;
  }

  pushModal<P>(
    modal: React.ElementType<P>,
    props: P,
    close: () => void,
    onCloseTransitionEnd: () => void,
    options: ModalOptions = {
      align: "bottom",
    }
  ): string {
    const key = ModalsRendererState.getKey();

    this._modals.push({
      key,
      element: modal,
      isOpen: true,
      close,
      onCloseTransitionEnd,
      props,
      options,
    });

    return key;
  }

  closeModal(key: string) {
    const index = this._modals.findIndex((modal) => modal.key === key);
    if (index >= 0) {
      this._modals[index] = {
        ...this._modals[index],
        isOpen: false,
      };
    }
  }

  updateModal(key: string, props: any) {
    const index = this._modals.findIndex((modal) => modal.key === key);
    if (index >= 0) {
      this._modals[index] = {
        ...this._modals[index],
        props,
      };
    }
  }

  removeModal(key: string) {
    const i = this._modals.findIndex((modal) => modal.key === key);
    if (i >= 0) {
      this._modals.splice(i, 1);
    }
  }
}

export const globalModalRendererState = new ModalsRendererState();

/*
 If the animation only works when the app is foreground.
 It let the modal to be stoped during closing on background.
 And when the app becomes foregound,the closing resumes.
 It looks strange and it make hard to estimate the modal unmounted.
 So, to prevent this problem, if the state is not in foreground, forcely remove the modals.
 */
AppState.addEventListener("change", (state) => {
  if (state !== "active" && state !== "inactive") {
    for (const modal of globalModalRendererState.modals) {
      if (!modal.isOpen) {
        globalModalRendererState.removeModal(modal.key);
      }
    }
  }
});

export const ModalsProvider: FunctionComponent<{ children: any }> = ({ children }) => {
  const hasOpenedModal =
    globalModalRendererState.modals.find((modal) => modal.isOpen) != null;

  useEffect(() => {
    if (hasOpenedModal) {
      const handler = () => {
        const openedModals = globalModalRendererState.modals.filter(
          (modal) => modal.isOpen
        );
        // The topmost modal can be closed by the back button if this modal can be closed by pressing the backdrop.
        if (openedModals.length > 0) {
          const topmost = openedModals[openedModals.length - 1];
          if (
            !topmost.options.disableBackdrop &&
            !topmost.options.disableClosingOnBackdropPress
          ) {
            topmost.close();
          }

          return true;
        }
        return false;
      };

      BackHandler.addEventListener("hardwareBackPress", handler);

      return () => {
        BackHandler.removeEventListener("hardwareBackPress", handler);
      };
    }
    return () => {
      
    }
  }, [hasOpenedModal]);

  return (
    <React.Fragment>
      {children}
      {globalModalRendererState.modals.length > 0 ? (
        <View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          }}
          pointerEvents="box-none"
        >
          <ModalRenderersRoot />
        </View>
      ) : null}
    </React.Fragment>
  );
}

export const ModalRenderersRoot: FunctionComponent = () => {
  return (
    <React.Fragment>
      {globalModalRendererState.modals.map((modal) => {
        return <ModalRenderer key={modal.key} modal={modal} />;
      })}
    </React.Fragment>
  );
};

export const ModalRenderer: FunctionComponent<{
  modal: Modal;
}> = ({ modal }) => {
  const [isOpenTransitioning, setIsOpenTransitioning] = useState(true);
  return (
    <ModalContext.Provider
      value={useMemo(() => {
        return {
          key: modal.key,
          isTransitionClosing: !modal.isOpen,
          isTransitionOpening: isOpenTransitioning,
          align: modal.options.align,
          isOpen: modal.props.isOpen,
          transitionVelocity: modal.options.transitionVelocity,
          openTransitionVelocity: modal.options.openTransitionVelocity,
          closeTransitionVelocity: modal.options.closeTransitionVelocity,
          transitionAcceleration: modal.options.transitionAcceleration,
          disableBackdrop: modal.options.disableBackdrop,
          disableClosingOnBackdropPress:
            modal.options.disableClosingOnBackdropPress,
          transparentBackdrop: modal.options.transparentBackdrop,
          backdropMaxOpacity: modal.options.backdropMaxOpacity,
          blurBackdropOnIOS: modal.options.blurBackdropOnIOS,
          close: modal.close,
        };
      }, [
        isOpenTransitioning,
        modal.close,
        modal.isOpen,
        modal.key,
        modal.options.align,
        modal.options.backdropMaxOpacity,
        modal.options.blurBackdropOnIOS,
        modal.options.closeTransitionVelocity,
        modal.options.disableBackdrop,
        modal.options.disableClosingOnBackdropPress,
        modal.options.openTransitionVelocity,
        modal.options.transitionAcceleration,
        modal.options.transitionVelocity,
        modal.options.transparentBackdrop,
        modal.props.isOpen,
      ])}
    >
      <ModalTransisionProvider>
        {/* <ModalBackdrop /> */}
        <ModalBase
          align={modal.options.align}
          isOpen={modal.isOpen}
          onOpenTransitionEnd={() => {
            setIsOpenTransitioning(false);
          }}
          onCloseTransitionEnd={() => {
            globalModalRendererState.removeModal(modal.key);
            modal.onCloseTransitionEnd();
          }}
          containerStyle={modal.options.containerStyle}
        >
          {React.createElement(modal.element, modal.props)}
        </ModalBase>
      </ModalTransisionProvider>
    </ModalContext.Provider>
  );
};
