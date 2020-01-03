import { Shape, assemble } from '@jsxcad/api-v1-shape';

import Plan from '@jsxcad/api-v1-plan';

export const Sketch = (shape) => {
  return Plan({
    plan: { sketch: 'shape' },
    visualization: shape.outline().color('red')
  });
};
Plan.Sketch = Sketch;

Shape.prototype.sketch = function (...args) { return Sketch(this); };
Shape.prototype.withSketch = function (...args) { return assemble(this, Sketch(this)); };

export default Sketch;
