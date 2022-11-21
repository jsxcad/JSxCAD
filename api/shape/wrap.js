import { Group } from './Group.js';
import { Shape } from './Shape.js';
import { wrap as wrapGeometry } from '@jsxcad/geometry';

export const Wrap = Shape.registerShapeMethod(
  'Wrap',
  (offset = 1, alpha = 0.1) =>
    (...shapes) =>
      Group(...shapes).wrap(offset, alpha)
);

export const wrap = Shape.registerMethod(
  'wrap',
  (offset = 1, alpha = 0.1) =>
    async (shape) =>
      Shape.fromGeometry(
        wrapGeometry(await shape.toGeometry(), offset, alpha)
      ).setTags(...(await shape.getTags()))
);

export default wrap;
