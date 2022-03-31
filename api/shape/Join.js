import Group from './Group.js';
import Shape from './Shape.js';
import { fuse } from '@jsxcad/geometry';

export const Join = (...shapes) =>
  Shape.fromGeometry(fuse(Group(...shapes).toGeometry()));

export default Join;

Shape.prototype.Join = Shape.shapeMethod(Join);
