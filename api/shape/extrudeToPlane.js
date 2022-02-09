import Shape from './Shape.js';
import { extrudeToPlane as extrudeToPlaneOfGeometry } from '@jsxcad/geometry';

export const extrudeToPlane =
  ({ high, low, direction = [0, 0, 1, 0] }) =>
  (shape) =>
    Shape.fromGeometry(
      extrudeToPlaneOfGeometry(shape.toGeometry(), { high, low, direction })
    );

Shape.registerMethod('extrudeToPlane', extrudeToPlane);

export default extrudeToPlane;
