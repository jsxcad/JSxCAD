import Shape from '@jsxcad/api-v1-shape';
import { extrudeToPlane as extrudeToPlaneOfGeometry } from '@jsxcad/geometry';

export const extrudeToPlane = (
  shape,
  highPlane = [0, 0, 1, 1],
  lowPlane = [0, 0, 1, -1],
  direction = [0, 0, 1, 0]
) => {
  return Shape.fromGeometry(
    extrudeToPlaneOfGeometry(shape.toGeometry(), highPlane, lowPlane, direction)
  );
};

const extrudeToPlaneMethod = function (highPlane, lowPlane, direction) {
  return extrudeToPlane(this, highPlane, lowPlane, direction);
};
Shape.prototype.extrudeToPlane = extrudeToPlaneMethod;

export default extrudeToPlane;
