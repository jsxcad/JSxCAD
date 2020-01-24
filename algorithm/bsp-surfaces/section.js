import { removeExteriorPolygons, fromSolid as toBspFromSolid } from './bsp';

import { alignVertices } from '@jsxcad/geometry-solid';
import { createNormalize3 } from '@jsxcad/algorithm-quantize';

export const section = (solid, surfaces) => {
  const normalize = createNormalize3();
  const bsp = toBspFromSolid(alignVertices(solid, normalize), normalize);
  return surfaces.map(surface => removeExteriorPolygons(bsp, surface, normalize));
};
