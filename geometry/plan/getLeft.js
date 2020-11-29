import { getRadius } from './getRadius.js';

export const getLeft = (plan) => {
  if (typeof plan === 'number') {
    return -plan;
  }
  switch (plan.type) {
    case 'corners':
      return plan.left;
    case 'box':
      return plan.length / -2;
    default:
      return -getRadius(plan);
  }
};
