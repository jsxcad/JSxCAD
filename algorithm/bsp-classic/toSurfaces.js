import { assertCoplanar } from '@jsxcad/geometry-surface';
import { fromPolygons as toSolidFromPolygons } from '@jsxcad/geometry-solid';

/*
const gatherSurfaces = (bsp) => {
  // PROVE: That we need this slice.
  let surfaces = bsp.surfaces.slice();
  if (bsp.front !== undefined) {
    surfaces = surfaces.concat(gatherSurfaces(bsp.front));
  }
  if (bsp.back !== undefined) {
    surfaces = surfaces.concat(gatherSurfaces(bsp.back));
  }
  return surfaces;
};

export const toSurfaces = (options = {}, bsp) => {
  const surfaces = gatherSurfaces(bsp);
  for (const surface of surfaces) {
    assertCoplanar(surface);
  }
  // Some of these surfaces may have cracked.
  return surfaces;
};
*/

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
  }
  gatherPolygons(bsp);

  return toSolidFromPolygons({}, polygons);
};
