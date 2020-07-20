import { Assembly, Cube, Point, Toolpath } from '@jsxcad/api-v1-shapes';

export const BenchPlane = (
  width = 50,
  {
    cutDepth = 0.3,
    cutHeight = 1000,
    toolDiameter = 3.175,
    axialRate = 1,
    millingStyle = 'any',
  }
) => (length, depth) => {
  let points = [];
  const pointset = [points];
  const toolRadius = toolDiameter / 2;
  const advances = Math.ceil(length / (toolDiameter * axialRate));
  const actualAdvance = length / advances;
  const cuts = Math.ceil(depth / cutDepth);
  const actualCut = depth / cuts;
  for (let advance = 0; advance < advances; advance++) {
    const x = toolRadius + advance * actualAdvance;
    for (let cut = 0; cut <= cuts; cut++) {
      const startZ = 0 - actualCut * cut;
      const endZ = startZ + actualCut;
      const startY = width / -2 + toolRadius;
      const endY = width / 2 - toolRadius;
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
          } else {
            points.push(Point(x, endY, startZ), Point(x, startY, endZ));
          }
          break;
        default:
          throw Error(`Unknown millingStyle: ${millingStyle}`);
      }
    }
  }
  return Assembly(...pointset.map((points) => Toolpath(...points))).with(
    Cube(length, width, cutHeight + cutDepth)
      .Void()
      .benchTop()
      .moveZ(-depth)
  );
};

export default BenchPlane;
