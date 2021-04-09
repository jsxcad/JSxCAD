import { getCgal } from './getCgal.js';

export const outlineSurfaceMesh = (mesh) => {
  console.log(mesh);
  const segments = [];
  getCgal().OutlineSurfaceMesh(mesh, (sx, sy, sz, tx, ty, tz) =>
    segments.push([
      [sx, sy, sz],
      [tx, ty, tz],
    ])
  );
  return segments;
};
