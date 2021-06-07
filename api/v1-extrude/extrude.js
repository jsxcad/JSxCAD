import Shape from '@jsxcad/api-v1-shape';
import { extrude as extrudeGeometry } from '@jsxcad/geometry';

export const extrude = (shape, height = 1, depth = 0) => {
  if (height === depth) {
    // Return unextruded geometry at this height, instead.
    return shape.z(height);
  }
  if (height < depth) {
    [height, depth] = [depth, height];
  }
  return Shape.fromGeometry(extrudeGeometry(shape.toGeometry(), height, depth));
};

const extrudeMethod = function (height = 1, depth = 0) {
  return extrude(this, height, depth);
};
Shape.prototype.extrude = extrudeMethod;
Shape.prototype.pull = extrudeMethod;
Shape.prototype.ex = extrudeMethod;

export default extrude;
