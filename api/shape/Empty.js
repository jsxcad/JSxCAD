import Shape from './Shape.js';
import { taggedGroup } from '@jsxcad/geometry';

export const Empty = Shape.registerShapeMethod('Empty', (...shapes) =>
  Shape.fromGeometry(taggedGroup({}))
);

export default Empty;
