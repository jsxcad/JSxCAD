import { Cube, Path } from '@jsxcad/api-v1-shapes';

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
      [x, (width - toolDiameter) / -2, z],
      [x, (width - toolDiameter) / 2, z]
    );
    x += radialDepth;
    points.push(
      [x + toolDiameter, (width - toolDiameter) / 2, z],
      [x + toolDiameter, (width - toolDiameter) / -2, z]
    );
    x += radialDepth;
  }
  const design = Path(...points);
  return design
    .with(
      design.sweep(
        Cube(toolDiameter, toolDiameter, cutHeight).benchTop(0, 0, cutDepth)
      )
    )
    .Item('Plane Tooling');
};
