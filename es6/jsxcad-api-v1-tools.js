import { Point, Toolpath, Cube, Cylinder, Assembly } from './jsxcad-api-v1-shapes.js';
import Shape from './jsxcad-api-v1-shape.js';
import { taggedPaths } from './jsxcad-geometry-tagged.js';
import { toolpath } from './jsxcad-algorithm-toolpath.js';

const BenchPlane = ({
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
    .with(Cylinder.ofDiameter(diameter, depth).Void().moveZ(depth / -2))
    .move(x, y);
};

const Jigsaw = (
  depth = 10,
  { toolDiameter = 3.145, cutDepth = 0.3, toolLength = 17 } = {}
) => (shape) => {
  const cuts = Math.ceil(depth / cutDepth);
  const actualCutDepth = depth / cuts;
  const design = [];
  const sweep = [];
  for (const surface of shape.surfaces()) {
    const edge = surface.outline();
    // FIX: This assumes a plunging tool.
    const paths = Shape.fromGeometry(
      taggedPaths(
        { tags: ['path/Toolpath'] },
        toolpath(
          edge.toTransformedGeometry(),
          toolDiameter,
          /* overcut= */ false,
          /* solid= */ true
        )
      )
    );
    for (let cut = 1; cut < cuts; cut++) {
      design.push(paths.moveZ(cut * -actualCutDepth));
    }
    sweep.push(edge.sweep(Cylinder.ofDiameter(toolDiameter, depth).bench()).Void());
  }
  return Assembly(...design, ...sweep);
};

const Router = (
  depth = 10,
  { toolDiameter = 3.145, cutDepth = 0.3, toolLength = 17 } = {}
) => (shape) => {
  const cuts = Math.ceil(depth / cutDepth);
  const actualCutDepth = depth / cuts;
  const design = [];
  const sweep = [];
  for (const surface of shape.surfaces()) {
    const edge = surface.outline().flip();
    // FIX: This assumes a plunging tool.
    const paths = Shape.fromGeometry(
      taggedPaths(
        { tags: ['path/Toolpath'] },
        toolpath(
          edge.toTransformedGeometry(),
          toolDiameter,
          /* overcut= */ false,
          /* solid= */ true
        )
      )
    );
    for (let cut = 1; cut < cuts; cut++) {
      design.push(paths.moveZ(cut * -actualCutDepth));
    }
    sweep.push(edge.sweep(Cylinder.ofDiameter(toolDiameter, depth).bench()).Void());
  }
  return Assembly(...design, ...sweep);
};

export { BenchPlane, DrillPress, Jigsaw, Router };
