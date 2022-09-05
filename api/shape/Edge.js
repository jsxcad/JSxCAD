import {
  fromSegmentToInverseTransform,
  invertTransform,
} from '@jsxcad/algorithm-cgal';
import { taggedSegments, transformCoordinate } from '@jsxcad/geometry';

import Shape from './Shape.js';

export const Edge = (source = 0, target = [0, 0, 1], normal = [1, 0, 0]) => {
  const s = Shape.toCoordinate(undefined, source);
  const t = Shape.toCoordinate(undefined, target);
  const n = Shape.toCoordinate(undefined, normal);
  const inverse = fromSegmentToInverseTransform([s, t], n);
  const baseSegment = [
    transformCoordinate(s, inverse),
    transformCoordinate(t, inverse),
  ];
  const matrix = invertTransform(inverse);
  return Shape.fromGeometry(taggedSegments({ matrix }, [baseSegment]));
};

export default Edge;

Shape.prototype.Edge = Shape.shapeMethod(Edge);
