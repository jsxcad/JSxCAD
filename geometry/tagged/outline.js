import { cache } from '@jsxcad/cache';
import { getSurfaces } from './getSurfaces';
import { getZ0Surfaces } from './getZ0Surfaces';
import { toKeptGeometry } from './toKeptGeometry';
import { union } from './union';

const outlineImpl = (geometry) => {
  // FIX: This assumes general coplanarity.
  const keptGeometry = toKeptGeometry(geometry);
  const z0Surfaces = getZ0Surfaces(keptGeometry);
  const surfaces = getSurfaces(keptGeometry);
  const unifiedGeometry = union(...z0Surfaces, ...surfaces);
  const unifiedZ0Surfaces = getZ0Surfaces(unifiedGeometry);
  const unifiedSurfaces = getSurfaces(unifiedGeometry);
  const paths = [];
  for (const geometry of unifiedZ0Surfaces) {
    paths.push(...geometry.z0Surface);
  }
  for (const geometry of unifiedSurfaces) {
    paths.push(...geometry.surface);
  }
  return { paths };
};

export const outline = cache(outlineImpl);
