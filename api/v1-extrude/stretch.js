import { Shape, assemble } from '@jsxcad/api-v1-shape';
import { cutOpen, section } from '@jsxcad/algorithm-bsp-surfaces';
import { flip, toPlane, transform as transformSurface } from '@jsxcad/geometry-surface';
import { getPlans, getSolids } from '@jsxcad/geometry-tagged';

import { Z } from '@jsxcad/api-v1-connector';
import { extrude } from '@jsxcad/algorithm-shape';
import { fromTranslation } from '@jsxcad/math-mat4';
import { scale } from '@jsxcad/math-vec3';
import { toXYPlaneTransforms } from '@jsxcad/math-plane';
import { transform as transformPath } from '@jsxcad/geometry-path';
import { transform as transformSolid } from '@jsxcad/geometry-solid';

/**
 *
 * # Stretch
 *
 **/

const toPlaneFromConnector = (connector) => {
  for (const entry of getPlans(connector.toKeptGeometry())) {
    if (entry.plan && entry.plan.connector) {
      return entry.planes[0];
    }
  }
};

const toSurface = (plane) => {
  const max = +1e5;
  const min = -1e5;
  const [, from] = toXYPlaneTransforms(plane);
  const path = [[max, max, 0], [min, max, 0], [min, min, 0], [max, min, 0]];
  const polygon = transformPath(from, path);
  return [polygon];
};

export const stretch = (shape, length, connector = Z()) => {
  const stretches = [];
  const planeSurface = toSurface(toPlaneFromConnector(connector));
  for (const { solid, tags } of getSolids(shape.toKeptGeometry())) {
    if (solid.length === 0) {
      continue;
    }
    const bottom = cutOpen(solid, planeSurface);
    const profile = section(solid, planeSurface);
    const top = cutOpen(solid, flip(planeSurface));
    const [toZ0, fromZ0] = toXYPlaneTransforms(toPlane(profile));
    const z0SolidGeometry = extrude(transformSurface(toZ0, profile), length, 0, 1, 0, false);
    const middle = transformSolid(fromZ0, z0SolidGeometry);
    const topMoved = transformSolid(fromTranslation(scale(length, toPlane(profile))), top);
    stretches.push(Shape.fromGeometry({ solid: [...bottom, ...middle, ...topMoved], tags }));
  }

  return assemble(...stretches);
};

const method = function (...args) { return stretch(this, ...args); };
Shape.prototype.stretch = method;

export default stretch;
