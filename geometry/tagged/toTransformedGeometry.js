import { identityMatrix, multiply } from '@jsxcad/math-mat4';

import {
  reconcile as reconcileSolid,
  transform as transformSolid,
} from '@jsxcad/geometry-solid';

import { transform as transformPaths } from '@jsxcad/geometry-paths';
import { transform as transformPlane } from '@jsxcad/math-plane';
import { transform as transformPoints } from '@jsxcad/geometry-points';
import { transform as transformSurface } from '@jsxcad/geometry-surface';

const transformedGeometry = Symbol('transformedGeometry');

export const toTransformedGeometry = (geometry) => {
  if (geometry[transformedGeometry] === undefined) {
    const walk = (matrix, geometry) => {
      const { tags } = geometry;
      if (geometry.matrix) {
        // Preserve any tags applied to the untransformed geometry.
        // FIX: Ensure tags are merged between transformed and untransformed upon resolution.
        return walk(multiply(matrix, geometry.matrix), geometry.untransformed);
      } else if (geometry.assembly) {
        return {
          assembly: geometry.assembly.map((geometry) => walk(matrix, geometry)),
          tags,
        };
      } else if (geometry.disjointAssembly) {
        if (matrix === identityMatrix) {
          // A disjointAssembly does not contain any untransformed geometry.
          // If there is no transformation to apply we can stop here.
          return geometry;
        }
        return {
          disjointAssembly: geometry.disjointAssembly.map((geometry) =>
            walk(matrix, geometry)
          ),
          tags,
        };
      } else if (geometry.layers) {
        return {
          layers: geometry.layers.map((geometry) => walk(matrix, geometry)),
          tags,
        };
      } else if (geometry.item) {
        return {
          item: walk(matrix, geometry.item),
          tags,
        };
      } else if (geometry.paths) {
        return {
          paths: transformPaths(matrix, geometry.paths),
          tags,
        };
      } else if (geometry.plan) {
        return {
          plan: geometry.plan,
          marks: transformPoints(matrix, geometry.marks),
          planes: geometry.planes.map((plane) => transformPlane(matrix, plane)),
          content: walk(matrix, geometry.content),
          visualization: walk(matrix, geometry.visualization),
          tags,
        };
      } else if (geometry.points) {
        return {
          points: transformPoints(matrix, geometry.points),
          tags,
        };
      } else if (geometry.solid) {
        return {
          solid: transformSolid(matrix, reconcileSolid(geometry.solid)),
          tags,
        };
      } else if (geometry.surface) {
        return {
          surface: transformSurface(matrix, geometry.surface),
          tags,
        };
      } else if (geometry.z0Surface) {
        // FIX: Consider transforms that preserve z0.
        return {
          surface: transformSurface(matrix, geometry.z0Surface),
          tags,
        };
      } else {
        throw Error(`die: ${JSON.stringify(geometry)}`);
      }
    };
    geometry[transformedGeometry] = walk(identityMatrix, geometry);
  }
  return geometry[transformedGeometry];
};
