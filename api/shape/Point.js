import Shape from './Shape.js';

export const Point = Shape.registerMethod2(
  'Point',
  ['coordinate', 'number', 'number', 'number'],
  (coordinate, x = 0, y = 0, z = 0) => Shape.fromPoint(coordinate || [x, y, z])
);

export default Point;
