import { Group } from './Group.js';
import { computeOrientedBoundingBox as computeOrientedBoundingBoxWithCgal } from '@jsxcad/algorithm-cgal';
import { isNotTypeGhost } from './tagged/type.js';
import { linearize } from './tagged/linearize.js';

const filter = (geometry) =>
  isNotTypeGhost(geometry) &&
  ((geometry.type === 'graph' && !geometry.graph.isEmpty) ||
    ['polygonsWithHoles', 'segments', 'points'].includes(geometry.type));

export const computeOrientedBoundingBox = (
  geometry,
  { segments = true, mesh = false } = {}
) =>
  Group(
    computeOrientedBoundingBoxWithCgal(
      linearize(geometry, filter),
      segments,
      mesh
    )
  );

export const obb = (geometry) =>
  computeOrientedBoundingBox(geometry, { mesh: true });
