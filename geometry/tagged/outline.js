import { makeConvex, toPlane as toPlaneFromSurface } from '@jsxcad/geometry-surface';

import { cache } from '@jsxcad/cache';
import { getAnySurfaces } from './getAnySurfaces';
import { toKeptGeometry } from './toKeptGeometry';
import { union } from '@jsxcad/geometry-surface-boolean';

const toOutlineFromSurface = (surface) => {
  const convexSurface = makeConvex({}, surface);
  const pathSurfaces = [];
  for (const path of convexSurface) {
    const pathSurface = [path];
    pathSurface.plane = toPlaneFromSurface(convexSurface);
    pathSurfaces.push(pathSurface);
  }
  const simplified = union(...pathSurfaces);
  return simplified;
};

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
