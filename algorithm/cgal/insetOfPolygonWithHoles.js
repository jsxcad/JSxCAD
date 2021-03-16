import { getCgal } from './getCgal.js';

// FIX: Remove this rounding hack.
const round = (n) => Math.round(n * 10000) / 10000;

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
  c.InsetOfPolygon(
    initial,
    step,
    limit,
    x,
    y,
    z,
    -w,
    polygon.holes.length,
    (boundary) => {
      for (let [x, y, z] of polygon.points) {
        c.addPoint(boundary, round(x), round(y), round(z));
      }
    },
    (hole, nth) => {
      for (const [x, y, z] of polygon.holes[nth].points) {
        c.addPoint(hole, round(x), round(y), round(z));
      }
    },
    (isHole) => {
      points = [];
      if (isHole) {
        output.holes.push({
          points,
          holes: [],
          plane: polygon.plane,
          exactPlane: polygon.exactPlane,
        });
      } else {
        output = {
          points,
          holes: [],
          plane: polygon.plane,
          exactPlane: polygon.exactPlane,
        };
        outputs.push(output);
      }
    },
    (x, y, z) => {
      points.push([x, y, z]);
    }
  );
  return outputs;
};
