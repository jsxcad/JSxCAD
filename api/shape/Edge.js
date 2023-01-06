import {
  fromSegmentToInverseTransform,
  invertTransform,
} from '@jsxcad/algorithm-cgal';
import { taggedSegments, transformCoordinate } from '@jsxcad/geometry';

import Shape from './Shape.js';
import { toCoordinate } from './toCoordinate.js';

export const Edge = Shape.registerMethod(
  'Edge',
  (source = [0, 0, 0], target = [0, 0, 1], normal = [1, 0, 0], rubbish) =>
    async (shape) => {
      const s = await toCoordinate(source)(shape);
      const t = await toCoordinate(target)(shape);
      const n = await toCoordinate(normal)(shape);
      const inverse = fromSegmentToInverseTransform([s, t], n);
      const baseSegment = [
        transformCoordinate(s, inverse),
        transformCoordinate(t, inverse),
      ];
      const matrix = invertTransform(inverse);
      return Shape.fromGeometry(taggedSegments({ matrix }, [baseSegment]));
    }
);

export default Edge;
