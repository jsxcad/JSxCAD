import { eachItem } from './eachItem';

export const getPlans = (geometry) => {
  const plans = [];
  eachItem(geometry, (item) => {
    if (item.type === 'plan') {
      plans.push(item);
    }
  });
  return plans;
};
