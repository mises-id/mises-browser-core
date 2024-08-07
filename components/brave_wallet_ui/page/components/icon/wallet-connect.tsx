import * as React from "react";
import { FunctionComponent } from "react";
import Svg, { Path } from "react-native-svg";

export const WalletConnectIcon: FunctionComponent<{
  color?: string;
  height: number;
}> = ({ color = "#3B99FC", height }) => {
  return (
    <Svg
      fill="none"
      viewBox="0 0 52 32"
      style={{
        height,
        aspectRatio: 52 / 32,
      }}
    >
      <Path
        fill={color}
        d="M10.594 6.235c8.508-8.313 22.304-8.313 30.812 0l1.024 1c.426.416.426 1.09 0 1.506l-3.503 3.422a.554.554 0 01-.77 0l-1.41-1.376c-5.935-5.8-15.559-5.8-21.495 0l-1.509 1.474a.554.554 0 01-.77 0L9.47 8.838a1.047 1.047 0 010-1.505l1.124-1.098zm38.057 7.078l3.118 3.046c.425.416.425 1.09 0 1.506L37.71 31.6a1.108 1.108 0 01-1.54 0l-9.978-9.748a.277.277 0 00-.386 0L15.83 31.6a1.108 1.108 0 01-1.54 0L.23 17.865a1.047 1.047 0 010-1.506l3.118-3.046a1.108 1.108 0 011.54 0l9.978 9.749a.277.277 0 00.385 0l9.978-9.749a1.108 1.108 0 011.54 0l9.978 9.749a.277.277 0 00.385 0l9.977-9.749a1.107 1.107 0 011.54 0z"
      />
    </Svg>
  );
};
