import { getRadius } from './getRadius.js';

export const getBottom = (plan) => {
  if (typeof plan === 'number') {
    return -plan;
  }
  switch (plan.type) {
    default:
      return -getRadius(plan);
  }
};
