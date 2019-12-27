import { cache } from '@jsxcad/cache';
import { clean } from '@jsxcad/geometry-surface-boolean';
import { getAnySurfaces } from './getAnySurfaces';
import { toKeptGeometry } from './toKeptGeometry';

const toOutlineFromSurface = (surface) => clean(surface);

const outlineImpl = (geometry) => {
  // FIX: This assumes general coplanarity.
  const keptGeometry = toKeptGeometry(geometry);
  const outlines = [];
  for (const { surface, z0Surface } of getAnySurfaces(keptGeometry)) {
    const anySurface = surface || z0Surface;
    outlines.push(toOutlineFromSurface(anySurface));
  }
  return outlines.map(outline => ({ paths: outline }));
};

export const outline = cache(outlineImpl);
