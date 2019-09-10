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
  const paths = [];
  for (const geometry of z0Surfaces) {
    paths.push(...geometry.z0Surface);
  }
  for (const geometry of surfaces) {
    paths.push(...geometry.surface);
  }
  return { paths };
};

export const outline = cache(outlineImpl);
