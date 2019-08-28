import { assertEmpty, assertNumber } from './assert';

import { Shape } from './Shape';
import { buildRegularIcosahedron } from '@jsxcad/algorithm-shape';
import { dispatch } from './dispatch';

/**
 *
 * # Icosahedron
 *
 * Generates tetrahedrons.
 *
 * ::: illustration { "view": { "position": [8, 8, 8] } }
 * ```
 * Icosahedron()
 * ```
 * :::
 * ::: illustration { "view": { "position": [80, 80, 80] } }
 * ```
 * Icosahedron(10)
 * ```
 * :::
 * ::: illustration { "view": { "position": [60, 60, 60] } }
 * ```
 * Icosahedron({ radius: 8 })
 * ```
 * :::
 * ::: illustration { "view": { "position": [60, 60, 60] } }
 * ```
 * Icosahedron({ diameter: 16 })
 * ```
 * :::
 *
 **/

const unitIcosahedron = () => Shape.fromPolygonsToSolid(buildRegularIcosahedron({}));

export const fromValue = (value) => unitIcosahedron().scale(value);

export const fromRadius = ({ radius }) => unitIcosahedron().scale(radius);

export const fromDiameter = ({ diameter }) => unitIcosahedron().scale(diameter / 2);

export const Icosahedron = dispatch(
  'Icosahedron',
  // Icosahedron()
  (...rest) => {
    assertEmpty(rest);
    return () => fromValue(1);
  },
  // Icosahedron(2)
  (value) => {
    assertNumber(value);
    return () => fromValue(value);
  },
  // Icosahedron({ radius: 2 })
  ({ radius }) => {
    assertNumber(radius);
    return () => fromRadius({ radius });
  },
  // Icosahedron({ diameter: 2 })
  ({ diameter }) => {
    assertNumber(diameter);
    return () => fromDiameter({ diameter });
  });

Icosahedron.fromValue = fromValue;
Icosahedron.fromRadius = fromRadius;
Icosahedron.fromDiameter = fromDiameter;

export default Icosahedron;
