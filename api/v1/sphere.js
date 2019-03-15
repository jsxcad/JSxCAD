import { CSG } from './CSG';
import { buildRingSphere } from '@jsxcad/algorithm-shape';
import { assertBoolean, assertEmpty, assertNumber, assertSingle } from './assert';

const buildSphere = ({ r = 1, fn = 32 }) => CSG.fromPolygons(buildRingSphere({ resolution: fn })).scale([r, r, r]);

const decode = (params) => {
  // sphere();
  try {
    assertEmpty(params);
    return {};
  } catch (e) {}

  // sphere(2);
  try {
    assertSingle(params);
    const [radius] = params;
    assertNumber(radius);
    return { r: radius };
  } catch (e) {}

  // sphere({ r: 10, fn: 100 });  // geodesic approach (icosahedron further triangulated)
  try {
    assertSingle(params);
    const { r = 1, fn = 32, center = false } = params[0];
    assertNumber(r);
    assertNumber(fn);
    assertBoolean(center);
    return { fn: fn, r: r };
  } catch (e) {}

  throw Error(`Unsupported interface for sphere: ${JSON.stringify(params)}`);
};

/**
 *
 * sphere();                          // openscad like
 * sphere(1);
 * sphere({r: 2});                    // Note: center:true is default (unlike other primitives, as OpenSCAD)
 * sphere({r: 2, center: true});     // Note: OpenSCAD doesn't support center for sphere but we do
 * sphere({r: 2, center: [false, false, true]}); // individual axis center
 * sphere({r: 10, fn: 100 });
 * sphere({r: 10, fn: 100, type: 'geodesic'});  // geodesic approach (icosahedron further triangulated)
 */
export const sphere = (...params) => buildSphere(decode(params));
