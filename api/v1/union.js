import { Shape, unionLazily } from './Shape';

/**
 *
 * # Union
 *
 * Union produces a version of the first shape extended to cover the remaining shapes, as applicable.
 * Different kinds of shapes do not interact. e.g., you cannot union a surface and a solid.
 *
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * union(sphere(5).left(),
 *       sphere(5),
 *       sphere(5).right())
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * union(sphere(5).left(),
 *       sphere(5),
 *       sphere(5).right())
 *   .crossSection()
 *   .outline()
 * ```
 * :::
 * ::: illustration { "view": { "position": [0, 0, 5] } }
 * ```
 * union(triangle(),
 *       triangle().rotateZ(180))
 * ```
 * :::
 * ::: illustration { "view": { "position": [0, 0, 5] } }
 * ```
 * union(triangle(),
 *       triangle().rotateZ(180))
 *   .outline()
 * ```
 * :::
 * ::: illustration { "view": { "position": [5, 5, 5] } }
 * ```
 * union(assemble(cube().left(),
 *                cube().right()),
 *       cube().front())
 *   .crossSection()
 *   .outline()
 * ```
 * :::
 *
 **/

export const union = (...params) => {
  switch (params.length) {
    case 0: {
      return Shape.fromGeometry({ assembly: [] });
    }
    case 1: {
      return params[0];
    }
    default: {
      return unionLazily(...params);
    }
  }
};

const method = function (...shapes) { return union(this, ...shapes); };

Shape.prototype.union = method;
