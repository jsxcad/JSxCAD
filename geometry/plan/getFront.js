import { getRadius } from './getRadius.js';

const Y = 1;

export const getFront = (plan) => {
  if (typeof plan === 'number') {
    return plan;
  }
  switch (plan.type) {
    case 'edge':
      return plan._at[Y] + plan._high[Y];
    case 'corners':
      return plan._front;
    case 'box':
      return plan._width / 2;
    default:
      return getRadius(plan)[Y];
  }
};
