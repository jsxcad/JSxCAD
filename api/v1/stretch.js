import { cutOpen, section } from '@jsxcad/algorithm-bsp-surfaces';
import { flip, toPlane, transform as transformSurface } from '@jsxcad/geometry-surface';
import { getAnySurfaces, getSolids } from '@jsxcad/geometry-tagged';

import { Shape } from './Shape';
import { Z } from './Z';
import { assemble } from './assemble';
import { extrude } from '@jsxcad/algorithm-shape';
import { fromTranslation } from '@jsxcad/math-mat4';
import { scale } from '@jsxcad/math-vec3';
import { toXYPlaneTransforms } from '@jsxcad/math-plane';
import { transform as transformSolid } from '@jsxcad/geometry-solid';

/**
 *
 * # Stretch
 *
 **/

export const stretch = (shape, length, planeShape = Z()) => {
  const stretches = [];
  for (const { surface, z0Surface } of getAnySurfaces(planeShape.toKeptGeometry())) {
    const planeSurface = surface || z0Surface;
    for (const { solid, tags } of getSolids(shape.toKeptGeometry())) {
      const bottom = cutOpen(solid, planeSurface);
      const profile = section(solid, planeSurface);
      const top = cutOpen(solid, flip(planeSurface));
      const [toZ0, fromZ0] = toXYPlaneTransforms(toPlane(profile));
      const z0SolidGeometry = extrude(transformSurface(toZ0, profile), length, 0, 1, 0, false);
      const middle = transformSolid(fromZ0, z0SolidGeometry);
      const topMoved = transformSolid(fromTranslation(scale(length, toPlane(profile))), top);
      stretches.push(Shape.fromGeometry({ solid: [...bottom, ...middle, ...topMoved], tags }));
    }
  }

  return assemble(...stretches);
};

const method = function (...args) { return stretch(this, ...args); };

Shape.prototype.stretch = method;
