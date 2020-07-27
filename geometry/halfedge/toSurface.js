import { toSolid } from './toSolid.js';

export const toSurface = (loops, selectJunction) => {
  const solid = toSolid(loops, selectJunction);
  if (solid.length > 1) {
    throw Error(`Not a surface-structured solid.`);
  }
  if (solid.length === 1) {
    return solid[0];
  }
  return [];
};

export default toSurface;
