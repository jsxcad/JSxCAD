import { getCgal } from './getCgal.js';
import { toCgalTransformFromJsTransform } from './transform.js';

export const pushSurfaceMesh = (
  mesh,
  transform,
  force,
  minimumDistance,
  scale = 1
) =>
  getCgal().PushSurfaceMesh(
    mesh,
    toCgalTransformFromJsTransform(transform),
    force,
    minimumDistance,
    scale
  );
