import { createNormalize3 } from './createNormalize3';
import { deduplicate } from '@jsxcad/geometry-path';
import { toPlane } from '@jsxcad/math-poly3';

export const alignVertices = (solid) => {
  const normalizer = createNormalize3();
  return solid.map(surface =>
    surface.map(polygon =>
      deduplicate(polygon.map(normalizer)))
        .filter(polygon => polygon.length >= 3)
        .filter(polygon => !isNaN(toPlane(polygon)[0])));
};
