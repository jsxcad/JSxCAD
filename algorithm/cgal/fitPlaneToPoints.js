import { getCgal } from './getCgal.js';

const X = 0;
const Y = 1;
const Z = 2;
const W = 3;

export const fitPlaneToPoints = (points) => {
  try {
    const c = getCgal();
    const plane = [0, 0, 1, 0];
    c.FitPlaneToPoints(
      (triples) => {
        let count = 0;
        for (const [x, y, z] of points) {
          c.addDoubleTriple(triples, x, y, z);
          if (count++ > 1000) {
            // We're blowing the stack when this is too high.
            break;
          }
        }
      },
      (x, y, z, w) => {
        plane[X] = x;
        plane[Y] = y;
        plane[Z] = z;
        plane[W] = -w;
      }
    );
    return plane;
  } catch (error) {
    throw Error(error);
  }
};
