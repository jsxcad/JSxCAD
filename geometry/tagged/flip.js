import { flip as flipPaths } from '@jsxcad/geometry-paths';
import { flip as flipPlane } from '@jsxcad/math-plane';
import { flip as flipPoints } from '@jsxcad/geometry-points';
import { flip as flipSolid } from '@jsxcad/geometry-solid';
import { flip as flipSurface } from '@jsxcad/geometry-surface';

import { rewrite } from './visit';

export const flip = (geometry) => {
  const op = (geometry, descend) => {
    if (geometry.points) {
      return { ...geometry, points: flipPoints(geometry.points) };
    } else if (geometry.paths) {
      return { ...geometry, paths: flipPaths(geometry.paths) };
    } else if (geometry.surface) {
      return { ...geometry, surface: flipSurface(geometry.surface) };
    } else if (geometry.z0Surface) {
      return { ...geometry, surface: flipSurface(geometry.z0Surface) };
    } else if (geometry.solid) {
      return { ...geometry, solid: flipSolid(geometry.solid) };
    } else if (geometry.assembly) {
      return descend();
    } else if (geometry.layers) {
      return descend();
    } else if (geometry.disjointAssembly) {
      return descend();
    } else if (geometry.plan) {
      if (geometry.plan.connector) {
        // FIX: Mirror visualization?
        return { ...geometry, planes: geometry.planes.map(flipPlane) };
      } else {
        return { ...geometry, content: flip(geometry.content) };
      }
    } else if (geometry.item) {
      // FIX: How should items deal with flip?
      return { ...geometry, item: flip(geometry.item) };
    } else {
      throw Error(`die: ${JSON.stringify(geometry)}`);
    }
  };
  return rewrite(geometry, op);
};
