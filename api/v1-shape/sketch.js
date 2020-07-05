import Shape from './Shape.js';
import assemble from './assemble.js';
import { taggedSketch } from '@jsxcad/geometry-tagged';

export const sketch = (shape) =>
  Shape.fromGeometry(taggedSketch({}, shape.toGeometry()));

Shape.prototype.sketch = function () {
  return sketch(this);
};

Shape.prototype.withSketch = function () {
  return assemble(this, sketch(this));
};

export default sketch;
