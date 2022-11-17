import Shape from './Shape.js';

export const toCoordinate = Shape.registerMethod('toCoordinate', (x = 0, y = 0, z = 0) => async (shape) => {
  if (Shape.isFunction(x)) {
    x = await x(shape);
  }
  if (Shape.isShape(x)) {
    const points = await x.toPoints();
    if (points.length >= 1) {
      return points[0];
    } else {
      throw Error(`Unexpected coordinate value: ${JSON.stringify(x)}`);
    }
  } else if (Shape.isArray(x)) {
    return x;
  } else if (typeof x === 'number') {
    if (typeof y !== 'number') {
      throw Error(`Unexpected coordinate value: ${JSON.stringify(y)}`);
    }
    if (typeof z !== 'number') {
      throw Error(`Unexpected coordinate value: ${JSON.stringify(z)}`);
    }
    return [x, y, z];
  } else {
    throw Error(`Unexpected coordinate value: ${JSON.stringify(x)}`);
  }
});
