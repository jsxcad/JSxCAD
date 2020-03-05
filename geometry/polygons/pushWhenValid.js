import { squaredDistance } from '@jsxcad/math-vec3';
import { fromPolygon } from '@jsxcad/math-plane';
import { flip } from '@jsxcad/geometry-path';

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
  if (expectedPlane !== undefined) {
    const t = dot(plane, expectedPlane);
    if (t < 0.9999999999999) {
      console.log(`QQ/skew: ${t}`);
    }
  }
/*
  if (JSON.stringify(validated) === "[[-3.236067977499788,69.6488589908301,8],[-3.236067977499788,69.64540904256228,8],[-10.5,72,8]]") {
    console.log(`QQ/bad/2`);
    // out.push(flip(validated));
    out.push(validated);
    return;
  }
  if (JSON.stringify(validated) === "[[-3.236067977499788,69.6488589908301,8],[1.236067977499787,68.19577393481939,8],[-3.236067977499788,69.64540904256228,8]]") {
    console.log(`QQ/bad/2a`);
    // out.push(flip(validated));
    out.push(validated);
    return;
  }
*/
  out.push(validated);
};
