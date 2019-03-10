import { blessAsConvex } from './blessAsConvex';
import Tess2 from 'tess2';
import { isConvex } from '@jsxcad/math-poly3';

const toContour = (polygon) => {
  const points = [];
  for (const [x = 0, y = 0] of polygon) {
    points.push(x);
    points.push(y);
  }
  return points;
};

const fromTessellation = (tessellation) => {
  const tessPolygons = tessellation.elements;
  const vertices = tessellation.vertices;
  const polygons = [];

  const toPoint = (offset) => {
    const vertex = tessPolygons[offset];
    return [vertices[vertex * 2 + 0], vertices[vertex * 2 + 1]];
  };

  for (let nth = 0; nth < tessPolygons.length; nth += 3) {
    polygons.push([toPoint(nth + 0), toPoint(nth + 1), toPoint(nth + 2)]);
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
  if (polygons.every(isConvex)) {
    return blessAsConvex(polygons);
  }
  const contours = polygons.map(toContour);
  const convex = fromTessellation(
    Tess2.tesselate({ contours: contours,
                      windingRule: Tess2.WINDING_ODD,
                      elementType: Tess2.POLYGONS,
                      polySize: 3,
                      vertexSize: 2
    }));
  return blessAsConvex(convex);
};
