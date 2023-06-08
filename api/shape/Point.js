import Shape from './Shape.js';

export const Point = Shape.registerMethod2(
  'Point',
  ['coordinate', 'number', 'number', 'number'],
  (coordinate, x = 0, y = 0, z = 0) => {
    const result = Shape.fromPoint(coordinate || [x, y, z]);
    console.log(`QQQ/Point: ${JSON.stringify(result)}`);
    return result;
  }
);

export default Point;
