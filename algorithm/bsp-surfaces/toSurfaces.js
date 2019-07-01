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

const isConvexBspTree = (bsp) => {
  while (bsp !== undefined) {
    if (bsp.front !== undefined) {
      return false;
    }
    bsp = bsp.back;
  }
  return true;
};

export const toSurfaces = (options = {}, bsp) => {
  const surfaces = gatherSurfaces(bsp);

  if (isConvexBspTree(bsp)) {
    console.log(`QQ/toSurfaces/isConvex`);
    surfaces.isConvex = true;
  }

  // Some of these surfaces may have cracked.
  return surfaces;
};
