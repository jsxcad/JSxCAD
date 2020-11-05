import { subtract } from '@jsxcad/math-vec3';

export const flip = (points) =>
  points.map((point) => {
    if (point.length <= 3) {
      return point;
    }
    const [x, y, z, xF, yF, zF, xR, yR, zR] = point;
    const [xFR, yFR, zFR] = subtract(
      [x, y, z],
      subtract([xR, yR, zR], [x, y, z])
    );
    return [x, y, z, xF, yF, zF, xFR, yFR, zFR];
  });
