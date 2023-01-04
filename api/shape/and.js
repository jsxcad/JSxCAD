import Shape from './Shape.js';
import { taggedGroup } from '@jsxcad/geometry';

export const And = Shape.registerMethod(
  'And',
  (...shapes) =>
    async (shape) =>
      Shape.fromGeometry(
        taggedGroup({}, ...(await shape.toShapesGeometries(shapes)))
      )
);

export const and = Shape.registerMethod(
  'and',
  (...args) =>
    async (shape) =>
      shape.And(shape, ...args)
);

export default and;
