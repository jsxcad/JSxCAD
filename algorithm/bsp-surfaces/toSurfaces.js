export const toSurfaces = (options = {}, bsp) => {
  // PROVE: That we need this slice.
  let surfaces = bsp.surfaces.slice();
  if (bsp.front !== undefined) {
    surfaces = surfaces.concat(toSurfaces(options, bsp.front));
  }
  if (bsp.back !== undefined) {
    surfaces = surfaces.concat(toSurfaces(options, bsp.back));
  }
  return surfaces;
};
