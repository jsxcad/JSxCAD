import Shape from './Shape.js';
import { projectToPlane as projectToPlaneOfGeometry } from '@jsxcad/geometry';

export const projectToPlane =
  (plane = [0, 0, 1, 1], direction = [0, 0, 1, 0]) =>
  (shape) =>
    Shape.fromGeometry(
      projectToPlaneOfGeometry(shape.toGeometry(), plane, direction)
    );

Shape.registerMethod('projectToPlane', projectToPlane);

export default projectToPlane;
