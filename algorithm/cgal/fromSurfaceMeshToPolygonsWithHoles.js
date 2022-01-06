import { getCgal } from './getCgal.js';
import { toCgalTransformFromJsTransform } from './transform.js';

export const fromSurfaceMeshToPolygonsWithHoles = (mesh, transform) => {
  try {
    const g = getCgal();
    const arrangements = [];

    let outputPlane;
    let outputExactPlane;
    let outputPolygons;
    let outputPolygon;

    const emitPlane = (x, y, z, w, a, b, c, d) => {
      outputPlane = [x, y, z, w];
      outputExactPlane = [a, b, c, d];
      outputPolygon = undefined;
      outputPolygons = [];
      arrangements.push({
        plane: outputPlane,
        exactPlane: outputExactPlane,
        polygonsWithHoles: outputPolygons,
      });
    };

    const emitPolygon = (isHole) => {
      const polygon = {
        plane: outputPlane,
        exactPlane: outputExactPlane,
        points: [],
        exactPoints: [],
        holes: [],
      };
      if (isHole) {
        outputPolygon.holes.push(polygon);
      } else {
        outputPolygons.push(polygon);
      }
      outputPolygon = polygon;
    };

    const emitPoint = (x, y, z, exactX, exactY, exactZ) => {
      outputPolygon.points.push([x, y, z]);
      outputPolygon.exactPoints.push([exactX, exactY, exactZ]);
    };

    g.FromSurfaceMeshToPolygonsWithHoles(
      mesh,
      toCgalTransformFromJsTransform(transform),
      emitPlane,
      emitPolygon,
      emitPoint
    );

    return arrangements;
  } catch (error) {
    throw Error(error);
  }
};
