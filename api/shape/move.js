import { Group, translate } from '@jsxcad/geometry';

import Shape from './Shape.js';

export const move = Shape.registerMethod3(
  ['move', 'xyz'],
  ['inputGeometry', 'number', 'number', 'number', 'coordinates'],
  (geometry, x, y = 0, z = 0, coordinates = []) => {
    const results = [];
    if (x !== undefined) {
      coordinates.push([x || 0, y, z]);
    }
    for (const coordinate of coordinates) {
      results.push(translate(geometry, coordinate));
    }
    return Group(results);
  }
);

export const xyz = move;

export default move;
