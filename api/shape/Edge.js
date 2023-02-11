import {
  fromSegmentToInverseTransform,
  invertTransform,
} from '@jsxcad/algorithm-cgal';
import { taggedSegments, transformCoordinate } from '@jsxcad/geometry';

import Shape from './Shape.js';
import { destructure2 } from './destructure.js';

export const Edge = Shape.registerMethod('Edge', (...args) => async (shape) => {
  const [s = [0, 0, 0], t = [0, 0, 0], n = [1, 0, 0]] = await destructure2(
    shape,
    args,
    'coordinate',
    'coordinate',
    'coordinate'
  );
  const inverse = fromSegmentToInverseTransform([s, t], n);
  const baseSegment = [
    transformCoordinate(s, inverse),
    transformCoordinate(t, inverse),
  ];
  const matrix = invertTransform(inverse);
  return Shape.fromGeometry(taggedSegments({ matrix }, [baseSegment]));
});

export default Edge;
