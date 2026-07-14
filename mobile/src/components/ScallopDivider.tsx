import React from "react";
import { View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useAppTheme } from "../contexts/ThemeContext";

// A row of connected scallops — read as a shell edge or a line of gentle
// waves depending on how you look at it. Used under hero images and above
// key section breaks as the app's one recurring signature shape, standing
// in for the generic straight-edge card/section dividers most food apps use.
export function ScallopDivider({
  height = 22,
  color,
  count = 12,
}: {
  height?: number;
  color?: string;
  count?: number;
}) {
  const theme = useAppTheme();
  const fill = color ?? theme.background;
  const width = 100 / count;

  let path = `M0,0 `;
  for (let i = 0; i < count; i++) {
    const x = i * width;
    const midX = x + width / 2;
    const endX = x + width;
    path += `Q${midX},${height} ${endX},0 `;
  }
  path += `L100,${height + 4} L0,${height + 4} Z`;

  return (
    <View style={{ width: "100%", height: height + 4 }}>
      <Svg width="100%" height={height + 4} viewBox={`0 0 100 ${height + 4}`} preserveAspectRatio="none">
        <Path d={path} fill={fill} />
      </Svg>
    </View>
  );
}
