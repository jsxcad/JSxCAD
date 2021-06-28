import { soup } from './soup.js';
import { toVisiblyDisjointGeometry } from './toDisjointGeometry.js';

export const toDisplayGeometry = (
  geometry,
  { triangles, outline = true, skin, wireframe = false } = {}
) => {
  if (!geometry) {
    throw Error('die');
  }
  if (skin === undefined) {
    skin = triangles;
  }
  if (skin === undefined) {
    skin = true;
  }
  return soup(toVisiblyDisjointGeometry(geometry), {
    doTriangles: skin,
    doOutline: outline,
    doWireframe: wireframe,
  });
};
