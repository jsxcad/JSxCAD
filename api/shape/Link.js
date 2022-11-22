import Shape from './Shape.js';
import { link as linkGeometry } from '@jsxcad/geometry';
import { toShapesGeometries } from './toShapesGeometries.js';

export const Link = Shape.registerShapeMethod('Link', async (...shapes) =>
  Shape.fromGeometry(linkGeometry(await toShapesGeometries(shapes)(null)))
);

export default Link;

export const link = Shape.registerMethod(
  'link',
  (...shapes) =>
    (shape) =>
      Link([shape, ...shape.toShapes(shapes)])
);
