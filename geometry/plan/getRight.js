import { getRadius } from './getRadius.js';

export const getRight = (plan) => {
  if (typeof plan === 'number') {
    return plan;
  }
  switch (plan.type) {
    case 'corners':
      return plan.right;
    case 'box':
      return plan.length / 2;
    default:
      return getRadius(plan);
  }
};
