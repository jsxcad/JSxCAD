import { makeConvex } from '@jsxcad/algorithm-surface';

export const makeSurfacesConvex = (options = {}, solid) => {
  console.log(`QQ/makeSurfacesConvex: ${JSON.stringify(solid)}`);
  return solid.map(surface => makeConvex(options, surface));
}
