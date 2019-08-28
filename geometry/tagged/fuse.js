import { getClouds } from './getClouds';
import { getPaths } from './getPaths';
import { getSolids } from './getSolids';
import { getZ0Surfaces } from './getZ0Surfaces';
import { union as unionPaths } from '@jsxcad/geometry-paths';
import { union as unionPoints } from '@jsxcad/geometry-points';
import { union as unionSolids } from '@jsxcad/geometry-solid-boolean';
import { union as unionZ0Surfaces } from '@jsxcad/geometry-z0surface-boolean';

export const fuse = (geometry) => {
  const items = [];

  const clouds = getClouds(geometry);
  if (clouds.length > 0) {
    items.push({ points: unionPoints(...clouds.map(item => item.points)) });
  }

  const pathsets = getPaths(geometry);
  if (pathsets.length > 0) {
    items.push({ paths: unionPaths(...pathsets.map(item => item.paths)) });
  }

  const solids = getSolids(geometry);
  if (solids.length > 0) {
    items.push({ solid: unionSolids(...solids.map(item => item.solid)) });
  }

  const z0Surfaces = getZ0Surfaces(geometry);
  if (z0Surfaces.length > 0) {
    items.push({ z0Surface: unionZ0Surfaces(...z0Surfaces.map(item => item.z0Surface)) });
  }

  if (items.length === 1) {
    return items[0];
  } else {
    return { assembly: items };
  }
};
