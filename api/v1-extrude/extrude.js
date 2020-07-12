import {
  alignVertices,
  transform as transformSolid,
} from '@jsxcad/geometry-solid';
import { getPlans, getSurfaces, getZ0Surfaces } from '@jsxcad/geometry-tagged';
import {
  toPlane as toPlaneOfSurface,
  transform as transformSurface,
} from '@jsxcad/geometry-surface';

import { Assembly } from '@jsxcad/api-v1-shapes';
import { Shape } from '@jsxcad/api-v1-shape';
import { extrude as extrudeAlgorithm } from '@jsxcad/algorithm-shape';
import { toXYPlaneTransforms } from '@jsxcad/math-plane';

/**
 *
 * # Extrude
 *
 * Generates a solid from a surface by linear extrusion.
 *
 * ```
 * shape.extrude(height, depth, { twist = 0, steps = 1 })
 * ```
 *
 * ::: illustration
 * ```
 * Circle(10).cut(Circle(8))
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 60] } }
 * ```
 * Circle(10).cut(Circle(8)).extrude(10)
 * ```
 * :::
 *
 * ::: illustration { "view": { "position": [40, 40, 60] } }
 * ```
 * Triangle(10).extrude(5, -2)
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 60] } }
 * ```
 * Triangle(10).extrude(10, 0, { twist: 90, steps: 10 })
 * ```
 * :::
 *
 **/

export const extrude = (shape, height = 1, depth = 0) => {
  if (height < depth) {
    [height, depth] = [depth, height];
  }
  // FIX: Handle extrusion along a vector properly.
  const solids = [];
  const keptGeometry = shape.toKeptGeometry();
  for (const { z0Surface, tags } of getZ0Surfaces(keptGeometry)) {
    if (z0Surface.length > 0) {
      const solid = alignVertices(extrudeAlgorithm(z0Surface, height, depth));
      solids.push(Shape.fromGeometry({ type: 'solid', solid, tags }));
    }
  }
  for (const { surface, tags } of getSurfaces(keptGeometry)) {
    if (surface.length > 0) {
      const plane = toPlaneOfSurface(surface);
      if (
        plane[0] === 0 &&
        plane[1] === 0 &&
        plane[2] === 1 &&
        plane[3] === 0
      ) {
        // Detect Z0.
        // const solid = alignVertices(extrudeAlgorithm(surface, height, depth));
        const solid = extrudeAlgorithm(surface, height, depth);
        solids.push(Shape.fromGeometry({ type: 'solid', solid, tags }));
      } else {
        const [toZ0, fromZ0] = toXYPlaneTransforms(toPlaneOfSurface(surface));
        const z0SolidGeometry = extrudeAlgorithm(
          transformSurface(toZ0, surface),
          height,
          depth
        );
        const solid = alignVertices(transformSolid(fromZ0, z0SolidGeometry));
        solids.push(Shape.fromGeometry({ type: 'solid', solid, tags }));
      }
    }
  }
  // Keep plans.
  for (const entry of getPlans(keptGeometry)) {
    solids.push(entry);
  }
  return Assembly(...solids);
};

const extrudeMethod = function (...args) {
  return extrude(this, ...args);
};
Shape.prototype.extrude = extrudeMethod;

export default extrude;

extrude.signature =
  'extrude(shape:Shape, height:number = 1, depth:number = 1) -> Shape';
extrudeMethod.signature =
  'Shape -> extrude(height:number = 1, depth:number = 1) -> Shape';
