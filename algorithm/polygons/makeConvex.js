import Tess2 from 'tess2';
import { isConvex } from '@jsxcad/math-poly3';

const toContour = (polygon) => {
  const points = [];
  for (const [x, y] of polygon) {
    points.push(x);
    points.push(y);
  }
  return points;
};

const fromTessellation = (tessellation) => {
  const triangles = tessellation.elements;
  const vertices = tessellation.vertices;
  const polygons = [];

  const toPoint = (offset) => {
    const vertex = triangles[offset];
    return [vertices[vertex * 2 + 0], vertices[vertex * 2 + 1]];
  };

  for (let nth = 0; nth < triangles.length; nth += 3) {
    polygons.push([toPoint(nth + 0), toPoint(nth + 1), toPoint(nth + 2)]);
  }

  return polygons;
};

export const makeConvex = (options = {}, polygons) => {
  if (polygons.isConvex) {
    return polygons;
  }
  if (polygons.every(isConvex)) {
    polygons.isConvex = true;
    return polygons;
  }
  const convex = fromTessellation(
    Tess2.tesselate({ contours: polygons.map(toContour),
                      windingRule: Tess2.WINDING_ODD,
                      elementType: Tess2.POLYGONS,
                      polySize: 3,
                      vertexSize: 2
    }));
  convex.isConvex = true;
  return convex;
};
