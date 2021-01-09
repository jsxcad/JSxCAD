import { getRadius } from './getRadius.js';

const X = 0;

export const getLeft = (plan) => {
  if (typeof plan === 'number') {
    return -plan;
  }
  switch (plan.type) {
    case 'edge':
      return plan._at[X] + plan._low[X];
    case 'corners':
      return plan._left;
    case 'box':
      return plan._length / -2;
    default:
      return -getRadius(plan)[X];
  }
};
