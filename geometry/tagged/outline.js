import { cache } from '@jsxcad/cache';
import { createNormalize3 } from '@jsxcad/algorithm-quantize';
import { getSolids } from './getSolids';
import { getSurfaces } from './getSurfaces';
import { getZ0Surfaces } from './getZ0Surfaces';
import { outline as outlineSolid } from '@jsxcad/geometry-solid';
import { outline as outlineSurface } from '@jsxcad/geometry-surface';
import { outline as outlineZ0Surface } from '@jsxcad/geometry-z0surface-boolean';
import { toKeptGeometry } from './toKeptGeometry';

const outlineImpl = (geometry) => {
  const normalize = createNormalize3();

  // FIX: This assumes general coplanarity.
  const keptGeometry = toKeptGeometry(geometry);
  const outlines = [];
  for (const { solid } of getSolids(keptGeometry)) {
    outlines.push(outlineSolid(solid, normalize));
  }
  for (const { surface } of getSurfaces(keptGeometry)) {
    outlines.push(outlineSurface(surface, normalize));
  }
  for (const { z0Surface } of getZ0Surfaces(keptGeometry)) {
    outlines.push(outlineZ0Surface(z0Surface, normalize));
  }
  return outlines.map(outline => ({ paths: outline }));
};

export const outline = cache(outlineImpl);
