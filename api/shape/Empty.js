import Shape from './Shape.js';
import { taggedGroup } from '@jsxcad/geometry';

export const Empty = Shape.registerMethod(
  'Empty',
  (...shapes) =>
    async (shape) =>
      Shape.fromGeometry(taggedGroup({}))
);

export default Empty;
