import Shape from "@jsxcad/api-v1-shape";
import { dot } from "@jsxcad/math-vec3";
import faceConnector from "./faceConnector";
import { toPlane } from "@jsxcad/geometry-surface";

const X = 0;

export const left = (shape) =>
  shape.connector("left") ||
  faceConnector(
    shape,
    "left",
    (surface) => dot(toPlane(surface), [-1, 0, 0, 0]),
    (point) => -point[X]
  );

const leftMethod = function () {
  return left(this);
};
Shape.prototype.left = leftMethod;

left.signature = "left(shape:Shape) -> Shape";
leftMethod.signature = "Shape -> left() -> Shape";
