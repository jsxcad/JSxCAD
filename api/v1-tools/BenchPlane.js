import { Cube, Point, Toolpath } from '@jsxcad/api-v1-shapes';

export const BenchPlane = ({
  width = 50,
  cutDepth = 0.1,
  cutHeight = 1000,
  toolDiameter = 3.145,
  advance = 0.5,
}) => (length) => {
  const points = [];
  const z = 0 - cutDepth;
  const radialDepth = toolDiameter * advance;
  for (let x = 0; x < length; ) {
    points.push(
      Point(x, (width - toolDiameter) / -2, z),
      Point(x, (width - toolDiameter) / 2, z)
    );
    x += radialDepth;
    points.push(
      Point(x, (width - toolDiameter) / 2, z),
      Point(x, (width - toolDiameter) / -2, z)
    );
    x += radialDepth;
  }
  return Toolpath(...points).with(
    Cube(length, width, cutHeight + cutDepth)
      .Void()
      .benchTop()
      .moveZ(-cutDepth)
  );
};
