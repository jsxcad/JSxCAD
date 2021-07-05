import Shape from './Shape.js';
import { taggedGroup } from '@jsxcad/geometry';

export const Empty = (...shapes) => Shape.fromGeometry(taggedGroup({}));

export default Empty;

Shape.prototype.Empty = Shape.shapeMethod(Empty);
