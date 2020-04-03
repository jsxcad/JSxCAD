import { measureArea as measureAreaOfSurface } from '@jsxcad/geometry-surface';
import { toKeptGeometry } from './toKeptGeometry';
import { visit } from './visit';

export const measureArea = (rawGeometry) => {
  const geometry = toKeptGeometry(rawGeometry);
  let area = 0;
  const op = (geometry, descend) => {
    if (geometry.surface) {
      area += measureAreaOfSurface(geometry.surface);
    } else if (geometry.z0Surface) {
      area += measureAreaOfSurface(geometry.z0Surface);
    } else if (geometry.solid) {
      for (const surface of geometry.solid) {
        area += measureAreaOfSurface(surface);
      }
    }
    descend();
  };
  visit(geometry, op);
  return area;
};
