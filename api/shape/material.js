import Shape from './Shape.js';

import { rewriteTags } from '@jsxcad/geometry';
import { toTagsFromName } from '@jsxcad/algorithm-material';

export const material = Shape.chainable(
  (name) => (shape) =>
    Shape.fromGeometry(
      rewriteTags(toTagsFromName(name), [], shape.toGeometry())
    )
);

Shape.registerMethod('material', material);

export default material;
