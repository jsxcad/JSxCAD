import { Assembly, Point, Square, Toolpath } from '@jsxcad/api-v1-shapes';

export const BenchPlane = (
  width = 50,
  {
    cutDepth = 0.3,
    cutHeight = 0,
    toolDiameter = 3.175,
    axialRate = 0.25,
    millingStyle = 'any',
    sweep = 'cut',
  } = {}
) => (length, depth) => {
  let points = [];
  const pointset = [points];
  const toolRadius = toolDiameter / 2;
  const advances = Math.ceil(length / (toolDiameter * axialRate));
  const actualAdvance = length / advances;
  // An extra leveling pass at the end if we ramp.
  const cuts = Math.ceil(depth / Math.min(depth, cutDepth));
  const actualCut = depth / cuts;
  for (let advance = 0; advance < advances; advance++) {
    const x = toolRadius + advance * actualAdvance;
    for (let cut = 0; cut < cuts; cut++) {
      const startZ = Math.max(0 - actualCut * cut, 0 - depth);
      const endZ = Math.max(startZ - actualCut, 0 - depth);
      const startY = 0 + toolRadius;
      const endY = width - toolRadius;
      switch (millingStyle) {
        case 'climb':
          // Plunge and cut straight.
          // Jump back for the next pass.
          points.push(Point(x, startY, endZ), Point(x, endY, endZ));
          points = [];
          pointset.push(points);
          break;
        case 'conventional':
          // Plunge and cut straight.
          // Jump back for the next pass.
          points.push(Point(x, endY, endZ), Point(x, startY, endZ));
          points = [];
          pointset.push(points);
          break;
        case 'any':
          // Cut down sideways in one direction.
          // Then back in the other.
          if (cut % 2) {
            points.push(Point(x, startY, startZ), Point(x, endY, endZ));
            if (cut + 1 === cuts) {
              // Come back across the flat to finish the last pass.
              points.push(Point(x, startY, endZ));
            }
          } else {
            points.push(Point(x, endY, startZ), Point(x, startY, endZ));
            if (cut + 1 === cuts) {
              // Come back across the flat to finish the last pass.
              points.push(Point(x, endY, endZ));
            }
          }
          break;
        default:
          throw Error(`Unknown millingStyle: ${millingStyle}`);
      }
    }
    if (points.length > 0) {
      // Make sure there's a new toolpath so we jump to it.
      points = [];
      pointset.push(points);
    }
  }
  return Assembly(
    Point(0, 0, 0), // Add a zero point for rebenching.
    ...pointset.map((points) => Toolpath(...points)),
    sweep === 'no'
      ? undefined
      : Square(length, width)
          .extrude(0, depth)
          .bench()
          .op((s) => (sweep === 'show' ? s : s.hole()))
  );
};

export default BenchPlane;
