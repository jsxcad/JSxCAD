import { Assembly, Cylinder } from '@jsxcad/api-v1-shapes';

import Shape from '@jsxcad/api-v1-shape';
import { taggedPaths } from '@jsxcad/geometry-tagged';
import { toolpath } from '@jsxcad/algorithm-toolpath';

export const Jigsaw = (
  depth = 10,
  { toolDiameter = 3.145, cutDepth = 0.3, toolLength = 17 } = {}
) => (shape) => {
  const cuts = Math.ceil(depth / cutDepth);
  const actualCutDepth = depth / cuts;
  const design = [];
  for (const surface of shape.surfaces()) {
    // FIX: This assumes a plunging tool.
    const paths = Shape.fromGeometry(
      taggedPaths(
        { tags: ['path/Toolpath'] },
        toolpath(
          surface.outline().toDisjointGeometry(),
          toolDiameter,
          /* overcut= */ false,
          /* solid= */ true
        )
      )
    );
    for (let cut = 1; cut < cuts; cut++) {
      design.push(paths.moveZ(cut * -actualCutDepth));
    }
  }
  return Assembly(...design).op((s) =>
    s.with(s.sweep(Cylinder.ofDiameter(toolDiameter, cutDepth).bench()))
  );
};

export default Jigsaw;
