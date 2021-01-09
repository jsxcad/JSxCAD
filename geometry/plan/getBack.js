import { getRadius } from './getRadius.js';

const Y = 1;

export const getBack = (plan) => {
  if (typeof plan === 'number') {
    return -plan;
  }
  switch (plan.type) {
    case 'edge':
      return plan._at[Y] + plan._low[Y];
    case 'corners':
      return plan._back;
    case 'box':
      return plan._width / -2;
    default:
      return -getRadius(plan)[Y];
  }
};
