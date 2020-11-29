import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';

// FIX: This name is confusing wrt Shape.sketch().
export const Sketch = (shape) => shape.sketch();

export default Sketch;

Shape.prototype.Sketch = shapeMethod(Sketch);
