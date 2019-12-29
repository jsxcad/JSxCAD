import { getAnySurfaces, getPaths } from '@jsxcad/geometry-tagged';
import { toPlane, transform as transformSurface } from '@jsxcad/geometry-surface';

import { Shape } from './Shape';
import { assemble } from './assemble';
import { intersectionOfPathsBySurfaces } from '@jsxcad/algorithm-clipper';
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
  return Shape.fromGeometry({ paths: fills });
};

const fillMethod = function (...args) { return fill(this, ...args); };
Shape.prototype.fill = fillMethod;

const withFillMethod = function (...args) { return assemble(this, fill(this, ...args)); };
Shape.prototype.withFill = withFillMethod;

fill.signature = 'interior(shape:Surface, paths:Paths) -> Paths';
fillMethod.signature = 'Surface -> interior(paths:Paths) -> Paths';
withFillMethod.signature = 'Surface -> interior(paths:Paths) -> Shape';
