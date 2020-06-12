import { Shape } from "./Shape";
import { negate } from "@jsxcad/math-vec3";

export const turnY = (shape, angle) => {
  const center = shape.measureCenter();
  return shape
    .move(...negate(center))
    .rotateY(angle)
    .move(...center);
};

const turnYMethod = function (angle) {
  return turnY(this, angle);
};
Shape.prototype.turnY = turnYMethod;

export default turnY;
