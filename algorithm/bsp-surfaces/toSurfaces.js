import { assertCoplanar } from '@jsxcad/algorithm-surface';

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
