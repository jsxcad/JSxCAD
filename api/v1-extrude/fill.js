import { Shape, assemble } from '@jsxcad/api-v1-shape';
import { getAnySurfaces, getPaths } from '@jsxcad/geometry-tagged';
import {
  toPlane,
  transform as transformSurface,
} from '@jsxcad/geometry-surface';

import { intersectionOfPathsBySurfaces } from '@jsxcad/geometry-z0surface-boolean';
import { toXYPlaneTransforms } from '@jsxcad/math-plane';
import { transform as transformPaths } from '@jsxcad/geometry-paths';

export const fill = (shape, pathsShape) => {
  const fills = [];
  for (const { surface, z0Surface } of getAnySurfaces(shape.toKeptGeometry())) {
    const anySurface = surface || z0Surface;
    const plane = toPlane(anySurface);
    const [to, from] = toXYPlaneTransforms(plane);
    const flatSurface = transformSurface(to, anySurface);
    for (const { paths } of getPaths(pathsShape.toKeptGeometry())) {
      const flatPaths = transformPaths(to, paths);
      const flatFill = intersectionOfPathsBySurfaces(flatPaths, flatSurface);
      const fill = transformPaths(from, flatFill);
      fills.push(...fill);
    }
  }
  return Shape.fromGeometry({ type: 'paths', paths: fills });
};

const fillMethod = function (...args) {
  return fill(this, ...args);
};
Shape.prototype.fill = fillMethod;

const withFillMethod = function (...args) {
  return assemble(this, fill(this, ...args));
};
Shape.prototype.withFill = withFillMethod;

export default fill;
