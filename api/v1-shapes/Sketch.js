import Shape from '@jsxcad/api-v1-shape';
import { rewriteTags } from '@jsxcad/geometry-tagged';

export const Sketch = (shape) => shape.Void().with(shape.sketch());

const SketchMethod = function () { return Sketch(this); };
Shape.prototype.Sketch = SketchMethod;

export default Sketch;
