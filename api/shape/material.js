import Shape from './Shape.js';

import { hasMaterial } from '@jsxcad/geometry';

export const material = Shape.registerMethod(
  'material',
  (name) => async (shape) => Shape.fromGeometry(hasMaterial(await shape.toGeometry(), name))
);

export default material;
