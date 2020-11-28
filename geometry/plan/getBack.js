import { getRadius } from './getRadius.js';

export const getBack = (plan) => {
  if (typeof plan === 'number') {
    return -plan;
  }
  switch (plan.type) {
    case 'corners':
      return plan.back;
    case 'box':
      return plan.length / -2;
    default:
      return -getRadius(plan);
  }
};
