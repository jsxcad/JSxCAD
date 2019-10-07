import { removeExteriorPolygons, fromSolid as toBspFromSolid } from './bsp';

export const section = (solid, polygon) => {
  const bsp = toBspFromSolid(solid);
  return removeExteriorPolygons(bsp, [polygon]);
};
