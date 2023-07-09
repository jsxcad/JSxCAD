import Group from './Group.js';
import Shape from './Shape.js';

export const op = Shape.registerMethod3(
  'op',
  ['inputGeometry', 'functions'],
  (geometry) => geometry,
  async (geometry, [_, functions]) => {
    const input = Shape.chain(Shape.fromGeometry(geometry));
    const results = [];
    for (const fun of functions) {
      results.push(await Shape.apply(input, fun, input));
    }
    return Group(...results);
  }
);
