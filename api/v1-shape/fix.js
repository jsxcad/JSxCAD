import Shape from './Shape.js';
import { fix as fixGeometry } from '@jsxcad/geometry-tagged';

const fix = (shape) => Shape.fromGeometry(fixGeometry(shape.toGeometry()));

const fixMethod = function () {
  return fix(this);
};
Shape.prototype.fix = fixMethod;
