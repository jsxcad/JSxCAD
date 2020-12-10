import {
  inset as insetGeometry,
  offset as offsetGeometry,
} from '@jsxcad/geometry-tagged';

import { Shape } from '@jsxcad/api-v1-shape';

export const offset = (shape, initial = 1, step, limit) =>
  Shape.fromGeometry(offsetGeometry(shape.toGeometry(), initial, step, limit));

const offsetMethod = function (initial, step, limit) {
  return offset(this, initial, step, limit);
};

Shape.prototype.offset = offsetMethod;

export default offset;

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
