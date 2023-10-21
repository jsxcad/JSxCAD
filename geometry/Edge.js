import {
  fromSegmentToInverseTransform,
  invertTransform,
} from '@jsxcad/algorithm-cgal';

import { taggedSegments } from './tagged/taggedSegments.js';
import { transformCoordinate } from './transform.js';

export const Edge = (s = [0, 0, 0], t = [0, 0, 0], n = [1, 0, 0]) => {
  const inverse = fromSegmentToInverseTransform([s, t], n);
  const baseSegment = [
    transformCoordinate(s, inverse),
    transformCoordinate(t, inverse),
  ];
  const matrix = invertTransform(inverse);
  return taggedSegments({ matrix }, [baseSegment]);
};
