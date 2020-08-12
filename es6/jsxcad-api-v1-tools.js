import { Point, Assembly, Toolpath, Cube, Cylinder } from './jsxcad-api-v1-shapes.js';
import Shape, { Shape as Shape$1 } from './jsxcad-api-v1-shape.js';
import { taggedPaths, getNonVoidPaths } from './jsxcad-geometry-tagged.js';
import { toolpath } from './jsxcad-algorithm-toolpath.js';

const BenchPlane = (
  width = 50,
  {
    cutDepth = 0.3,
    cutHeight = 1000,
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
    ...pointset.map((points) => Toolpath(...points)),
    sweep === 'no'
      ? undefined
      : Cube(length, width, cutHeight + cutDepth)
          .benchTop()
          .moveZ(-depth)
          .op((s) => (sweep === 'show' ? s : s.Void()))
  );
};

const BenchSaw = (
  width,
  {
    toolDiameter,
    cutDepth,
    axialRate,
    millingStyle = 'any',
    sweep = 'cut',
  } = {}
) => (length, depth) =>
  BenchPlane(length, {
    toolDiameter,
    cutDepth,
    axialRate,
    millingStyle,
    sweep,
  })(width, depth).moveX(-width);

const DrillPress = (
  diameter = 10,
  { toolDiameter = 3.175, cutDepth = 0.3, sides = 16, sweep = 'cut' } = {}
) => (depth = 0, x = 0, y = 0) => {
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
    Toolpath(...points),
    sweep === 'no'
      ? undefined
      : Cylinder.ofDiameter(diameter, depth)
          .op((s) => (sweep === 'show' ? s : s.Void()))
          .moveZ(depth / -2)
  ).move(x, y);
};

const HoleRouter = (
  depth = 10,
  { toolDiameter = 3.175, cutDepth = 0.3, toolLength = 17, sweep = 'cut' } = {}
) => (shape, x = 0, y = 0, z = 0) => {
  const cuts = Math.ceil(depth / Math.min(depth, cutDepth));
  const actualCutDepth = depth / cuts;
  const design = [];
  const sweeps = [];
  for (const surface of shape.surfaces()) {
    // FIX: This assumes a plunging tool.
    const paths = Shape.fromGeometry(
      taggedPaths(
        { tags: ['path/Toolpath'] },
        toolpath(
          surface.bench(-x, -y, -z).outline().flip().toTransformedGeometry(),
          toolDiameter,
          /* overcut= */ false,
          /* solid= */ true
        )
      )
    );
    for (let cut = 0; cut < cuts; cut++) {
      design.push(paths.moveZ((cut + 1) * -actualCutDepth));
    }
    if (sweep !== 'no') {
      sweeps.push(
        paths
          .sweep(Cylinder.ofDiameter(toolDiameter, depth).moveZ(depth / -2))
          .op((s) => (sweep === 'show' ? s : s.Void()))
      );
    }
  }
  return Assembly(...design, ...sweeps);
};

const LineRouter = (
  depth = 10,
  { toolDiameter = 3.175, cutDepth = 0.3, toolLength = 17, sweep = 'no' } = {}
) => (shape, x = 0, y = 0, z = 0) => {
  const cuts = Math.ceil(depth / Math.min(cutDepth, depth));
  const actualCutDepth = depth / cuts;
  const design = [];
  const sweeps = [];
  for (const { paths } of getNonVoidPaths(
    shape.bench(-x, -y, -z).toDisjointGeometry()
  )) {
    // FIX: This assumes a plunging tool.
    const toolpaths = Shape$1.fromGeometry(
      taggedPaths({ tags: ['path/Toolpath'] }, paths)
    );
    for (let cut = 0; cut < cuts; cut++) {
      design.push(toolpaths.moveZ((cut + 1) * -actualCutDepth));
    }
    if (sweep !== 'no') {
      // Generally a v bit.
      sweeps.push(
        Shape$1.fromGeometry(taggedPaths({}, paths))
          .sweep(Cylinder.ofDiameter(toolDiameter, depth).moveZ(depth / -2))
          .op((s) => (sweep === 'show' ? s : s.Void()))
      );
    }
  }
  return Assembly(...design, ...sweeps);
};

const ProfileRouter = (
  depth = 10,
  { toolDiameter = 3.175, cutDepth = 0.3, toolLength = 17, sweep = 'no' } = {}
) => (shape, x = 0, y = 0, z = 0) => {
  const cuts = Math.ceil(depth / Math.min(cutDepth, depth));
  const actualCutDepth = depth / cuts;
  const design = [];
  const sweeps = [];
  for (const surface of shape.surfaces()) {
    // FIX: This assumes a plunging tool.
    const paths = Shape.fromGeometry(
      taggedPaths(
        { tags: ['path/Toolpath'] },
        toolpath(
          surface.bench(-x, -y, -z).outline().toTransformedGeometry(),
          toolDiameter,
          /* overcut= */ false,
          /* solid= */ true
        )
      )
    );
    for (let cut = 0; cut < cuts; cut++) {
      design.push(paths.moveZ((cut + 1) * -actualCutDepth));
    }
    if (sweep !== 'no') {
      sweeps.push(
        paths
          .sweep(Cylinder.ofDiameter(toolDiameter, depth).moveZ(depth / -2))
          .op((s) => (sweep === 'show' ? s : s.Void()))
      );
    }
  }
  return Assembly(...design, ...sweeps);
};

export { BenchPlane, BenchSaw, DrillPress, HoleRouter, LineRouter, ProfileRouter };
