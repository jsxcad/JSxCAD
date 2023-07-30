import Shape from './Shape.js';
import { Points as op } from '@jsxcad/geometry';

export const Points = Shape.registerMethod3(
  'Points',
  ['coordinateLists', 'coordinates'],
  (coordinateLists, coordinates) => {
    for (const coordinateList of coordinateLists) {
      coordinates.push(...coordinateList);
    }
    return op(coordinates);
  }
);

export default Points;
