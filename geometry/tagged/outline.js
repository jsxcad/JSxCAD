import { outlineSolid, outlineSurface } from '@jsxcad/geometry-halfedge';

import { cache } from '@jsxcad/cache';
import { createNormalize3 } from '@jsxcad/algorithm-quantize';
import { getAnyNonVoidSurfaces } from './getAnyNonVoidSurfaces.js';
import { getNonVoidSolids } from './getNonVoidSolids.js';
import { taggedPaths } from './taggedPaths.js';
import { toKeptGeometry } from './toKeptGeometry.js';

const outlineImpl = (geometry) => {
  const normalize = createNormalize3();

  // FIX: This assumes general coplanarity.
  const keptGeometry = toKeptGeometry(geometry);
  const outlines = [];
  for (const { solid } of getNonVoidSolids(keptGeometry)) {
    outlines.push(outlineSolid(solid, normalize));
  }
  for (const { surface, z0Surface } of getAnyNonVoidSurfaces(keptGeometry)) {
    outlines.push(outlineSurface(surface || z0Surface, normalize));
  }
  return outlines.map((outline) => taggedPaths({}, outline));
};

export const outline = cache(outlineImpl);
