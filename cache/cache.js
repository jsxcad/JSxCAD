import { deepEqual } from 'fast-equals';
import memoizeImpl from 'micro-memoize';

const memoizedOps = new Set();

const memoize = (op, options) => {
  const memoizedOp = memoizeImpl(op, options);
  memoizedOps.add(memoizedOp);
  return memoizedOp;
};

export const clearCache = () => {
  for (const memoizedOp of memoizedOps) {
    const cache = memoizedOp.cache;
    cache.keys.length = 0;
    cache.values.length = 0;
  }
};

// This is a very thin abstraction layer to decouple from any particular cache implementation.

const maxSize = 500;

// Keyed by identity

export const cache = (op) => memoize(op, { maxSize });

// Keyed by matrix structure and geometry identity.

const isMatchingTransformKey = ([aMatrix, aGeometry], [bMatrix, bGeometry]) =>
  aGeometry === bGeometry && deepEqual(aMatrix, bMatrix);

export const cacheTransform = (op) => memoize(op, { isMatchingKey: isMatchingTransformKey, maxSize });

// Keyed by tag-list and geometry identity.

const isMatchingRewriteTagsKey = ([aAdd, aRemove, aGeometry, aConditionTags, aConditionSpec],
                                  [bAdd, bRemove, bGeometry, bConditionTags, bConditionSpec]) =>
  aGeometry === bGeometry && aConditionSpec === bConditionSpec && deepEqual(aConditionTags, bConditionTags) && deepEqual(aAdd, bAdd) && deepEqual(aRemove, bRemove);

export const cacheRewriteTags = (op) => memoize(op, { isMatchingKey: isMatchingRewriteTagsKey, maxSize });

// Keyed by plane structure and geometry identity.

const isMatchingCutKey = ([aPlane, aGeometry], [bPlane, bGeometry]) =>
  aGeometry === bGeometry && deepEqual(aPlane, bPlane);

export const cacheCut = (op) => memoize(op, { isMatchingKey: isMatchingCutKey, maxSize });

// Keyed by points structure.

const isMatchingPointsKey = ([aPoints], [bPoints]) => deepEqual(aPoints, bPoints);

export const cachePoints = (op) => memoize(op, { isMatchingKey: isMatchingPointsKey, maxSize });
