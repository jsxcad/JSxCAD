import Tess2 from './tess2';
import { blessAsConvex } from './blessAsConvex';
import { retessellate } from './retessellate';
import { toPlane } from '@jsxcad/math-poly3';

const toContour = (polygon) => {
  const points = [];
  for (const [x = 0, y = 0] of polygon) {
    points.push(x, y, 0);
  }
  return points;
};

const fromTessellation = (tessellation) => {
  const tessPolygons = tessellation.elements;
  const vertices = tessellation.vertices;
  const polygons = [];

  const toPoint = (offset) => {
    const vertex = tessPolygons[offset];
    return [vertices[vertex * 3 + 0], vertices[vertex * 3 + 1], vertices[vertex * 3 + 2]];
  };

  for (let nth = 0; nth < tessPolygons.length; nth += 3) {
    const polygon = [toPoint(nth + 0), toPoint(nth + 1), toPoint(nth + 2)];
    if (toPlane(polygon)) {
      // FIX: Handle degeneracy better.
      polygons.push(polygon);
    } else {
      // console.log(`QQ/fromTessellation: skip degenerate`);
      // throw Error('die');
    }
  }

  return polygons;
};

// This currently does triangulation.
// Higher arities are possible, but end up being null padded.
// Let's see if they're useful.

// TODO: Call this toConvexPolygons
export const makeConvex = (options = {}, polygons) => {
  if (polygons.isConvex) {
    return polygons;
  }
  const contours = polygons.map(toContour);
  // CONISDER: Migrating from tess2 to earclip, given we flatten in solid tessellation anyhow.
  const convex = fromTessellation(
    Tess2.tesselate({ contours: contours,
                      windingRule: Tess2.WINDING_ODD,
                      elementType: Tess2.POLYGONS,
                      polySize: 3,
                      vertexSize: 3
    }));
  return convex; // retessellate(convex);
};
