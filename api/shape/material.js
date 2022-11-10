import Shape from './Shape.js';

import { hasMaterial } from '@jsxcad/geometry';

export const material = Shape.registerMethod(
  'material',
  (name) => (shape) => Shape.fromGeometry(hasMaterial(shape.toGeometry(), name))
);

export default material;
