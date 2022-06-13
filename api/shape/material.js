import Shape from './Shape.js';

import { hasMaterial } from '@jsxcad/geometry';

export const material = Shape.chainable(
  (name) => (shape) => Shape.fromGeometry(hasMaterial(shape.toGeometry(), name))
);

Shape.registerMethod('material', material);

export default material;
