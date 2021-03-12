import { getCgal } from './getCgal.js';

const X = 0;
const Y = 1;
const Z = 2;

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
  let lastPoint;
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
      for (const [x, y, z] of polygon.points) {
        c.addPoint(boundary, x, y, z);
      }
    },
    (hole, nth) => {
      for (const [x, y, z] of polygon.holes[nth].points) {
        c.addPoint(hole, x, y, z);
      }
    },
    (isHole) => {
      points = [];
      lastPoint = undefined;
      if (isHole) {
        output.holes.push({ points });
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
      if (
        !lastPoint ||
        lastPoint[X] !== x ||
        lastPoint[Y] !== y ||
        lastPoint[Z] !== z
      ) {
        lastPoint = [x, y, z];
        points.push(lastPoint);
      }
    }
  );
  return outputs;
};
