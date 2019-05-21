import { assertEmpty, assertNumberTriple } from './assert';

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
 * point([1, 1, 0])
 * ```
 * :::
 *
 **/

export const point = dispatch(
  'point',
  // point()
  (...rest) => {
    assertEmpty(rest);
    return () => fromValue([0, 0, 0]);
  },
  // point([1, 2, 3])
  (value) => {
    assertNumberTriple(value);
    return () => fromValue(value);
  });

point.fromValue = fromValue;

export default point;
