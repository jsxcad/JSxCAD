import { assertEmpty, assertNumber } from './assert';

import { Shape } from './Shape';
import { dispatch } from './dispatch';

export const fromValue = (point) => Shape.fromPoint(point);

/**
 *
 * # Point
 *
 * Generates a point, by default at the origin.
 *
 * Note: The points are not visible in the illustrations below.
 *
 * ::: illustration
 * ```
 * point()
 * ```
 * :::
 * ::: illustration
 * ```
 * point(1)
 * ```
 * :::
 * ::: illustration
 * ```
 * point(1, 2)
 * ```
 * :::
 * ::: illustration
 * ```
 * point(1, 2, 3)
 * ```
 * :::
 * ::: illustration
 * ```
 * point([1, 1, 0])
 * ```
 * :::
 * ::: illustration
 * ```
 * point([1])
 * ```
 * :::
 * ::: illustration
 * ```
 * point([1, 2])
 * ```
 * :::
 * ::: illustration
 * ```
 * point([1, 2, 3])
 * ```
 * :::
 *
 **/

export const point = dispatch(
  'point',
  // point()
  (x = 0, y = 0, z = 0, ...rest) => {
    assertNumber(x);
    assertNumber(y);
    assertNumber(z);
    assertEmpty(rest);
    return () => fromValue([x, y, z]);
  },
  // point([1, 2, 3])
  ([x = 0, y = 0, z = 0]) => {
    assertNumber(x);
    assertNumber(y);
    assertNumber(z);
    return () => fromValue([x, y, z]);
  });

point.fromValue = fromValue;

export default point;
