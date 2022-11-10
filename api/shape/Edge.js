import './toCoordinate.js';

import {
  fromSegmentToInverseTransform,
  invertTransform,
} from '@jsxcad/algorithm-cgal';
import { taggedSegments, transformCoordinate } from '@jsxcad/geometry';

import Shape from './Shape.js';

const toCoordinateOp = Shape.ops.get('toCoordinate');

export const Edge = Shape.registerShapeMethod(
  'Edge',
  async (source = 0, target = [0, 0, 1], normal = [1, 0, 0]) => {
    const s = await toCoordinateOp(source)();
    const t = await toCoordinateOp(target)();
    const n = await toCoordinateOp(normal)();
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
