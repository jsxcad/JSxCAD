import { Shape } from "./Shape";
import { intersection } from "./intersection";

const clipFromMethod = function (shape) {
  return intersection(shape, this);
};
Shape.prototype.clipFrom = clipFromMethod;

clipFromMethod.signature = "Shape -> clipFrom(...to:Shape) -> Shape";
