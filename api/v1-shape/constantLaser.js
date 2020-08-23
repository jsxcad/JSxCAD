import Shape from './Shape.js';
import { rewriteTags } from '@jsxcad/geometry-tagged';

export const constantLaser = (shape, level) =>
  Shape.fromGeometry(
    rewriteTags([`toolpath/constant_laser`], [], shape.toGeometry())
  );

const constantLaserMethod = function (...args) {
  return constantLaser(this, ...args);
};
Shape.prototype.constantLaser = constantLaserMethod;

export default constantLaser;
