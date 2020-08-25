import { Assembly, Cylinder, Point } from '@jsxcad/api-v1-shapes';

import Shape from '@jsxcad/api-v1-shape';
import { taggedPaths } from '@jsxcad/geometry-tagged';
import { toolpath } from '@jsxcad/algorithm-toolpath';

export const ProfileRouter = (
  depth = 10,
  { toolDiameter = 3.175, cutDepth = 0.3, toolLength = 17, sweep = 'no' } = {}
) => (shape, x = 0, y = 0, z = 0) => {
  const cuts = Math.ceil(depth / Math.min(cutDepth, depth));
  const actualCutDepth = depth / cuts;
  const design = [];
  const sweeps = [];
  let shapes = [];
  for (const surface of shape.surfaces()) {
    shapes.push(surface.outline());
  }
  for (const paths of shape.paths()) {
    shapes.push(paths);
  }
  for (const shape of shapes) {
    // FIX: This assumes a plunging tool.
    const paths = Shape.fromGeometry(
      taggedPaths(
        { tags: ['path/Toolpath'] },
        toolpath(
          shape.bench(-x, -y, -z).toTransformedGeometry(),
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
  return Assembly(
    Point(x, y, 0), // Add a zero point for rebenching.
    ...design,
    ...sweeps
  );
};

export default ProfileRouter;
