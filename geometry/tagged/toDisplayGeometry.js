import { soup } from './soup.js';
import { toVisiblyDisjointGeometry } from './toDisjointGeometry.js';

export const toDisplayGeometry = (
  geometry,
  { triangles = true, outline = true, wireframe = false } = {}
) => {
  if (!geometry) {
    throw Error('die');
  }
  return soup(toVisiblyDisjointGeometry(geometry), {
    doTriangles: triangles,
    doOutline: outline,
    doWireframe: wireframe,
  });
};
