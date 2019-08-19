import { createNormalize3 } from './createNormalize3';
import { deduplicate } from '@jsxcad/geometry-path';
import { toPlane } from '@jsxcad/math-poly3';

export const alignVertices = (solid) => {
  return solid;

  const normalize3 = createNormalize3();
  return solid.map(surface =>
                     surface.map(polygon => deduplicate(polygon.map(normalize3)))
                            .filter(polygon => polygon.length >= 3)
                            .filter(polygon => !isNaN(toPlane(polygon)[0])));
};

export const alignVertices2 = (solid) => {
  return solid;

  const normalize3 = createNormalize3();
  return solid.map(surface =>
                     surface.map(polygon => deduplicate(polygon.map(normalize3)))
                            .filter(polygon => polygon.length >= 3)
                            .filter(polygon => !isNaN(toPlane(polygon)[0])));
};
