import { Shape, fromGeometry, toKeptGeometry } from './Shape';
import { intersection as intersectionGeometry } from '@jsxcad/geometry-tagged';

/**
 *
 * # Intersection
 *
 * Intersection produces a version of the first shape retaining only the parts included in the remaining shapes.
 *
 * Different kinds of shapes do not interact. e.g., you cannot intersect a surface and a solid.
 *
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * intersection(cube(12),
 *              sphere(8))
 * ```
 * :::
 * ::: illustration
 * ```
 * intersection(circle(10).translate(-5),
 *              circle(10).translate(5))
 * ```
 * :::
 * ::: illustration { "view": { "position": [5, 5, 5] } }
 * ```
 * intersection(assemble(cube().below(),
 *                       cube().above()),
 *              sphere(1))
 * ```
 * :::
 * ::: illustration
 * ```
 * assemble(difference(square(10),
 *                     square(7))
 *            .translate(-2, -2),
 *          difference(square(10),
 *                     square(7))
 *            .translate(2, 2));
 * ```
 * :::
 * ::: illustration
 * ```
 * intersection(difference(square(10),
 *                         square(7))
 *                .translate(-2, -2),
 *              difference(square(10),
 *                         square(7))
 *                .translate(2, 2));
 * ```
 * :::
 **/

export const intersection = (...shapes) => {
  switch (shapes.length) {
    case 0: {
      return fromGeometry({ assembly: [] });
    }
    case 1: {
      return shapes[0];
    }
    default: {
      return fromGeometry(intersectionGeometry(...shapes.map(toKeptGeometry)));
    }
  }
};

const method = function (...shapes) { return intersection(this, ...shapes); };

Shape.prototype.intersection = method;
