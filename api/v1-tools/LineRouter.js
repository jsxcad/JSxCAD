import { Assembly, Cylinder, Point } from '@jsxcad/api-v1-shapes';
import { getNonVoidPaths, taggedPaths } from '@jsxcad/geometry-tagged';

import { Shape } from '@jsxcad/api-v1-shape';

export const LineRouter = (
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
    const toolpaths = Shape.fromGeometry(
      taggedPaths({ tags: ['path/Toolpath'] }, paths)
    );
    for (let cut = 0; cut < cuts; cut++) {
      design.push(toolpaths.moveZ((cut + 1) * -actualCutDepth));
    }
    if (sweep !== 'no') {
      // Generally a v bit.
      sweeps.push(
        Shape.fromGeometry(taggedPaths({}, paths))
          .sweep(Cylinder.ofDiameter(toolDiameter, depth).moveZ(depth / -2))
          .op((s) => (sweep === 'show' ? s : s.hole()))
      );
    }
  }
  return Assembly(
    Point(x, y, 0), // Add a zero point for rebenching.
    ...design,
    ...sweeps
  );
};

export default LineRouter;
