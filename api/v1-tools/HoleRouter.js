import { Assembly, Cylinder } from '@jsxcad/api-v1-shapes';

import Shape from '@jsxcad/api-v1-shape';
import { taggedPaths } from '@jsxcad/geometry-tagged';
import { toolpath } from '@jsxcad/algorithm-toolpath';

export const HoleRouter = (
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

export default HoleRouter;
