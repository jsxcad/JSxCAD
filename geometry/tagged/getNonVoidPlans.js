import { eachNonVoidItem } from "./eachNonVoidItem";

export const getNonVoidPlans = (geometry) => {
  const plans = [];
  eachNonVoidItem(geometry, (item) => {
    if (item.plan) {
      plans.push(item);
    }
  });
  return plans;
};
