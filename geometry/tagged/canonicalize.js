import { canonicalize as canonicalizePaths } from '@jsxcad/geometry-paths';
import { canonicalize as canonicalizePlane } from '@jsxcad/math-plane';
import { canonicalize as canonicalizePoints } from '@jsxcad/geometry-points';
import { canonicalize as canonicalizeSolid } from '@jsxcad/geometry-solid';
import { canonicalize as canonicalizeSurface } from '@jsxcad/geometry-surface';
import { rewrite } from './visit.js';
import { toTransformedGeometry } from './toTransformedGeometry.js';

export const canonicalize = (geometry) => {
  const op = (geometry, descend) => {
    switch (geometry.type) {
      case 'points':
        return descend({ points: canonicalizePoints(geometry.points) });
      case 'paths':
        return descend({ paths: canonicalizePaths(geometry.paths) });
      case 'plan':
        return descend({
          marks: canonicalizePoints(geometry.marks),
          planes: geometry.planes.map(canonicalizePlane),
        });
      case 'graph':
        return descend({
          graph: {
            ...geometry.graph,
            points: canonicalizePoints(geometry.graph.points),
          },
        });
      case 'surface':
        return descend({ surface: canonicalizeSurface(geometry.surface) });
      case 'z0Surface':
        return descend({ z0Surface: canonicalizeSurface(geometry.z0Surface) });
      case 'solid':
        return descend({ solid: canonicalizeSolid(geometry.solid) });
      case 'item':
      case 'assembly':
      case 'disjointAssembly':
      case 'layers':
      case 'layout':
      case 'sketch':
        return descend();
      default:
        throw Error(`Unexpected geometry type ${geometry.type}`);
    }
  };
  return rewrite(toTransformedGeometry(geometry), op);
};
