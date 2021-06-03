import Shape from './Shape.js';
import { inset as insetGeometry } from '@jsxcad/geometry';

export const inset = (shape, initial = 1, step, limit) =>
  Shape.fromGeometry(insetGeometry(shape.toGeometry(), initial, step, limit));

const insetMethod = function (initial, step, limit) {
  return inset(this, initial, step, limit);
};

Shape.prototype.inset = insetMethod;

// CHECK: Using 'with' for may be confusing, but andInset looks odd.
const withInsetMethod = function (initial, step, limit) {
  return this.group(inset(this, initial, step, limit));
};

Shape.prototype.withInset = withInsetMethod;
