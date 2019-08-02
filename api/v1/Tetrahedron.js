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
 * Tetrahedron()
 * ```
 * :::
 * ::: illustration { "view": { "position": [80, 80, 80] } }
 * ```
 * Tetrahedron(10)
 * ```
 * :::
 * ::: illustration { "view": { "position": [60, 60, 60] } }
 * ```
 * Tetrahedron({ radius: 8 })
 * ```
 * :::
 * ::: illustration { "view": { "position": [60, 60, 60] } }
 * ```
 * Tetrahedron({ diameter: 16 })
 * ```
 * :::
 *
 **/

const unitTetrahedron = () => Shape.fromPolygonsToSolid(buildRegularTetrahedron({}));

export const fromValue = (value) => unitTetrahedron().scale(value);

export const fromRadius = ({ radius }) => unitTetrahedron().scale(radius);

export const fromDiameter = ({ diameter }) => unitTetrahedron().scale(diameter / 2);

export const Tetrahedron = dispatch(
  'Tetrahedron',
  // Tetrahedron()
  (...rest) => {
    assertEmpty(rest);
    return () => fromValue(1);
  },
  // Tetrahedron(2)
  (value) => {
    assertNumber(value);
    return () => fromValue(value);
  },
  // Tetrahedron({ radius: 2 })
  ({ radius }) => {
    assertNumber(radius);
    return () => fromRadius({ radius });
  },
  // Tetrahedron({ diameter: 2 })
  ({ diameter }) => {
    assertNumber(diameter);
    return () => fromDiameter({ diameter });
  });

Tetrahedron.fromValue = fromValue;
Tetrahedron.fromRadius = fromRadius;
Tetrahedron.fromDiameter = fromDiameter;

export default Tetrahedron;
