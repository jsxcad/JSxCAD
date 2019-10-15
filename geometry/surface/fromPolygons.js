import { makeConvex } from './makeConvex';
import { retessellate } from '@jsxcad/geometry-z0surface';
import { toPlane } from './toPlane';
import { toXYPlaneTransforms } from '@jsxcad/math-plane';
import { transform } from './transform';
import { union } from '@jsxcad/geometry-z0surface-boolean';

// retessellate can reduce overlapping polygons.
// Clean them up here.
const clean = (surface) => {
  if (surface.length < 2) {
    return surface;
  }
  return union(...surface.map(polygon => [polygon]));
};

export const fromPolygons = ({ plane }, polygons) => {
  if (polygons.length === 0) {
    return [];
  }
  if (plane === undefined) {
    plane = toPlane(polygons);
  }
  const [toZ0, fromZ0] = toXYPlaneTransforms(plane);
  const z0Polygons = transform(toZ0, polygons);

  switch ('cleaned') {
    case 'uncleaned': {
      // const z0Surface = clean(retessellate(z0Polygons));
      const z0Surface = retessellate(z0Polygons);
      const surface = transform(fromZ0, z0Surface);
      surface.plane = plane;
      return surface;
    }
    case 'cleaned': {
      let retessellation = retessellate(z0Polygons);
      if (retessellation.length >= 2) {
        // Sometimes overlapping into to retessellation results in overlapping output.
        // Clean these up and retessellate again.
        // FIX: Eliminate overlapping output in retessellate.
        retessellation = retessellate(makeConvex({}, clean(retessellation)));
      }
      const surface = transform(fromZ0, retessellation);
      surface.plane = plane;
      return surface;
    }
  }
};
