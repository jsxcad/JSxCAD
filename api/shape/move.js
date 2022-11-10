import './toCoordinates.js';

import Group from './Group.js';
import Shape from './Shape.js';
import { fromTranslateToTransform } from '@jsxcad/algorithm-cgal';
import { toCoordinates } from './toCoordinates.js';
import { transform } from './transform.js';

const toCoordinatesOp = Shape.ops.get('toCoordinates');

// TODO: Fix toCoordinates.
export const move = Shape.registerMethod(
  ['move', 'xyz'],
  (...args) =>
    async (shape) => {
      const results = [];
      for (const coordinate of await toCoordinatesOp(...args)(shape)) {
        results.push(await transform(fromTranslateToTransform(...coordinate))(shape));
      }
      return Group(...results);
    }
);

export const xyz = move;

export default move;
