import { soup } from './soup.js';
import { toVisiblyDisjointGeometry } from './toDisjointGeometry.js';

export const toDisplayGeometry = (
  geometry,
  { doTriangles = true, doOutline = true, doWireframe = false } = {}
) =>
  soup(toVisiblyDisjointGeometry(geometry), {
    doTriangles,
    doOutline,
    doWireframe,
  });
