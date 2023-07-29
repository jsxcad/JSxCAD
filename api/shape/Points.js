import Shape from './Shape.js';
import { Points as op } from '@jsxcad/geometry';

export const Points = Shape.registerMethod3Pre(
  'Points',
  ['coordinateLists', 'coordinates'],
  (coordinateLists, coordinates) => {
    for (const coordinateList of coordinateLists) {
      coordinates.push(...coordinateList);
    }
    return [coordinates];
  },
  op
);

export default Points;
