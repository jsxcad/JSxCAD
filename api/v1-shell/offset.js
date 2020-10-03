import {
  getNonVoidPaths,
  taggedGroup,
  taggedPaths,
} from '@jsxcad/geometry-tagged';

import { Shape } from '@jsxcad/api-v1-shape';
import { createNormalize3 } from '@jsxcad/algorithm-quantize';
import { deduplicate } from '@jsxcad/geometry-path';
// import { offset as offsetAlgorithm } from '@jsxcad/algorithm-occt';

export const offset = (shape, amount = 1) => {
/*
  const normalize = createNormalize3();
  const offsetPathsets = [];
  for (const { tags, paths } of getNonVoidPaths(shape.toDisjointGeometry())) {
    const offsetPaths = [];
    // Offset each path separately.
    for (const path of paths) {
      offsetPaths.push(
        ...offsetAlgorithm([deduplicate(path.map(normalize))], amount)
      );
    }
    offsetPathsets.push(taggedPaths({ tags }, offsetPaths));
  }
  return Shape.fromGeometry(taggedGroup({}, ...offsetPathsets));
*/
};

const offsetMethod = function (amount) {
  return offset(this, amount);
};
Shape.prototype.offset = offsetMethod;

export default offset;
