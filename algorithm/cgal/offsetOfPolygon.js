import { getCgal } from './getCgal.js';

export const offsetOfPolygon = (
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
  c.OffsetOfPolygon(
    initial,
    step,
    limit,
    x,
    y,
    z,
    -w,
    holes.length,
    (boundary) => {
      for (const [x, y, z] of border) {
        c.addPoint(boundary, x, y, z);
      }
    },
    (hole, nth) => {
      for (const [x, y, z] of holes[nth]) {
        c.addPoint(hole, x, y, z);
      }
    },
    (isHole) => {
      points = [];
      if (isHole) {
        output.holes.push(points);
      } else {
        output = { boundary: points, holes: [] };
        outputs.push(output);
      }
    },
    (x, y, z) => points.push([x, y, z])
  );
  return outputs;
};
