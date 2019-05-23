import { assertEmpty, assertNumber } from './assert';

import { Shape } from './Shape';
import { buildRegularTetrahedron } from '@jsxcad/algorithm-shape';
import { dispatch } from './dispatch';

/**
 *
 * # Tetrahedron
 *
 * Generates tetrahedrons.
 *
 * ::: illustration { "view": { "position": [8, 8, 8] } }
 * ```
 * tetrahedron()
 * ```
 * :::
 * ::: illustration { "view": { "position": [80, 80, 80] } }
 * ```
 * tetrahedron(10)
 * ```
 * :::
 * ::: illustration { "view": { "position": [60, 60, 60] } }
 * ```
 * tetrahedron({ radius: 8 })
 * ```
 * :::
 * ::: illustration { "view": { "position": [60, 60, 60] } }
 * ```
 * tetrahedron({ diameter: 16 })
 * ```
 * :::
 *
 **/

const unitTetrahedron = () => Shape.fromPolygonsToSolid(buildRegularTetrahedron({}));

export const fromValue = (value) => unitTetrahedron().scale(value);

export const fromRadius = ({ radius }) => unitTetrahedron().scale(radius);

export const fromDiameter = ({ diameter }) => unitTetrahedron().scale(diameter / 2);

export const tetrahedron = dispatch(
  'tetrahedron',
  // tetrahedron()
  (...rest) => {
    assertEmpty(rest);
    return () => fromValue(1);
  },
  // tetrahedron(2)
  (value) => {
    assertNumber(value);
    return () => fromValue(value);
  },
  // tetrahedron({ radius: 2 })
  ({ radius }) => {
    assertNumber(radius);
    return () => fromRadius({ radius });
  },
  // tetrahedron({ diameter: 2 })
  ({ diameter }) => {
    assertNumber(diameter);
    return () => fromDiameter({ diameter });
  });

tetrahedron.fromValue = fromValue;
tetrahedron.fromRadius = fromRadius;
tetrahedron.fromDiameter = fromDiameter;

export default tetrahedron;
