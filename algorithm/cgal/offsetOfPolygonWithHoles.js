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
  c.OffsetOfPolygon(
    initial,
    step,
    limit,
    x,
    y,
    z,
    -w,
    polygon.holes.length,
    (boundary) => {
      for (const [x, y, z] of polygon.points) {
        c.addPoint(boundary, x, y, z);
      }
    },
    (hole, nth) => {
      for (const [x, y, z] of polygon.holes[nth]) {
        c.addPoint(hole, x, y, z);
      }
    },
    (isHole) => {
      points = [];
      if (isHole) {
        output.holes.push.push({ points });
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
    (x, y, z) => points.push([x, y, z])
  );
  return outputs;
};
