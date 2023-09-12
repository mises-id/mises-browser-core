import * as React from "react";
import { FunctionComponent } from "react";
import { SharedValue, useSharedValue } from "react-native-reanimated";

export type ModalTransition = {
  clock: SharedValue<number>;
  startY: SharedValue<number>;

  translateY: SharedValue<number>;
  finished: SharedValue<number>;
  time: SharedValue<number>;
  frameTime: SharedValue<number>;

  // If modal is open, set 1,
  // else, set -1.
  isOpen: SharedValue<number>;
  isInitialized: SharedValue<number>;
  isPaused: SharedValue<number>;

  // Used as local variable
  duration: SharedValue<number>;
  durationSetOnExternal: SharedValue<number>;
};

export const ModalTransisionContext = React.createContext<ModalTransition | null>(
  null
);

export const ModalTransisionProvider: FunctionComponent<{children: any}> = ({ children }) => {
  const clock = useSharedValue(0);
  const startY = useSharedValue(0);
  const translateY = useSharedValue(0);
  const finished = useSharedValue(0);
  const time = useSharedValue(0);
  const frameTime = useSharedValue(0);
  const isOpen = useSharedValue(0);
  const isInitialized = useSharedValue(0);
  const isPaused = useSharedValue(0);
  const duration = useSharedValue(0);
  const durationSetOnExternal = useSharedValue(0);

  const state = {
    clock,
    startY,
    translateY,
    finished,
    time,
    frameTime,
    isOpen,
    isInitialized,
    isPaused,
    duration,
    durationSetOnExternal,
  };

  return (
    <ModalTransisionContext.Provider value={state}>
      {children}
    </ModalTransisionContext.Provider>
  );
};

export const useModalTransision = () => {
  const context = React.useContext(ModalTransisionContext);
  if (!context) {
    throw new Error("Can't find ModalTransisionContext");
  }
  return context;
};
