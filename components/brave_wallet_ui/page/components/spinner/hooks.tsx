import {
  Easing,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

export const useSpinAnimated = (enabled: boolean) => {
  const progress = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    const rotate = progress.value * 360;
    return {
      transform: [{ rotate: `${rotate}deg` }],
    };
  }, [progress]);

  useAnimatedReaction(
    () => enabled,
    () => {
      progress.value = withRepeat(
        withTiming(1, {
          duration: 1200,
          easing: Easing.linear,
        }),
        -1
      );
    }
  );

  return animatedStyle;
};
