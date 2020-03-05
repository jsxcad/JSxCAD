import { fromPolygon } from '@jsxcad/math-plane';
import { squaredDistance } from '@jsxcad/math-vec3';

// const EPSILON = 1e-5;
const EPSILON2 = 1e-10;

export const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

export const pushWhenValid = (out, points, expectedPlane) => {
  const validated = [];
  const l = points.length;
  for (let i = 0; i < l; i++) {
    let good = true;
    for (let j = i + 1; j < l; j++) {
      const sd = squaredDistance(points[i], points[j]);
      if (sd <= EPSILON2) {
        good = false;
        break;
      }
    }
    if (good) {
      validated.push(points[i]);
    }
  }
  if (validated.length < 3) {
    return;
  }
  const plane = fromPolygon(validated);
  if (plane === undefined) {
    return;
  }
  out.push(validated);
};
