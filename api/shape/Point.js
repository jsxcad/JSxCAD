import Shape from './Shape.js';
import { toCoordinate } from './toCoordinate.js';

export const Point = Shape.registerShapeMethod('Point', async (...args) =>
  Shape.fromPoint(await toCoordinate(...args)(null))
);

export default Point;
