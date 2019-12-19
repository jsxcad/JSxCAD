import { removeExteriorPolygons, fromSolid as toBspFromSolid } from './bsp';

import { alignVertices } from '@jsxcad/geometry-solid';

export const section = (solid, surface) => {
  const bsp = toBspFromSolid(alignVertices(solid));
  return removeExteriorPolygons(bsp, surface);
};
