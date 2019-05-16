import { assertEmpty, assertNumber } from './assert';

import { Shape } from './Shape';
import { buildRegularPolygon } from '@jsxcad/algorithm-shape';
import { dispatch } from './dispatch';

// FIX: This uses the circumradius rather than apothem, so that the produced polygon will fit into the specified circle.
// Is this the most useful measure?
const unitCircle = ({ resolution = 32 }) =>
  Shape.fromPathToZ0Surface(buildRegularPolygon({ edges: resolution }));

export const fromRadius = ({ radius, resolution }) => unitCircle({ resolution }).scale(radius);
export const fromDiameter = ({ diameter, resolution }) => unitCircle({ resolution }).scale(diameter / 2);

export const circle = dispatch(
  'circle',
  // circle()
  (...rest) => {
    assertEmpty(rest);
    return () => unitCircle();
  },
  // circle(2)
  (radius) => {
    assertNumber(radius);
    return () => fromRadius({ radius });
  },
  // circle({ r: 2, fn: 32 })
  ({ r, fn }) => {
    assertNumber(r);
    return () => fromRadius({ radius: r, resolution: fn });
  },
  // circle({ radius: 2, resolution: 32 })
  ({ radius, resolution }) => {
    assertNumber(radius);
    return () => fromRadius({ radius, resolution });
  },
  // circle({ diameter: 2, resolution: 32 })
  ({ diameter, resolution }) => {
    assertNumber(diameter);
    return () => fromDiameter({ diameter, resolution });
  });

export default circle;
