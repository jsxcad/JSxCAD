import { getRadius } from './getRadius.js';

export const getFront = (plan) => {
  if (typeof plan === 'number') {
    return plan;
  }
  switch (plan.type) {
    case 'corners':
      return plan.front;
    case 'box':
      return plan.width / 2;
    default:
      return getRadius(plan);
  }
};
