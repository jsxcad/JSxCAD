import Shape from './Shape.js';
import { rewriteTags } from '@jsxcad/geometry-tagged';

export const spindleRpm = (shape, rpm) =>
  Shape.fromGeometry(
    rewriteTags([`toolpath/spindle_rpm/${rpm}`], [], shape.toGeometry())
  );

const spindleRpmMethod = function (...args) {
  return spindleRpm(this, ...args);
};
Shape.prototype.spindleRpm = spindleRpmMethod;

export default spindleRpm;
