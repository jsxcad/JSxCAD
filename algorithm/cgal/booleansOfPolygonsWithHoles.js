import { getCgal } from './getCgal.js';

export const BOOLEAN_ADD = 1;
export const BOOLEAN_CUT = 2;
export const BOOLEAN_CLIP = 3;

export const booleansOfPolygonsWithHoles = (operations, polygons) => {
  const g = getCgal();
  const outputs = [];
  let output;
  let points;
  let exactPoints;
  const getOperation = (nthOperation) => operations[nthOperation];
  const fillBoundary = (boundary, nthBoundary) => {
    const polygon = polygons[nthBoundary];
    if (!polygon) return;
    if (polygon.exactPoints) {
      for (const [x, y, z] of polygon.exactPoints) {
        g.addExactPoint(boundary, x, y, z);
      }
    } else {
      for (const [x, y, z] of polygon.points) {
        g.addPoint(boundary, x, y, z);
      }
    }
  };
  const fillHole = (hole, nthBoundary, nthHole) => {
    const polygon = polygons[nthBoundary];
    if (!polygon) return;
    if (!polygon.holes[nthHole]) return;
    if (polygon.holes[nthHole].exactPoints) {
      for (const [x, y, z] of polygon.holes[nthHole].exactPoints) {
        g.addExactPoint(hole, x, y, z);
      }
    } else {
      for (const [x, y, z] of polygon.holes[nthHole].points) {
        g.addPoint(hole, x, y, z);
      }
    }
  };
  const outputPolygon = (isHole) => {
    points = [];
    exactPoints = [];
    if (isHole) {
      output.holes.push({ points, exactPoints });
    } else {
      output = {
        points,
        exactPoints,
        holes: [],
        plane: polygons[0].plane,
        exactPlane: polygons[0].exactPlane,
      };
      outputs.push(output);
    }
  };
  const outputPoint = (x, y, z, exactX, exactY, exactZ) => {
    points.push([x, y, z]);
    exactPoints.push([exactX, exactY, exactX]);
  };
  if (polygons[0].exactPlane) {
    const [a, b, c, d] = polygons[0].exactPlane;
    g.BooleansOfPolygonsWithHolesExact(
      a,
      b,
      c,
      d,
      getOperation,
      fillBoundary,
      fillHole,
      outputPolygon,
      outputPoint
    );
  } else {
    const [x, y, z, w] = polygons[0].plane;
    g.BooleansOfPolygonsWithHolesApproximate(
      x,
      y,
      z,
      -w,
      getOperation,
      fillBoundary,
      fillHole,
      outputPolygon,
      outputPoint
    );
  }
  return outputs;
};
