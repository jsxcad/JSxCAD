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
 * Point()
 * ```
 * :::
 * ::: illustration
 * ```
 * Point(1)
 * ```
 * :::
 * ::: illustration
 * ```
 * Point(1, 2)
 * ```
 * :::
 * ::: illustration
 * ```
 * Point(1, 2, 3)
 * ```
 * :::
 * ::: illustration
 * ```
 * Point([1, 1, 0])
 * ```
 * :::
 * ::: illustration
 * ```
 * Point([1])
 * ```
 * :::
 * ::: illustration
 * ```
 * Point([1, 2])
 * ```
 * :::
 * ::: illustration
 * ```
 * Point([1, 2, 3])
 * ```
 * :::
 *
 **/

export const Point = dispatch(
  'Point',
  // Point()
  (x = 0, y = 0, z = 0, ...rest) => {
    assertNumber(x);
    assertNumber(y);
    assertNumber(z);
    assertEmpty(rest);
    return () => fromValue([x, y, z]);
  },
  // Point([1, 2, 3])
  ([x = 0, y = 0, z = 0]) => {
    assertNumber(x);
    assertNumber(y);
    assertNumber(z);
    return () => fromValue([x, y, z]);
  });

Point.fromValue = fromValue;

export default Point;
