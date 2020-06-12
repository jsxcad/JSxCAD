import { Shape, toKeptGeometry } from "./Shape";

/**
 *
 * # Kept
 *
 * Kept produces a geometry without dropped elements.
 *
 **/

export const kept = (shape) => Shape.fromGeometry(toKeptGeometry(shape));

const keptMethod = function () {
  return kept(this);
};
Shape.prototype.kept = keptMethod;

kept.signature = "kept(shape:Shape) -> Shape";
keptMethod.signature = "Shape -> kept() -> Shape";

export default kept;
