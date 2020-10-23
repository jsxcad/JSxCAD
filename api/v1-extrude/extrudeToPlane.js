import Shape from '@jsxcad/api-v1-shape';
import { extrudeToPlane as extrudeToPlaneOfGeometry } from '@jsxcad/geometry-tagged';

export const extrudeToPlane = (
  shape,
  highPlane = [0, 0, 1, 1],
  lowPlane = [0, 0, 1, -1]
) => {
  return Shape.fromGeometry(
    extrudeToPlaneOfGeometry(shape.toGeometry(), highPlane, lowPlane)
  );
};

const extrudeToPlaneMethod = function (highPlane, lowPlane) {
  return extrudeToPlane(this, highPlane, lowPlane);
};
Shape.prototype.extrudeToPlane = extrudeToPlaneMethod;

export default extrudeToPlane;
