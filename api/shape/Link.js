import Shape from './Shape.js';
import { link as linkGeometry } from '@jsxcad/geometry';
import { toShapesGeometries } from './toShapesGeometries.js';

export const Link = Shape.registerMethod(
  'Link',
  (...shapes) =>
    async (shape) => {
      return Shape.fromGeometry(
        linkGeometry(await toShapesGeometries(shapes)(shape))
      );
    }
);

export default Link;

export const link = Shape.registerMethod(
  'link',
  (...shapes) =>
    async (shape) =>
      Link([shape, ...(await shape.toShapes(shapes))])
);
