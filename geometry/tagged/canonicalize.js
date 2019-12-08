import { canonicalize as canonicalizePaths } from '@jsxcad/geometry-paths';
import { canonicalize as canonicalizePlane } from '@jsxcad/math-plane';
import { canonicalize as canonicalizePoints } from '@jsxcad/geometry-points';
import { canonicalize as canonicalizeSolid } from '@jsxcad/geometry-solid';
import { canonicalize as canonicalizeSurface } from '@jsxcad/geometry-surface';
import { toTransformedGeometry } from './toTransformedGeometry';

export const canonicalize = (rawGeometry) => {
  const geometry = toTransformedGeometry(rawGeometry);
  const canonicalized = {};
  if (geometry.points !== undefined) {
    canonicalized.points = canonicalizePoints(geometry.points);
  } else if (geometry.paths !== undefined) {
    canonicalized.paths = canonicalizePaths(geometry.paths);
  } else if (geometry.plan !== undefined) {
    canonicalized.plan = geometry.plan;
    canonicalized.marks = canonicalizePoints(geometry.marks);
    canonicalized.planes = geometry.planes.map(canonicalizePlane);
    canonicalized.visualization = canonicalize(geometry.visualization);
  } else if (geometry.connection) {
    canonicalized.connection = geometry.connection;
    canonicalized.geometries = geometry.geometries.map(canonicalize); ;
    canonicalized.connectors = geometry.connectors.map(canonicalize); ;
  } else if (geometry.surface !== undefined) {
    canonicalized.surface = canonicalizeSurface(geometry.surface);
  } else if (geometry.z0Surface !== undefined) {
    canonicalized.z0Surface = canonicalizeSurface(geometry.z0Surface);
  } else if (geometry.solid !== undefined) {
    canonicalized.solid = canonicalizeSolid(geometry.solid);
  } else if (geometry.assembly !== undefined) {
    canonicalized.assembly = geometry.assembly.map(canonicalize);
  } else if (geometry.disjointAssembly !== undefined) {
    canonicalized.disjointAssembly = geometry.disjointAssembly.map(canonicalize);
    if (geometry.nonNegative) {
      canonicalized.nonNegative = geometry.nonNegative.map(canonicalize);
    }
  } else if (geometry.item !== undefined) {
    canonicalized.item = geometry.item(canonicalize);
  } else {
    throw Error('die');
  }
  if (geometry.tags !== undefined) {
    canonicalized.tags = geometry.tags;
  }
  return canonicalized;
};
