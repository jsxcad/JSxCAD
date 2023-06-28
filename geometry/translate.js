import { fromTranslateToTransform } from '@jsxcad/algorithm-cgal';

import { transform } from './tagged/transform.js';

export const translate = (geometry, vector) =>
  transform(geometry, fromTranslateToTransform(...vector));
