import { clipPolygonsToFaces, fromPlanes as fromPlanesToBspTree } from '@jsxcad/geometry-bsp';
import { equals as equalsPlane, toPolygon as toPolygonFromPlane } from '@jsxcad/math-plane';

import { createNormalize3 } from '@jsxcad/algorithm-quantize';
import { fromPolygons as fromPolygonsToSolid } from '@jsxcad/geometry-solid';
import { rewrite } from './visit.js';
import { taggedSolid } from './taggedSolid.js';
import { toPlane as toPlaneFromPolygon } from '@jsxcad/math-poly3';
import { toPlane as toPlaneFromSurface } from '@jsxcad/geometry-surface';

const toPlanesFromSolid = (solid, normalize, offset = 0) => {
  const planes = [];
  const addPlane = (plane) => {
    // FIX: Inefficient.
    if (!planes.some(entry => equalsPlane(entry, plane))) {
      planes.push(plane);
    }
  };

  for (const surface of solid) {
    addPlane(toPlaneFromSurface(surface));
  }

  const polygons = [];
  for (const plane of planes) {
    polygons.push(toPolygonFromPlane(plane));
  }

  const clippedPolygons = [];
  clipPolygonsToFaces(fromPlanesToBspTree(planes, normalize), polygons, normalize, polygon => clippedPolygons.push(polygon));

  return fromPolygonsToSolid(clippedPolygons, normalize);
};

export const grow = (geometry, amount = 0) => {
  const op = (geometry, descend) => {
    const { tags } = geometry;
    switch (geometry.type) {
      case 'solid': {
        const normalize = createNormalize3();
        return taggedSolid({ tags }, toPlanesFromSolid(geometry.solid, normalize));
      }
      default: {
        return descend();
      }
    }
  };

  return rewrite(geometry, op);
};
