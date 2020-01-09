import Shape from './Shape';
import { clean } from '@jsxcad/geometry-solid';
import { getSolids } from '@jsxcad/geometry-tagged';

export const defragment = (shape) => {
  const assembly = [];
  for (const { solid } of getSolids(shape.toKeptGeometry())) {
    assembly.push({ solid: clean(solid) });
  }
  return Shape.fromGeometry({ assembly });
};

const defragmentMethod = function () { return defragment(this); };
Shape.prototype.defragment = defragmentMethod;

export default defragment;
