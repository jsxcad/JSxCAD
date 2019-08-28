import { fromPolygons as toSolidFromPolygons } from '@jsxcad/geometry-solid';

export const toSurfaces = (options = {}, bsp) => {
  const polygons = [];
  const gatherPolygons = (bsp) => {
    if (bsp !== undefined) {
      for (const surface of bsp.surfaces) {
        for (const polygon of surface) {
          polygons.push(polygon);
        }
      }
      gatherPolygons(bsp.front);
      gatherPolygons(bsp.back);
    }
  };
  gatherPolygons(bsp);

  return toSolidFromPolygons({}, polygons);
};
