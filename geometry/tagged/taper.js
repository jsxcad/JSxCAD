import { reify } from './reify.js';
import { rewrite } from './visit.js';
import { taper as taperGraph } from '../graph/taper.js';
import { toTransformedGeometry } from './toTransformedGeometry.js';

export const taper = (
  geometry,
  xPlusFactor,
  xMinusFactor,
  yPlusFactor,
  yMinusFactor,
  zPlusFactor,
  zMinusFactor
) => {
  const op = (geometry, descend) => {
    switch (geometry.type) {
      case 'graph': {
        return taperGraph(
          geometry,
          xPlusFactor,
          xMinusFactor,
          yPlusFactor,
          yMinusFactor,
          zPlusFactor,
          zMinusFactor
        );
      }
      case 'triangles':
      case 'paths':
      case 'points':
        // Not implemented yet.
        return geometry;
      case 'plan':
        return taper(
          reify(geometry).content[0],
          xPlusFactor,
          xMinusFactor,
          yPlusFactor,
          yMinusFactor,
          zPlusFactor,
          zMinusFactor
        );
      case 'item':
      case 'group': {
        return descend();
      }
      case 'sketch': {
        // Sketches aren't real for taper.
        return geometry;
      }
      default:
        throw Error(`Unexpected geometry: ${JSON.stringify(geometry)}`);
    }
  };

  return rewrite(toTransformedGeometry(geometry), op);
};
