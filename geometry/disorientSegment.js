import {
  fromSegmentToInverseTransform,
  invertTransform,
  toApproximateMatrix,
} from '@jsxcad/algorithm-cgal';

import { subtract } from './vector.js';
import { taggedSegments } from './tagged/taggedSegments.js';
import { transformCoordinate } from './transform.js';

const SOURCE = 0;
const TARGET = 1;

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
  const approximateInverse = toApproximateMatrix(inverse)[1];
  const oppositeInverse = fromSegmentToInverseTransform(
    absoluteOppositeSegment,
    absoluteNormal
  );
  const approximateOppositeInverse = toApproximateMatrix(inverse)[1];
  const baseSegment = [
    transformCoordinate(absoluteSegment[SOURCE], approximateInverse),
    transformCoordinate(absoluteSegment[TARGET], approximateInverse),
  ];
  const oppositeSegment = [
    transformCoordinate(absoluteSegment[TARGET], approximateOppositeInverse),
    transformCoordinate(absoluteSegment[SOURCE], approximateOppositeInverse),
  ];
  const inverseMatrix = invertTransform(inverse);
  const oppositeInverseMatrix = invertTransform(oppositeInverse);

  return [
    taggedSegments({ matrix: inverseMatrix }, [baseSegment]),
    taggedSegments({ matrix: oppositeInverseMatrix }, [oppositeSegment]),
  ];
};
