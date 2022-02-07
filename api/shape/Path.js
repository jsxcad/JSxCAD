import Shape from './Shape.js';
import { eachPoint } from '@jsxcad/geometry';

export const fromVec3 = (...points) =>
  Shape.fromOpenPath(points.map(([x = 0, y = 0, z = 0]) => [x, y, z]));

export const fromPoints = (...shapes) => {
  const vec3List = [];
  for (const shape of shapes) {
    eachPoint(shape.toGeometry(), (vec3) => vec3List.push(vec3));
  }
  return fromVec3(...vec3List);
};

export const Path = (...points) => fromPoints(...points);
Path.fromVec3 = fromVec3;

export default Path;

Shape.prototype.Path = Shape.shapeMethod(Path);
