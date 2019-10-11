import { removeExteriorPolygons, fromSolid as toBspFromSolid } from './bsp';

export const section = (solid, surface) => {
  const bsp = toBspFromSolid(solid);
  return removeExteriorPolygons(bsp, surface);
};
