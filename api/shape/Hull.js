import Shape from './Shape.js';
import { convexHull } from '@jsxcad/geometry';
import { toShapesGeometries } from './toShapesGeometries.js';

export const Hull = Shape.registerMethod(
  'Hull',
  (...shapes) =>
    async (shape) =>
      Shape.fromGeometry(convexHull(await toShapesGeometries(shapes)(shape)))
);

export const hull = Shape.registerMethod(
  'hull',
  (...shapes) =>
    async (shape) =>
      Hull(shape, ...shapes)(shape)
);

export default Hull;
