import { toSolid } from './toSolid.js';

export const toSurface = (loops, selectJunction) => {
  const surface = [];
  const solid = toSolid(loops, selectJunction);
  for (const loops of solid) {
    surface.push(...loops);
  }
  return surface;
};

export default toSurface;
