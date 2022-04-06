import { getCgal } from './getCgal.js';

export const arrangePolygonsWithHoles = (polygons) => {
  throw Error('die');
  try {
    const g = getCgal();
    let nth = -1;
    let polygon;

    const fillPlane = (out) => {
      polygon = polygons[++nth];
      if (polygon.exactPlane) {
        const [a, b, c, d] = polygon.exactPlane;
        g.fillExactQuadruple(out, a, b, c, d);
      } else {
        const [x, y, z, w] = polygon.plane;
        g.fillQuadruple(out, x, y, z, -w);
      }
    };

    const fillBoundary = (out) => {
      if (!polygon) {
        return;
      }
      if (polygon.exactPoints) {
        for (const [x, y, z] of polygon.exactPoints) {
          g.addExactPoint(out, x, y, z);
        }
      } else {
        for (const [x, y, z] of polygon.points) {
          g.addPoint(out, x, y, z);
        }
      }
    };

    const fillHole = (out, nthHole) => {
      const hole = polygon.holes[nthHole];
      if (!hole) {
        return;
      }
      if (hole.exactPoints) {
        for (const [x, y, z] of polygon.exactPoints) {
          g.addExactPoint(out, x, y, z);
        }
      } else {
        for (const [x, y, z] of polygon.points) {
          g.addPoint(out, x, y, z);
        }
      }
    };

    const arrangements = [];

    let outputPlane;
    let outputExactPlane;
    let outputPolygons;
    let outputPolygon;
    let outputPolygonOrHole;

    const emitPlane = (x, y, z, w, a, b, c, d) => {
      outputPlane = [x, y, z, w];
      outputExactPlane = [a, b, c, d];
      outputPolygon = undefined;
      outputPolygonOrHole = undefined;
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
        outputPolygon = polygon;
      }
      outputPolygonOrHole = polygon;
    };

    const emitPoint = (x, y, z, exactX, exactY, exactZ) => {
      outputPolygonOrHole.points.push([x, y, z]);
      outputPolygonOrHole.exactPoints.push([exactX, exactY, exactZ]);
    };

    g.ArrangePolygonsWithHoles(
      polygons.length,
      fillPlane,
      fillBoundary,
      fillHole,
      emitPlane,
      emitPolygon,
      emitPoint
    );

    return arrangements;
  } catch (error) {
    throw Error(error);
  }
};
