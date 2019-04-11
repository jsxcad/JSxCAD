import { build } from './build';
import { create } from './create';

export const fromSurfaces = (options = {}, surfaces) => {
  const bsp = create();
  // Build is destructive.
  build(bsp, surfaces.map(surface => surface.slice()));
  return bsp;
};
