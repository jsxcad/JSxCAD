import { build } from './build';
import { create } from './create';

const copyBsp = ({ plane, surfaces, front, back }) => {
  const copy = {};
  if (plane !== undefined) {
    copy.plane = plane;
  }
  if (surfaces !== undefined) {
    copy.surfaces = surfaces.slice();
  }
  if (front !== undefined) {
    copy.front = copyBsp(front);
  }
  if (back !== undefined) {
    copy.back = copyBsp(back);
  }
  return copy;
};

export const fromSurfaces = (options = {}, surfaces) => {
  console.log(`QQ/fromSurfaces/begin`);
  if (surfaces.bsp === undefined) {
    console.log(`QQ/fromSurfaces/build`);
    const bsp = create();
    // Build is destructive.
    build(bsp, surfaces.map(surface => surface.slice()));
    surfaces.bsp = bsp;
  }
  console.log(`QQ/fromSurfaces/end`);
  // FIX: See if we can make the operations non-destructive so that we do not need to copy the cached tree.
  return copyBsp(surfaces.bsp);
};
