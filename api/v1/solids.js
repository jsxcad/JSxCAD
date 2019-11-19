import Shape from './Shape';
import { getSolids } from '@jsxcad/geometry-tagged';

export const solids = (shape) => {
  const solids = [];
  for (const solid of getSolids(shape.toKeptGeometry())) {
    solids.push(Shape.fromGeometry(solid));
  }
  return solids;
};

const solidsMethod = function () { return solids(this); };
Shape.prototype.solids = solidsMethod;

export default solids;
