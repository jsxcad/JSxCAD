import { isVoid } from './isNotVoid.js';
import { measureArea as measureAreaOfSurface } from '@jsxcad/geometry-surface';
import { toKeptGeometry } from './toKeptGeometry.js';
import { visit } from './visit.js';

export const measureArea = (rawGeometry) => {
  const geometry = toKeptGeometry(rawGeometry);
  let area = 0;
  const op = (geometry, descend) => {
    if (isVoid(geometry)) {
      return;
    }
    switch (geometry.type) {
      case 'surface':
        area += measureAreaOfSurface(geometry.surface);
        break;
      case 'z0Surface':
        area += measureAreaOfSurface(geometry.z0Surface);
        break;
      case 'solid':
        for (const surface of geometry.solid) {
          area += measureAreaOfSurface(surface);
        }
        break;
    }
    descend();
  };
  visit(geometry, op);
  return area;
};
