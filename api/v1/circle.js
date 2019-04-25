import { assertBoolean, assertEmpty, assertNumber } from './assert';

import { Surface } from './Surface';
import { buildRegularPolygon } from '@jsxcad/algorithm-shape';

const buildCircle = ({ r = 1, fn = 32, center = false }) =>
  Surface.fromPoints(buildRegularPolygon({ edges: fn })).scale(r);

/**
 *
 * circle();                        // openscad like
 * circle(1);
 * circle({r: 2, fn:5});            // fn = number of segments to approximate the circle
 * circle({r: 3, center: true});    // center: false (default)
 *
 */
export const circle = (...params) => {
  // circle({ r: 3, center: true, fn: 5 });
  try {
    const { r, center = false, fn = 32 } = params[0];
    assertNumber(r);
    assertNumber(fn);
    assertBoolean(center);
    return buildCircle({ r: r, fn: fn, center: center });
  } catch (e) {}

  // circle(1);
  try {
    const [r] = params[0];
    assertNumber(r);
    return buildCircle({ r: r });
  } catch (e) {}

  // circle(1);
  try {
    assertEmpty(params);
    return buildCircle({});
  } catch (e) {}
};
