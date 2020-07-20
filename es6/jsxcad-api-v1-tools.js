import { Point, Assembly, Toolpath, Cube, Cylinder } from './jsxcad-api-v1-shapes.js';
import Shape from './jsxcad-api-v1-shape.js';
import { taggedPaths } from './jsxcad-geometry-tagged.js';
import { toolpath } from './jsxcad-algorithm-toolpath.js';

const BenchPlane = (
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

const BenchSaw = (
  width,
  { toolDiameter, cutDepth, axialRate, millingStyle = 'any' } = {}
) => (length, depth) =>
  BenchPlane(length, { toolDiameter, cutDepth, axialRate, millingStyle })(
    width,
    depth
  ).moveX(-width);

const DrillPress = (
  diameter = 10,
  { toolDiameter = 3.145, cutDepth = 0.3, sides = 16 } = {}
) => (depth = 0, x = 0, y = 0) => {
  const radius = diameter / 2;
  const points = [];
  const toolRadius = toolDiameter / 2;
  const cuts = Math.ceil(depth / cutDepth);
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
  return Toolpath(...points)
    .with(
      Cylinder.ofDiameter(diameter, depth)
        .Void()
        .moveZ(depth / -2)
    )
    .move(x, y);
};

const HoleRouter = (
  depth = 10,
  { toolDiameter = 3.145, cutDepth = 0.3, toolLength = 17 } = {}
) => (shape) => {
  const cuts = Math.ceil(depth / cutDepth);
  const actualCutDepth = depth / cuts;
  const design = [];
  const sweep = [];
  for (const surface of shape.surfaces()) {
    // FIX: This assumes a plunging tool.
    const paths = Shape.fromGeometry(
      taggedPaths(
        { tags: ['path/Toolpath'] },
        toolpath(
          surface.outline().flip().toTransformedGeometry(),
          toolDiameter,
          /* overcut= */ false,
          /* solid= */ true
        )
      )
    );
    for (let cut = 1; cut < cuts; cut++) {
      design.push(paths.moveZ(cut * -actualCutDepth));
    }
    sweep.push(
      paths
        .sweep(Cylinder.ofDiameter(toolDiameter, depth).moveZ(depth / -2))
        .Void()
    );
  }
  return Assembly(...design, ...sweep);
};

const ProfileRouter = (
  depth = 10,
  { toolDiameter = 3.145, cutDepth = 0.3, toolLength = 17 } = {}
) => (shape) => {
  const cuts = Math.ceil(depth / cutDepth);
  const actualCutDepth = depth / cuts;
  const design = [];
  const sweep = [];
  for (const surface of shape.surfaces()) {
    // FIX: This assumes a plunging tool.
    const paths = Shape.fromGeometry(
      taggedPaths(
        { tags: ['path/Toolpath'] },
        toolpath(
          surface.outline().toTransformedGeometry(),
          toolDiameter,
          /* overcut= */ false,
          /* solid= */ true
        )
      )
    );
    for (let cut = 1; cut < cuts; cut++) {
      design.push(paths.moveZ(cut * -actualCutDepth));
    }
    sweep.push(
      paths
        .sweep(Cylinder.ofDiameter(toolDiameter, depth).moveZ(depth / -2))
        .Void()
    );
  }
  return Assembly(...design, ...sweep);
};

export { BenchPlane, BenchSaw, DrillPress, HoleRouter, ProfileRouter };
