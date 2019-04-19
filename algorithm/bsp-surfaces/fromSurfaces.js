import { build } from './build';
import { create } from './create';
import { assertCoplanar } from '@jsxcad/algorithm-surface';

export const fromSurfaces = (options = {}, surfaces) => {
  for (const surface of surfaces) {
    assertCoplanar(surface);
  }
  const bsp = create();
  // Build is destructive.
  build(bsp, surfaces.map(surface => surface.slice()));
  return bsp;
};
