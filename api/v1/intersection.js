import { Shape, intersectionLazily } from './Shape';

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
 * intersection(circle(10).translate([-5]),
 *              circle(10).translate([5]))
 * ```
 * :::
 *
 **/

export const intersection = (...params) => intersectionLazily(...params);

const method = function (...shapes) { return intersection(this, ...shapes); };

Shape.prototype.intersection = method;
