import Shape from '@jsxcad/api-v1-shape';
import { projectToPlane as projectToPlaneOfGeometry } from '@jsxcad/geometry';

export const projectToPlane = (
  shape,
  plane = [0, 0, 1, 1],
  direction = [0, 0, 1, 0]
) => {
  return Shape.fromGeometry(
    projectToPlaneOfGeometry(shape.toGeometry(), plane, direction)
  );
};

const projectToPlaneMethod = function (plane, direction) {
  return projectToPlane(this, plane, direction);
};
Shape.prototype.projectToPlane = projectToPlaneMethod;

export default projectToPlane;
