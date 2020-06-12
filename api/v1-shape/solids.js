import Shape from "./Shape";
import { getSolids } from "@jsxcad/geometry-tagged";

export const solids = (shape, xform = (_) => _) => {
  const solids = [];
  for (const solid of getSolids(shape.toKeptGeometry())) {
    solids.push(xform(Shape.fromGeometry(solid)));
  }
  return solids;
};

const solidsMethod = function (...args) {
  return solids(this, ...args);
};
Shape.prototype.solids = solidsMethod;

export default solids;
