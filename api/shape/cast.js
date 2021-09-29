import Shape from './Shape.js';
import { projectToPlane as projectToPlaneOfGeometry } from '@jsxcad/geometry';

export const cast =
  (plane = [0, 0, 1, 0], direction = [0, 0, 1, 0]) =>
  (shape) =>
    Shape.fromGeometry(
      projectToPlaneOfGeometry(shape.toGeometry(), plane, direction)
    );

Shape.registerMethod('cast', cast);

export default cast;
