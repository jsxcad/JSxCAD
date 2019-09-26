import { makeConvex, toPlane as toPlaneFromSurface } from '@jsxcad/geometry-surface';

import { cache } from '@jsxcad/cache';
import { union } from '@jsxcad/geometry-surface-boolean';
import { getSurfaces } from './getSurfaces';
import { getZ0Surfaces } from './getZ0Surfaces';
import { toKeptGeometry } from './toKeptGeometry';

const toOutlineFromSurface = (surface) => {
  const convexSurface = makeConvex({}, surface);
  return convexSurface;
  const pathSurfaces = [];
  for (const path of convexSurface) {
    const pathSurface = [path];
    pathSurface.plane = toPlaneFromSurface(convexSurface);
    pathSurfaces.push(pathSurface);
  }
  const simplified = union(...pathSurfaces);
  return simplified;
}

const outlineImpl = (geometry) => {
  // FIX: This assumes general coplanarity.
  const keptGeometry = toKeptGeometry(geometry);
  const z0Surfaces = getZ0Surfaces(keptGeometry);
  const surfaces = getSurfaces(keptGeometry);
  const outlines = [];
  for (const { z0Surface } of z0Surfaces) {
    outlines.push(...toOutlineFromSurface(z0Surface));
  }
  for (const { surface } of surfaces) {
    outlines.push(...toOutlineFromSurface(surface));
  }
  return { paths: outlines };
};

export const outline = cache(outlineImpl);
