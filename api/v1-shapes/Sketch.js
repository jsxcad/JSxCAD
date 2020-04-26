import Shape from '@jsxcad/api-v1-shape';

// FIX: This name is confusing wrt Shape.sketch().
export const Sketch = (shape) => shape.Void().with(shape.sketch());

const SketchMethod = function () { return Sketch(this); };
Shape.prototype.Sketch = SketchMethod;

export default Sketch;
