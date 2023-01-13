import {
  fromSegmentToInverseTransform,
  invertTransform,
} from '@jsxcad/algorithm-cgal';

import { taggedSegments } from './tagged/taggedSegments.js';
import { transformCoordinate } from './transform.js';

const SOURCE = 0;
const TARGET = 1;

export const length = ([ax, ay, az], [bx, by, bz]) => {
  const x = bx - ax;
  const y = by - ay;
  const z = bz - az;
  return Math.sqrt(x * x + y * y + z * z);
};

export const subtract = ([ax, ay, az], [bx, by, bz]) => [
  ax - bx,
  ay - by,
  az - bz,
];

export const disorientSegment = (segment, matrix, normal) => {
  const absoluteSegment = [
    transformCoordinate(segment[SOURCE], matrix),
    transformCoordinate(segment[TARGET], matrix),
  ];
  const absoluteOppositeSegment = [
    transformCoordinate(segment[TARGET], matrix),
    transformCoordinate(segment[SOURCE], matrix),
  ];
  const absoluteNormal = normal
    ? subtract(transformCoordinate(normal, matrix), absoluteSegment[SOURCE])
    : [0, 0, 1];
  const inverse = fromSegmentToInverseTransform(
    absoluteSegment,
    absoluteNormal
  );
  const oppositeInverse = fromSegmentToInverseTransform(
    absoluteOppositeSegment,
    absoluteNormal
  );
  const baseSegment = [
    transformCoordinate(absoluteSegment[SOURCE], inverse),
    transformCoordinate(absoluteSegment[TARGET], inverse),
  ];
  const oppositeSegment = [
    transformCoordinate(absoluteSegment[TARGET], oppositeInverse),
    transformCoordinate(absoluteSegment[SOURCE], oppositeInverse),
  ];
  const inverseMatrix = invertTransform(inverse);
  const oppositeInverseMatrix = invertTransform(oppositeInverse);

  return [
    taggedSegments({ matrix: inverseMatrix }, [baseSegment]),
    taggedSegments({ matrix: oppositeInverseMatrix }, [oppositeSegment]),
  ];
};
