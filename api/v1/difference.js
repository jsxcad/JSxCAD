import { Shape, fromGeometry, toKeptGeometry } from './Shape';

import { cache } from './cache';
import { difference as differenceGeometry } from '@jsxcad/geometry-tagged';
import { dispatch } from './dispatch';

/**
 *
 * # Difference
 *
 * Difference produces a version of the first shape with the remaining shapes removed, where applicable.
 * Different kinds of shapes do not interact. e.g., you cannot subtract a surface from a solid.
 *
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * difference(Cube(10).below(),
 *            Cube(5).below())
 * ```
 * :::
 * ::: illustration
 * ```
 * difference(Circle(10),
 *            Circle(2.5))
 * ```
 * :::
 * ::: illustration { "view": { "position": [5, 5, 5] } }
 * ```
 * difference(assemble(Cube().below(),
 *                     Cube().above()),
 *            Cube().right())
 * ```
 * :::
 *
 **/

const differenceOfShapes =
  cache((...shapes) => {
    switch (shapes.length) {
      case 0: {
        return fromGeometry({ assembly: [] });
      }
      case 1: {
        // We still want to produce a simple shape.
        return fromGeometry(toKeptGeometry(shapes[0]));
      }
      default: {
        return fromGeometry(differenceGeometry(...shapes.map(toKeptGeometry)));
      }
    }
  });

export const difference = dispatch(
  'difference',
  (...shapes) => {
    return () => differenceOfShapes(...shapes);
  });

const method = function (...shapes) { return difference(this, ...shapes); };

Shape.prototype.difference = method;
