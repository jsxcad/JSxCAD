import { checkSelfIntersection } from './doesSelfIntersectOfSurfaceMesh.js';
import { getCgal } from './getCgal.js';

export const extrudeSurfaceMesh = (
  mesh,
  highX,
  highY,
  highZ,
  lowX,
  lowY,
  lowZ
) =>
  checkSelfIntersection(
    getCgal().ExtrusionOfSurfaceMesh(
      mesh,
      highX,
      highY,
      highZ,
      lowX,
      lowY,
      lowZ
    )
  );
