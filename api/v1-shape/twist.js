import Shape from './Shape.js';
import { twist as twistGeometry } from '@jsxcad/geometry-tagged';

export const twist = (shape, degreesPerZ) =>
  Shape.fromGeometry(twistGeometry(shape.toGeometry(), degreesPerZ));

const twistMethod = function (degreesPerZ) {
  return twist(this, degreesPerZ);
};

Shape.prototype.twist = twistMethod;
