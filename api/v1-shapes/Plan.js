import { add, scale, subtract } from '@jsxcad/math-vec3';

import { Shape } from '@jsxcad/api-v1-shape';
import { identity } from '@jsxcad/math-mat4';
import { taggedPlan } from '@jsxcad/geometry-tagged';
import { zag } from '@jsxcad/api-v1-math';

const eachEntry = (plan, op, otherwise) => {
  for (let nth = plan.history.length - 1; nth >= 0; nth--) {
    const result = op(plan.history[nth]);
    if (result !== undefined) {
      return result;
    }
  }
  return otherwise;
};

const find = (plan, key, otherwise) =>
  eachEntry(
    plan,
    (entry) => {
      return entry[key];
    },
    otherwise
  );

export const ofPlan = find;

export const getAngle = (plan) => find(plan, 'angle', {});
export const getAt = (plan) => find(plan, 'at', [0, 0, 0]);
export const getCorner1 = (plan) => find(plan, 'corner1', [0, 0, 0]);
export const getCorner2 = (plan) => find(plan, 'corner2', [0, 0, 0]);
export const getFrom = (plan) => find(plan, 'from', [0, 0, 0]);
export const getMatrix = (plan) => plan.matrix || identity();
export const getTo = (plan) => find(plan, 'to', [0, 0, 0]);

const defaultZag = 0.01;

export const getSides = (plan, otherwise = 32) => {
  const [scale] = getScale(plan);
  const [length, width] = scale;
  if (defaultZag !== undefined) {
    otherwise = zag(Math.max(length, width) * 2, defaultZag);
  }
  return eachEntry(
    plan,
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

export const getScale = (plan) => {
  const corner1 = getCorner1(plan);
  const corner2 = getCorner2(plan);
  return [
    scale(0.5, subtract(corner1, corner2)),
    scale(0.5, add(corner1, corner2)),
  ];
};

export const Plan = (type) => Shape.fromGeometry(taggedPlan({}, { type }));

export default Plan;
