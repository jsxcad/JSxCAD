import Shape from './Shape.js';
import { remesh as remeshGeometry } from '@jsxcad/geometry-tagged';

export const remesh = (shape, options = {}) =>
  Shape.fromGeometry(remeshGeometry(shape.toGeometry(), options));

const remeshMethod = function (options) {
  return remesh(this, options);
};

Shape.prototype.remesh = remeshMethod;
