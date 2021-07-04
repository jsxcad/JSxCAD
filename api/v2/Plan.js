import { add, scale, subtract } from '@jsxcad/api-vec3';

import { Shape } from '@jsxcad/api-v1-shape';
import { identityMatrix } from '@jsxcad/math-mat4';
import { taggedPlan } from '@jsxcad/geometry';
import { zag } from '@jsxcad/api-v1-math';

const eachEntry = (geometry, op, otherwise) => {
  for (let nth = geometry.plan.history.length - 1; nth >= 0; nth--) {
    const result = op(geometry.plan.history[nth]);
    if (result !== undefined) {
      return result;
    }
  }
  return otherwise;
};

const find = (geometry, key, otherwise) =>
  eachEntry(
    geometry,
    (entry) => {
      return entry[key];
    },
    otherwise
  );

export const ofPlan = find;

export const getAngle = (geometry) => find(geometry, 'angle', {});
export const getAt = (geometry) => find(geometry, 'at', [0, 0, 0]);
export const getCorner1 = (geometry) => find(geometry, 'corner1', [0, 0, 0]);
export const getCorner2 = (geometry) => find(geometry, 'corner2', [0, 0, 0]);
export const getFrom = (geometry) => find(geometry, 'from', [0, 0, 0]);
export const getMatrix = (geometry) => geometry.matrix || identityMatrix;
export const getTo = (geometry) => find(geometry, 'to', [0, 0, 0]);

const defaultZag = 0.01;

export const getSides = (geometry, otherwise = 32) => {
  const [scale] = getScale(geometry);
  const [length, width] = scale;
  if (defaultZag !== undefined) {
    otherwise = zag(Math.max(length, width) * 2, defaultZag);
  }
  return eachEntry(
    geometry,
    (entry) => {
      if (entry.sides !== undefined) {
        return entry.sides;
      } else if (entry.zag !== undefined) {
        return zag(Math.max(length, width), entry.zag);
      }
    },
    otherwise
  );
};

export const getScale = (geometry) => {
  const corner1 = getCorner1(geometry);
  const corner2 = getCorner2(geometry);
  return [
    scale(0.5, subtract(corner1, corner2)),
    scale(0.5, add(corner1, corner2)),
  ];
};

export const Plan = (type) => Shape.fromGeometry(taggedPlan({}, { type }));

export default Plan;
