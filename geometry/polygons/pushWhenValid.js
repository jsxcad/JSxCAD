import { squaredDistance } from '@jsxcad/math-vec3';

// const EPSILON = 1e-5;
const EPSILON2 = 1e-10;

export const pushWhenValid = (out, points) => {
  const validated = [];
  const l = points.length;
  for (let i = 0; i < l; i++) {
    let good = true;
    for (let j = i + 1; j < l; j++) {
      const sd = squaredDistance(points[i], points[j]);
console.log(`QQ/a: ${points[i]}`);
console.log(`QQ/b: ${points[j]}`);
console.log(`QQ/sd: ${sd}`);
      if (sd <= EPSILON2) {
        good = false;
        break;
      }
    }
    if (good) {
      validated.push(points[i]);
    }
  }
  if (validated.length >= 3) {
    out.push(validated);
  }
};
