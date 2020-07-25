import { add, cross, orthogonal, scale, unit } from '@jsxcad/math-vec3';

const W = 3;

export const toPolygon = (plane, size = 1e10) => {
  const v = unit(cross(plane, orthogonal(plane)));
  const u = cross(v, plane);
  const origin = scale(plane[W], plane);
  return [
    add(origin, scale(-size, u)),
    add(origin, scale(-size, v)),
    add(origin, scale(size, u)),
    add(origin, scale(size, v)),
  ];
};
