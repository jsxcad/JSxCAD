import { add, scale, subtract } from '@jsxcad/math-vec3';

import { identity } from '@jsxcad/math-mat4';

const find = (plan, key, otherwise) => {
  for (let nth = plan.history.length - 1; nth >= 0; nth--) {
    if (plan.history[nth][key] !== undefined) {
      return plan.history[nth][key];
    }
  }
  return otherwise;
};

export const getAngle = (plan) => find(plan, 'angle', {});
export const getAt = (plan) => find(plan, 'at', [0, 0, 0]);
export const getCorner1 = (plan) => find(plan, 'corner1', [0, 0, 0]);
export const getCorner2 = (plan) => find(plan, 'corner2', [0, 0, 0]);
export const getFrom = (plan) => find(plan, 'from', [0, 0, 0]);
export const getMatrix = (plan) => plan.matrix || identity();
export const getTo = (plan) => find(plan, 'to', [0, 0, 0]);
export const getSides = (plan, otherwise = 32) =>
  find(plan, 'sides', otherwise);

export const getScale = (plan) => {
  const corner1 = getCorner1(plan);
  const corner2 = getCorner2(plan);
  return [
    scale(0.5, subtract(corner2, corner1)),
    scale(0.5, add(corner2, corner1)),
  ];
};
