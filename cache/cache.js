import { deepEqual } from 'fast-equals';
import memoize from 'micro-memoize';

const maxSize = 50;

// This is a very thin abstraction layer to decouple from any particular cache implementation.

export const cache = (op) => memoize(op, { maxSize });

// Transform requires deep equality on the matrix argument;

const isMatchingTransformKey = ([aMatrix, aGeometry], [bMatrix, bGeometry]) => {
  return aGeometry === bGeometry && deepEqual(aMatrix, bMatrix);
};

export const cacheTransform = (op) => memoize(op, { isMatchingKey: isMatchingTransformKey, maxSize });
