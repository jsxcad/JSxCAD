import Shape from './Shape';
import { getSolids } from '@jsxcad/geometry-tagged';
import { makeSurfacesConvex } from '@jsxcad/geometry-solid';

export const defragment = (shape) => {
  const assembly = [];
  for (const { solid } of getSolids(shape.toKeptGeometry())) {
    assembly.push({ solid: makeSurfacesConvex(solid) });
  }
  return Shape.fromGeometry({ assembly });
}

const defragmentMethod = function () { return defragment(this); };
Shape.prototype.defragment = defragmentMethod;

export default defragment;
