import { eachItem } from "./eachItem";

export const getPlans = (geometry) => {
  const plans = [];
  eachItem(geometry, (item) => {
    if (item.plan) {
      plans.push(item);
    }
  });
  return plans;
};
