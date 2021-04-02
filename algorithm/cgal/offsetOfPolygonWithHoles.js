import { getCgal } from './getCgal.js';

export const offsetOfPolygonWithHoles = (
  initial = 1,
  step = -1,
  limit = -1,
  polygon
) => {
  const c = getCgal();
  const [x, y, z, w] = polygon.plane;
  const outputs = [];
  let output;
  let points;
  let exactPoints;
  c.OffsetOfPolygonWithHoles(
    initial,
    step,
    limit,
    x,
    y,
    z,
    -w,
    polygon.holes.length,
    (boundary) => {
      if (polygon.exactPoints) {
        for (const [x, y, z] of polygon.exactPoints) {
          c.addExactPoint(boundary, x, y, z);
        }
      } else {
        for (const [x, y, z] of polygon.points) {
          c.addPoint(boundary, x, y, z);
        }
      }
    },
    (hole, nth) => {
      if (polygon.holes[nth].exactPoints) {
        for (const [x, y, z] of polygon.holes[nth].exactPoints) {
          c.addExactPoint(hole, x, y, z);
        }
      } else {
        for (const [x, y, z] of polygon.holes[nth].points) {
          c.addPoint(hole, x, y, z);
        }
      }
    },
    (isHole) => {
      points = [];
      exactPoints = [];
      if (isHole) {
        output.holes.push({ points, exactPoints });
      } else {
        output = {
          points,
          exactPoints,
          holes: [],
          plane: polygon.plane,
          exactPlane: polygon.exactPlane,
        };
        outputs.push(output);
      }
    },
    (x, y, z, exactX, exactY, exactZ) => {
      points.push([x, y, z]);
      exactPoints.push([exactX, exactY, exactX]);
    }
  );
  return outputs;
};
