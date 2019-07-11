import { BRANCH } from './bsp';

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
    if (bsp.kind === BRANCH) {
      solid.push(deduplicate(bsp.same));
      walk(bsp.back);
      walk(bsp.front);
    }
  };
  walk(bsp);
  return solid;
};
