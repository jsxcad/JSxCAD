import Shape from './Shape.js';
import { fromPolygonSoup } from '@jsxcad/geometry';

export const Polyhedron = Shape.registerMethod3(
  'Polyhedron',
  ['coordinateLists'],
  (coordinateLists) => {
    const out = [];
    for (const coordinates of coordinateLists) {
      out.push({ points: coordinates });
    }
    return fromPolygonSoup(out);
  }
);

export default Polyhedron;
