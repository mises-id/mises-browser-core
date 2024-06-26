import * as React from "react";
import { FunctionComponent } from "react";
import Svg, { Path } from "react-native-svg";

export const VectorW: FunctionComponent<{
  height: number;
  color: string;
}> = ({ height, color }) => {
  return (
    <Svg
      fillRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit="2"
      clipRule="evenodd"
      viewBox="0 0 45 35"
      style={{
        height,
        aspectRatio: 45 / 35,
      }}
    >
      <Path
        fill={color}
        fillRule="nonzero"
        d="M857.769 137.286c.534 1.8 1.1 3.675 1.7 5.625.6 1.95 1.225 3.9 1.875 5.85.65 1.95 1.3 3.867 1.95 5.75.65 1.883 1.275 3.658 1.875 5.325.5-1.8.984-3.758 1.45-5.875.467-2.117.934-4.317 1.4-6.6.467-2.283.925-4.608 1.375-6.975.45-2.367.875-4.7 1.275-7h6.5a313.042 313.042 0 01-3.9 18.075 213.776 213.776 0 01-4.8 16.575h-6c-2.6-6.733-5.116-14.083-7.55-22.05a311.833 311.833 0 01-3.75 11.5 524.49 524.49 0 01-3.8 10.55h-6c-1.8-5.267-3.408-10.792-4.825-16.575a330.206 330.206 0 01-3.875-18.075h6.75c.4 2.267.825 4.583 1.275 6.95.45 2.367.917 4.692 1.4 6.975.484 2.283.975 4.492 1.475 6.625.5 2.133 1 4.1 1.5 5.9.634-1.7 1.275-3.492 1.925-5.375.65-1.883 1.292-3.8 1.925-5.75a284.976 284.976 0 003.45-11.425h5.4z"
        transform="translate(-832.669 -133.386)"
      />
    </Svg>
  );
};
