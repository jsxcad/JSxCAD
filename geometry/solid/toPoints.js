import { eachPoint } from "./eachPoint";

export const toPoints = (solid) => {
  const points = [];
  eachPoint((point) => points.push(point), solid);
  return points;
};
