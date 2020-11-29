import { Assembly, Point, Rod, Toolpath } from '@jsxcad/api-v1-shapes';

export const DrillPress = (
  diameter = 10,
  { toolDiameter = 3.175, cutDepth = 0.3, sides = 16, sweep = 'cut' } = {}
) => (depth = 0, { x = 0, y = 0, z = 0 } = {}) => {
  const radius = diameter / 2;
  const points = [];
  const toolRadius = toolDiameter / 2;
  const cuts = Math.ceil(depth / Math.min(depth, cutDepth));
  const actualCutDepth = depth / cuts;
  const anglePerSide = 360 / sides;
  const rings = Math.ceil((radius - toolRadius) / toolDiameter);
  // At each step we can descend this much to reach the desired level.
  const zPerSegment = actualCutDepth / (sides * rings);
  for (let cut = 0; cut <= cuts; cut++) {
    // We start at the previous cut depth.
    const z = 0 - cut * actualCutDepth;
    for (let ring = 0; ring < rings; ring++) {
      const cutRadius = radius - toolRadius - toolDiameter * ring;
      for (let side = 0; side <= sides; side++) {
        const segment = sides * ring + side;
        points.push(
          Point(
            cutRadius,
            0,
            Math.max(z - zPerSegment * segment, 0 - depth)
          ).rotate(anglePerSide * side)
        );
      }
    }
  }
  // Move back to the middle so we don't rub the wall on the way up.
  points.push(Point(0, 0, 0));
  return Assembly(
    Point(x, y, 0), // Add a zero point for rebenching.
    Toolpath(...points),
    sweep === 'no'
      ? undefined
      : Rod(diameter / 2, depth)
          .op((s) => (sweep === 'show' ? s : s.hole()))
          .moveZ(depth / -2)
  ).move(x, y, z);
};

export default DrillPress;
