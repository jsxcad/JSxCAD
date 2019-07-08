const deduplicate = (surface) => {
  // return surface;
  const unique = new Map();
  for (const path of surface) {
    unique.set(JSON.stringify(path), path);
  }
  return [...unique.values()];
};

export const toSolid = (bsp) => {
  const solid = [];
  const walk = (bsp) => {
    if (bsp.same !== null) {
      solid.push(deduplicate(bsp.same));
    }
    if (bsp.back !== null) {
      walk(bsp.back);
    }
    if (bsp.front !== null) {
      walk(bsp.front);
    }
  };
  walk(bsp);
  return solid;
};
