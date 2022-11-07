import Shape from './Shape.js';

export const Point = Shape.registerShapeMethod('Point', async (...args) =>
  Shape.fromPoint(await Shape.toCoordinate(undefined, ...args)));

export default Point;
