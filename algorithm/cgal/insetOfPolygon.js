import { getCgal } from './getCgal.js';

// FIX: Remove this rounding hack.
const round = (n) => Math.round(n * 10000) / 10000;

export const insetOfPolygon = (
  initial = 1,
  step = -1,
  limit = -1,
  plane,
  border,
  holes = []
) => {
  const c = getCgal();
  const [x, y, z, w] = plane;
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
    holes.length,
    (boundary) => {
      for (let [x, y, z] of border) {
        c.addPoint(boundary, round(x), round(y), round(z));
      }
    },
    (hole, nth) => {
      for (const [x, y, z] of holes[nth]) {
        c.addPoint(hole, round(x), round(y), round(z));
      }
    },
    (isHole) => {
      points = [];
      if (isHole) {
        output.holes.push(points);
      } else {
        output = { boundary: points, holes: [], plane };
        outputs.push(output);
      }
    },
    (x, y, z) => {
      points.push([x, y, z]);
    }
  );
  return outputs;
};
