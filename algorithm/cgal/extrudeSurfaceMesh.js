import { checkSelfIntersection } from './doesSelfIntersectOfSurfaceMesh.js';
import { getCgal } from './getCgal.js';
import { toCgalTransformFromJsTransform } from './transform.js';

export const extrudeSurfaceMesh = (mesh, transform, height, depth, dir) => {
  const c = getCgal();
  let extrudedMesh;
  c.ExtrusionOfSurfaceMesh(
    mesh,
    toCgalTransformFromJsTransform(transform),
    height,
    depth,
    (normal) => {
      const { direction, exactDirection } = dir;
      if (exactDirection) {
        const [x, y, z] = exactDirection;
        c.fillExactQuadruple(normal, x, y, z, '0');
        return true;
      } else if (direction) {
        const [x, y, z] = direction;
        c.fillQuadruple(normal, x, y, z, 0);
        return true;
      } else {
        return false;
      }
    },
    (result) => {
      extrudedMesh = result;
    }
  );
  if (extrudedMesh) {
    return checkSelfIntersection(extrudedMesh);
  }
};
