import { getCgal } from './getCgal.js';

export const insetOfPolygonWithHoles = (
  initial = 1,
  step = -1,
  limit = -1,
  polygon
) => {
  const g = getCgal();
  const outputs = [];
  let output;
  let points;
  let exactPoints;
  if (JSON.stringify(polygon.points[0]) === JSON.stringify(polygon.points[1])) {
    console.log(`dup`);
  }
  g.InsetOfPolygonWithHoles(
    initial,
    step,
    limit,
    polygon.holes.length,
    (out) => {
      if (polygon.exactPlane) {
        const [a, b, c, d] = polygon.exactPlane;
        g.fillExactQuadruple(out, a, b, c, d);
      } else {
        const [x, y, z, w] = polygon.plane;
        g.fillQuadruple(out, x, y, z, -w);
      }
    },
    (boundary) => {
      if (polygon.exactPoints) {
        for (const [x, y, z] of polygon.exactPoints) {
          g.addExactPoint(boundary, x, y, z);
        }
      } else {
        for (const [x, y, z] of polygon.points) {
          g.addPoint(boundary, x, y, z);
        }
      }
    },
    (hole, nth) => {
      if (polygon.holes[nth].exactPoints) {
        for (const [x, y, z] of polygon.holes[nth].exactPoints) {
          g.addExactPoint(hole, x, y, z);
        }
      } else {
        for (const [x, y, z] of polygon.holes[nth].points) {
          g.addPoint(hole, x, y, z);
        }
      }
    },
    (isHole) => {
      points = [];
      exactPoints = [];
      if (isHole) {
        output.holes.push({
          points,
          exactPoints,
          holes: [],
          plane: polygon.plane,
          exactPlane: polygon.exactPlane,
        });
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
      exactPoints.push([exactX, exactY, exactZ]);
    }
  );
  return outputs;
};
