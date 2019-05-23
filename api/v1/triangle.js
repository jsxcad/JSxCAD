import { assertEmpty, assertNumber } from './assert';

import { Shape } from './Shape';
import { buildRegularPolygon } from '@jsxcad/algorithm-shape';
import { dispatch } from './dispatch';

/**
 *
 * # Triangle
 *
 * ::: illustration { "view": { "position": [0, 0, 10] } }
 * ```
 * triangle()
 * ```
 * :::
 * ::: illustration
 * ```
 * triangle(10)
 * ```
 * :::
 * ::: illustration
 * ```
 * triangle({ radius: 10 })
 * ```
 * :::
 * ::: illustration
 * ```
 * triangle({ diameter: 20 })
 * ```
 * :::
 **/

// FIX: This uses the circumradius rather than apothem, so that the produced polygon will fit into the specified radius.
// Is this the most useful measure?

const unitTriangle = () =>
  Shape.fromPathToZ0Surface(buildRegularPolygon({ edges: 3 }));

export const fromValue = (radius) => unitTriangle({ resolution: 32 }).scale(radius);

export const fromRadius = ({ radius, resolution = 32 }) => unitTriangle({ resolution }).scale(radius);

export const fromDiameter = ({ diameter, resolution = 32 }) => unitTriangle({ resolution }).scale(diameter / 2);

export const triangle = dispatch(
  'triangle',
  // triangle()
  (...rest) => {
    assertEmpty(rest);
    return () => fromValue(1);
  },
  // triangle(2)
  (value) => {
    assertNumber(value);
    return () => fromValue(value);
  },
  // triangle({ radius: 2, resolution: 32 })
  ({ radius, resolution }) => {
    assertNumber(radius);
    return () => fromRadius({ radius });
  },
  // triangle({ diameter: 2, resolution: 32 })
  ({ diameter, resolution }) => {
    assertNumber(diameter);
    return () => fromDiameter({ diameter });
  });

triangle.fromValue = fromValue;
triangle.fromRadius = fromRadius;
triangle.fromDiameter = fromDiameter;

export default triangle;
