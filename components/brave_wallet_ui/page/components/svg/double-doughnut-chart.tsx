import * as React from "react";
import { FunctionComponent, useEffect, useMemo, useRef } from "react";
import {
  Circle,
  ClipPath,
  Defs,
  LinearGradient,
  Path,
  Stop,
  Svg,
  Use,
} from "react-native-svg";
import Animated, {
  Easing,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useStyle } from "../../styles";

// Convert to cartesian coordinates from polar coordinates.
const polarToCartesian = (
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegree: number
): {
  x: number;
  y: number;
} => {
  const angleInRadian = (angleInDegree * Math.PI) / 180;
  return {
    x: centerX + radius * Math.cos(angleInRadian),
    y: centerY + radius * Math.sin(angleInRadian),
  };
};

// Draw arc in clockwise.
// End angle should be greater than or equal to start angle.
// Else, behavior is not guaranteed.
const describeArc = (
  x: number,
  y: number,
  radius: number,
  startAngleInDegree: number,
  endAngleInDegree: number
) => {
  const start = polarToCartesian(x, y, radius, startAngleInDegree);
  const end = polarToCartesian(
    x,
    y,
    radius,
    // Can't draw an arc from the same point to the same point in svg.
    // Due to this problem, it only allows up to 359.9 degree.
    Math.min(endAngleInDegree, startAngleInDegree + 359.9)
  );
  const largeArcFlag = endAngleInDegree - startAngleInDegree < 180 ? 0 : 1;
  // const largeArcFlag = Animated.cond(
  //   Animated.lessThan(Animated.sub(endAngleInDegree - startAngleInDegree), 180),
  //   0,
  //   1
  // );

  const d = [
    "M",
    " ",
    x,
    " ",
    y,
    " ",
    "L",
    " ",
    start.x,
    " ",
    start.y,
    " ",
    "M",
    " ",
    start.x,
    " ",
    start.y,
    " ",
    "A",
    " ",
    radius,
    " ",
    radius,
    " ",
    0,
    " ",
    largeArcFlag,
    " ",
    1,
    " ",
    end.x,
    " ",
    end.y,
    " ",
    "L",
    " ",
    x,
    " ",
    y,
  ];

  return d.join(" ");
};

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const gapAngleInDegree = 14;
const minArcAngleInDegree = 0.2;

// NOTE: `velocitySec` and `minDurationMs` are only used when the animation starts.
//       It doesn't react whenever these values change.
//       Therefore, use constant `velocitySec` and `minDurationMs` as much as possible.
const useAnimated = (
  toValue: number,
  velocitySec: number,
  minDurationMs: number = 0
) => {
  const prevToValue = useSharedValue(0);
  const finished = useSharedValue(0);
  const position = useSharedValue(0);
  const time = useSharedValue(0);
  const frameTime = useSharedValue(0);

  const state = {
    finished,
    position,
    time,
    frameTime,
  };
  const duration = useSharedValue(0);
  const config = {
    duration,
    easing: Easing.out(Easing.cubic),
  };

  return useMemo(() => {
    if (state.position) {
      state.position.value = toValue;
      prevToValue.value = toValue;
    }

    if (!(prevToValue.value === toValue)) {
      config.duration.value = Math.max(
        (Math.abs(toValue - prevToValue.value) / velocitySec) * 1000,
        minDurationMs
      );
      prevToValue.value = toValue;
    }

    return toValue;
  }, [config, minDurationMs, prevToValue, state, toValue, velocitySec]);
};

export const DoubleDoughnutChart: FunctionComponent<{
  size?: number;
  // Only two data are allowed. If it is [0, 0], a gray ring is shown behind. If undefined, nothing is displayed.
  data: [number, number] | undefined;
}> = ({ data, size = 188 }) => {
  const targetFirstRatio = useSharedValue(0);
  const targetSecondRatio = useSharedValue(0);

  const valueDataIsLoaded = useSharedValue(data ? 1 : 0);
  const backRingOpacity = useSharedValue(0);

  const targetFirstArcStartAngleInDegree = useSharedValue(90);
  const targetFirstArcEndAngleInDegree = useSharedValue(90);
  const targetSecondArcStartAngleInDegree = useSharedValue(90);
  const targetSecondArcEndAngleInDegree = useSharedValue(90);

  const dataIsLoaded = !!data;
  const firstData = data ? data[0] : 0;
  const secondData = data ? data[1] : 0;
  const sumData = firstData + secondData;

  // If animated node is updated too often, some strange glitches occur.
  // To alleviate this problem, debounce to update animated node.
  const debouncer = useRef<NodeJS.Timeout | undefined>();
  useEffect(() => {
    let firstRatio: number;
    let secondRatio: number;

    if (sumData > 0) {
      firstRatio = firstData / sumData;
      secondRatio = secondData / sumData;
    } else {
      firstRatio = 0;
      secondRatio = 0;
    }

    if (sumData > 0) {
      if (debouncer.current != null) {
        clearTimeout(debouncer.current);

        debouncer.current = setTimeout(() => {
          targetFirstRatio.value = firstRatio;
          targetSecondRatio.value = secondRatio;
          valueDataIsLoaded.value = dataIsLoaded ? 1 : 0;

          debouncer.current = undefined;
        }, 250) as any;
      } else {
        debouncer.current = setTimeout(() => {
          targetFirstRatio.value = firstRatio;
          targetSecondRatio.value = secondRatio;
          valueDataIsLoaded.value = dataIsLoaded ? 1 : 0;

          debouncer.current = undefined;
        }, 100) as any;
      }
    } else {
      if (debouncer.current != null) {
        clearTimeout(debouncer.current);
      }

      debouncer.current = setTimeout(() => {
        targetFirstRatio.value = firstRatio;
        targetSecondRatio.value = secondRatio;
        valueDataIsLoaded.value = dataIsLoaded ? 1 : 0;

        debouncer.current = undefined;
      }, 500) as any;
    }
  }, [
    firstData,
    secondData,
    sumData,
    targetFirstRatio,
    targetSecondRatio,
    dataIsLoaded,
    valueDataIsLoaded,
  ]);

  if (targetSecondRatio.value > 0) {
    if (targetFirstRatio.value > 0) {
      targetFirstArcStartAngleInDegree.value = withTiming(
        90 + gapAngleInDegree / 2,
        {
          duration: 0,
        }
      );
      targetFirstArcEndAngleInDegree.value = withTiming(
        90 +
          gapAngleInDegree / 2 +
          Math.max(
            minArcAngleInDegree,
            Math.min(
              360 - gapAngleInDegree * 2 - minArcAngleInDegree,
              360 * targetFirstRatio.value - gapAngleInDegree
            )
          ),
        {
          duration: 0,
        }
      );
    } else {
      targetFirstArcStartAngleInDegree.value = withTiming(90, {
        duration: 0,
      });
      targetFirstArcEndAngleInDegree.value = withTiming(90, {
        duration: 0,
      });
    }
  } else {
    targetFirstArcEndAngleInDegree.value = withTiming(
      360 * targetFirstRatio.value + 90,
      {
        duration: 0,
      }
    );
  }
  if (targetFirstRatio.value > 0) {
    if (targetSecondRatio.value > 0) {
      targetSecondArcStartAngleInDegree.value = withTiming(
        targetFirstArcEndAngleInDegree.value + gapAngleInDegree,
        {
          duration: 0,
        }
      );
      targetSecondArcEndAngleInDegree.value = withTiming(
        360 + 90 - gapAngleInDegree / 2,
        {
          duration: 0,
        }
      );
    } else {
      targetSecondArcStartAngleInDegree.value = withTiming(360 + 90, {
        duration: 0,
      });
      targetSecondArcEndAngleInDegree.value = withTiming(360 + 90, {
        duration: 0,
      });
    }
  } else {
    if (targetSecondRatio.value > 0) {
      targetSecondArcStartAngleInDegree.value = withTiming(
        360 - 360 / targetSecondRatio.value + 90,
        {
          duration: 0,
        }
      );
      targetSecondArcEndAngleInDegree.value = withTiming(360 + 90, {
        duration: 0,
      });
    } else {
      targetSecondArcStartAngleInDegree.value = withTiming(90, {
        duration: 0,
      });
      targetSecondArcEndAngleInDegree.value = withTiming(90, {
        duration: 0,
      });
    }
  }
  if (
    valueDataIsLoaded.value > 0 &&
    targetFirstRatio.value <= 0 &&
    targetSecondRatio.value <= 0
  ) {
    backRingOpacity.value = withTiming(1, {
      duration: 0,
    });
  } else {
    backRingOpacity.value = withTiming(1, {
      duration: 0,
    });
  }
  useEffect(() => {
    if (targetSecondRatio.value > 0) {
      if (targetFirstRatio.value > 0) {
        targetFirstArcStartAngleInDegree.value = withTiming(
          90 + gapAngleInDegree / 2,
          {
            duration: 0,
          }
        );
        targetFirstArcEndAngleInDegree.value = withTiming(
          90 +
            gapAngleInDegree / 2 +
            Math.max(
              minArcAngleInDegree,
              Math.min(
                360 - gapAngleInDegree * 2 - minArcAngleInDegree,
                360 * targetFirstRatio.value - gapAngleInDegree
              )
            ),
          {
            duration: 0,
          }
        );
      } else {
        targetFirstArcStartAngleInDegree.value = withTiming(90, {
          duration: 0,
        });
        targetFirstArcEndAngleInDegree.value = withTiming(90, {
          duration: 0,
        });
      }
    } else {
      targetFirstArcEndAngleInDegree.value = withTiming(
        360 * targetFirstRatio.value + 90,
        {
          duration: 0,
        }
      );
    }

    if (targetFirstRatio.value > 0) {
      if (targetSecondRatio.value > 0) {
        targetSecondArcStartAngleInDegree.value = withTiming(
          targetFirstArcEndAngleInDegree.value + gapAngleInDegree,
          {
            duration: 0,
          }
        );
        targetSecondArcEndAngleInDegree.value = withTiming(
          360 + 90 - gapAngleInDegree / 2,
          {
            duration: 0,
          }
        );
      } else {
        targetSecondArcStartAngleInDegree.value = withTiming(360 + 90, {
          duration: 0,
        });
        targetSecondArcEndAngleInDegree.value = withTiming(360 + 90, {
          duration: 0,
        });
      }
    } else {
      if (targetSecondRatio.value > 0) {
        targetSecondArcStartAngleInDegree.value = withTiming(
          360 - 360 / targetSecondRatio.value + 90,
          {
            duration: 0,
          }
        );
        targetSecondArcEndAngleInDegree.value = withTiming(360 + 90, {
          duration: 0,
        });
      } else {
        targetSecondArcStartAngleInDegree.value = withTiming(90, {
          duration: 0,
        });
        targetSecondArcEndAngleInDegree.value = withTiming(90, {
          duration: 0,
        });
      }
    }

    if (
      valueDataIsLoaded.value > 0 &&
      targetFirstRatio.value <= 0 &&
      targetSecondRatio.value <= 0
    ) {
      backRingOpacity.value = withTiming(1, {
        duration: 0,
      });
    } else {
      backRingOpacity.value = withTiming(0, {
        duration: 0,
      });
    }
  }, [
    targetFirstRatio,
    targetSecondRatio,
    targetFirstArcStartAngleInDegree,
    targetFirstArcEndAngleInDegree,
    targetSecondArcEndAngleInDegree,
    targetSecondArcStartAngleInDegree,
    valueDataIsLoaded,
    backRingOpacity,
  ]);

  const animBackRingOpacity = useAnimated(backRingOpacity.value, 2);

  const animFirstArcStartAngleInDegree = useAnimated(
    targetFirstArcStartAngleInDegree.value,
    330,
    600
  );
  const animFirstArcEndAngleInDegree = useAnimated(
    targetFirstArcEndAngleInDegree.value,
    330,
    600
  );
  const animSecondArcStartAngleInDegree = useAnimated(
    targetSecondArcStartAngleInDegree.value,
    330,
    600
  );
  const animSecondArcEndAngleInDegree = useAnimated(
    targetSecondArcEndAngleInDegree.value,
    330,
    600
  );

  return (
    <DoubleDoughnutChartInnerSVG
      size={size}
      backRingOpacity={animBackRingOpacity}
      firstArcStartAngleInDegree={animFirstArcStartAngleInDegree}
      firstArcEndAngleInDegree={animFirstArcEndAngleInDegree}
      secondArcStartAngleInDegree={animSecondArcStartAngleInDegree}
      secondArcEndAngleInDegree={animSecondArcEndAngleInDegree}
    />
  );
};

const DoubleDoughnutChartInnerSVG: FunctionComponent<{
  size: number;

  backRingOpacity?: number;

  firstArcStartAngleInDegree: number;
  firstArcEndAngleInDegree: number;
  secondArcStartAngleInDegree: number;
  secondArcEndAngleInDegree: number;
  // eslint-disable-next-line react/display-name
}> = React.memo(
  ({
    size,

    backRingOpacity,

    firstArcStartAngleInDegree,
    firstArcEndAngleInDegree,
    secondArcStartAngleInDegree,
    secondArcEndAngleInDegree,
  }) => {
    const style = useStyle();

    const centerLocation = 90;
    const radius = 83;
    const capRadius = centerLocation - radius;

    const firstStartCapPosition = useMemo(() => {
      return polarToCartesian(
        centerLocation,
        centerLocation,
        radius,
        firstArcStartAngleInDegree
      );
    }, [centerLocation, firstArcStartAngleInDegree, radius]);
    const firstEndCapPosition = useMemo(() => {
      return polarToCartesian(
        centerLocation,
        centerLocation,
        radius,
        firstArcEndAngleInDegree
      );
    }, [centerLocation, firstArcEndAngleInDegree, radius]);

    const secondStartCapPosition = useMemo(() => {
      return polarToCartesian(
        centerLocation,
        centerLocation,
        radius,
        secondArcStartAngleInDegree
      );
    }, [centerLocation, radius, secondArcStartAngleInDegree]);
    const secondEndCapPosition = useMemo(() => {
      return polarToCartesian(
        centerLocation,
        centerLocation,
        radius,
        secondArcEndAngleInDegree
      );
    }, [centerLocation, radius, secondArcEndAngleInDegree]);

    const hideFirstArcCaps = useMemo(() => {
      return Math.abs(firstArcEndAngleInDegree - firstArcStartAngleInDegree) <
        0.1
        ? 1
        : 0;
    }, [firstArcEndAngleInDegree, firstArcStartAngleInDegree]);

    const hideSecondArcCaps = useMemo(() => {
      return Math.abs(secondArcEndAngleInDegree - secondArcStartAngleInDegree) <
        0.1
        ? 1
        : 0;
    }, [secondArcEndAngleInDegree, secondArcStartAngleInDegree]);

    return (
      <Svg width={size} height={size} viewBox="0 0 180 180">
        <AnimatedCircle
          cx={centerLocation}
          cy={centerLocation}
          r={radius}
          stroke={
            style.flatten(["color-gray-50", "dark:color-platinum-500"]).color
          }
          strokeWidth="14"
          fill="transparent"
          opacity={backRingOpacity ? backRingOpacity : 0}
        />
        <Defs>
          <LinearGradient id="grad1" x1="1" y1="0" x2="0" y2="0">
            <Stop offset="0%" stopColor="#71C4FF" />
            <Stop offset="100%" stopColor="#D378FE" />
          </LinearGradient>
          <LinearGradient id="grad2" x1="0" y1="0" x2="1" y2="0">
            <Stop
              offset="0%"
              stopColor={style.theme === "dark" ? "#394365" : "#F0C9FF"}
            />
            <Stop
              offset="100%"
              stopColor={style.theme === "dark" ? "#2F4C65" : "#D4EEFF"}
            />
          </LinearGradient>
          <ClipPath id="first-arc-clip">
            <AnimatedPath
              d={describeArc(
                centerLocation,
                centerLocation,
                centerLocation,
                firstArcStartAngleInDegree,
                firstArcEndAngleInDegree
              )}
              fill="white"
            />
            <AnimatedCircle
              cx={firstStartCapPosition.x}
              cy={firstStartCapPosition.y}
              r={hideFirstArcCaps > 0 ? 0 : capRadius}
              fill="white"
            />
            <AnimatedCircle
              cx={firstEndCapPosition.x}
              cy={firstEndCapPosition.y}
              r={hideFirstArcCaps > 0 ? 0 : capRadius}
              fill="white"
            />
          </ClipPath>
          <ClipPath id="second-arc-clip">
            <AnimatedPath
              d={describeArc(
                centerLocation,
                centerLocation,
                centerLocation,
                secondArcStartAngleInDegree,
                secondArcEndAngleInDegree
              )}
              fill="white"
            />
            <AnimatedCircle
              cx={secondStartCapPosition.x}
              cy={secondStartCapPosition.y}
              r={
                hideSecondArcCaps
                  ? hideSecondArcCaps > 0
                    ? 0
                    : capRadius
                  : capRadius
              }
              fill="white"
            />
            <AnimatedCircle
              cx={secondEndCapPosition.x}
              cy={secondEndCapPosition.y}
              r={
                hideSecondArcCaps
                  ? hideSecondArcCaps > 0
                    ? 0
                    : capRadius
                  : capRadius
              }
              fill="white"
            />
          </ClipPath>
        </Defs>
        <Circle
          id="second-arc"
          cx={centerLocation}
          cy={centerLocation}
          r={radius}
        />
        <Use
          clipPath="url(#second-arc-clip)"
          xlinkHref="#second-arc"
          fill="transparent"
          stroke="url(#grad2)"
          strokeWidth="14"
          clipRule="nonzero"
        />
        <Circle
          id="first-arc"
          cx={centerLocation}
          cy={centerLocation}
          r={radius}
        />
        <Use
          clipPath="url(#first-arc-clip)"
          xlinkHref="#first-arc"
          fill="transparent"
          stroke="url(#grad1)"
          strokeWidth="14"
          clipRule="nonzero"
        />
      </Svg>
    );
  }
);
