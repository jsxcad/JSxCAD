import Shape from './Shape.js';
import { rewriteTags } from '@jsxcad/geometry-tagged';

export const laserPower = (shape, level) =>
  Shape.fromGeometry(
    rewriteTags([`toolpath/laser_power/${level}`], [], shape.toGeometry())
  );

const laserPowerMethod = function (...args) {
  return laserPower(this, ...args);
};
Shape.prototype.laserPower = laserPowerMethod;

export default laserPower;
