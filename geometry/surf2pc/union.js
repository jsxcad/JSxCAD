import { canonicalize } from './canonicalize';
import { clippingToPolygons } from './clippingToPolygons';
import { fromPolygons } from './fromPolygons';
import { union as polygonClippingUnion } from 'polygon-clipping';

/**
 * Produces a surface that is the union of all provided surfaces.
 * The union of no surfaces is the empty surface.
 * The union of one surface is that surface.
 * @param {Array<surface>} surfaces - the surfaces to union.
 * @returns {surface} the union of the surfaces.
 */
export const union = (...surfaces) => {
  switch (surfaces.length) {
    case 0:
      return fromPolygons({}, []);
    case 1:
      return surfaces[0];
    default: {
      const combined = surfaces.map(surface =>
        canonicalize(surface).polygons.map(polygon => polygon.map(([a, b]) => [a, b])));
      return fromPolygons({},
                          clippingToPolygons(polygonClippingUnion(...combined)));
    }
  }
};
