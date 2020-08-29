import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';
import Path from './Path.js';

export const Toolpath = (...points) =>
  Path(...points).setTags(['path/Toolpath']);

export default Toolpath;

Shape.prototype.Toolpath = shapeMethod(Toolpath);
