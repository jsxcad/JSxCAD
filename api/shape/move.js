import Group from './Group.js';
import Shape from './Shape.js';
import { fromTranslateToTransform } from '@jsxcad/algorithm-cgal';
import { transform } from './transform.js';

// TODO: Fix toCoordinates.
export const move = Shape.registerMethod2(
  ['move', 'xyz'],
  ['input', 'number', 'number', 'number', 'coordinates'],
  async (input, x, y = 0, z = 0, coordinates = []) => {
    const results = [];
    if (x !== undefined) {
      coordinates.push([x || 0, y, z]);
    }
    for (const coordinate of coordinates) {
      results.push(
        await transform(fromTranslateToTransform(...coordinate))(input)
      );
    }
    return Group(...results);
  }
);

export const xyz = move;

export default move;
