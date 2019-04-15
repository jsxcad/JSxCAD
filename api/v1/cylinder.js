import { CSG } from './CSG';
import { assertEmpty, assertNumber } from './assert';
import { buildRegularPrism } from '@jsxcad/algorithm-shape';

const buildCylinder = ({ r1 = 1, r2 = 1, h = 1, edges = 32 }) => {
  return CSG.fromPolygons(buildRegularPrism({ edges: edges })).scale([r1, r1, h]);
};

/**
 *
 * cylinder();              // unit cylinder
 * cylinder({r: 1, h: 10});                 // openscad like
 * cylinder({d: 1, h: 10});
 * cylinder({r: 1, h: 10, center: true});   // default: center:false
 * cylinder({r: 1, h: 10, center: [true, true, false]});  // individual x,y,z center flags
 * cylinder({r: 1, h: 10, round: true});
 * cylinder({r1: 3, r2: 0, h: 10});
 * cylinder({d1: 1, d2: 0.5, h: 10});
 * cylinder({start: [0,0,0], end: [0,0,10], r1: 1, r2: 2, fn: 50});
 *
 */
export const cylinder = (...params) => {
  // cylinder()
  try {
    assertEmpty(params);
    return buildCylinder({});
  } catch (e) {}

  // cylinder({r: 1, h: 10, center: true});
  try {
    const { h, r, fn = 32 } = params[0];
    assertNumber(h);
    assertNumber(r);
    return buildCylinder({ r1: r, r2: r, h: h, edges: fn });
  } catch (e) {}

  // cylinder({ r1: 1, r2: 2, h: 10, center: true});
  try {
    const { h, r1, r2, fn = 32 } = params[0];
    assertNumber(h);
    assertNumber(r1);
    assertNumber(r2);
    return buildCylinder({ r1: r1, r2: r2, h: h, edges: fn });
  } catch (e) {}

  // cylinder({ faces: 32, diameter: 1, height: 10 });
  try {
    const { diameter, height, faces } = params[0];
    assertNumber(diameter);
    assertNumber(faces);
    assertNumber(height);
    return buildCylinder({ r1: diameter / 2, r1: diameter / 2, h: height, center: true, edges: faces });
  } catch (e) {}

  throw Error(`Unsupported interface for cylinder: ${JSON.stringify(params)}`);
};
