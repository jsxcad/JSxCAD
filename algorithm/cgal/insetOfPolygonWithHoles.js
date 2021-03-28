import { getCgal } from './getCgal.js';

// const round = (n) => Math.round(n * 10000) / 10000;
const round = (n) => n;

export const insetOfPolygonWithHoles = (
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
  c.InsetOfPolygonWithHoles(
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
        for (let [x, y, z] of polygon.exactPoints) {
          c.addExactPoint(boundary, x, y, z);
        }
      } else {
        for (let [x, y, z] of polygon.points) {
          c.addPoint(boundary, round(x), round(y), round(z));
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
          c.addPoint(hole, round(x), round(y), round(z));
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
