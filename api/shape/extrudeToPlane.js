import Shape from './Shape.js';
import { extrudeToPlane as extrudeToPlaneOfGeometry } from '@jsxcad/geometry';

export const extrudeToPlane =
  (
    highPlane = [0, 0, 1, 1],
    lowPlane = [0, 0, 1, -1],
    direction = [0, 0, 1, 0]
  ) =>
  (shape) =>
    Shape.fromGeometry(
      extrudeToPlaneOfGeometry(
        shape.toGeometry(),
        highPlane,
        lowPlane,
        direction
      )
    );

Shape.registerMethod('extrudeToPlane', extrudeToPlane);

export default extrudeToPlane;
