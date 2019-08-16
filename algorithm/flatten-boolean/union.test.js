// import { Polygon, point } from '@flatten-js/core';
import { canonicalize, transform } from '@jsxcad/geometry-polygons';

import { degToRad } from '@jsxcad/math-utils';
import { fromZRotation } from '@jsxcad/math-mat4';
import test from 'ava';
// import { unify } from '@flatten-js/boolean-op';
import { union } from './union';

const rectangle = [[[0, 0, 0], [2, 0, 0], [2, 1, 0], [0, 1, 0]]];

test('union: Union of no geometries produces an empty geometry', t => {
  t.deepEqual(union(),
              []);
});

test('union: Union of one geometry produces that geometry', t => {
  t.deepEqual(canonicalize(union(rectangle)),
              canonicalize(rectangle));
});

test('union: Union of rectangle with itself produces itself', t => {
  const result = union(rectangle, rectangle);
  t.deepEqual(canonicalize(result),
              canonicalize(rectangle));
});

test('union: Union of rectangle with itself rotated 90 degrees produces L', t => {
  const result = union(rectangle, transform(fromZRotation(degToRad(90)), rectangle));
  t.deepEqual(canonicalize(result),
              [[[0, 0, 0], [2, 0, 0], [2, 1, 0], [0, 1, 0]], [[0, 0, 0], [0, 2, 0], [-1, 2, 0], [-1, 0, 0]]]);
});

/*
test('bad', t => {
  const a = [[[0.0038566398538067426, -0.05711818784841144, -1.1102230246251565e-16], [0.027451566277452343, 0.010121095260507057, -1.1102230246251565e-16], [-0.007578939370510268, 0.028567406105599685, 0], [-0.007578939370510268, -0.05203184177985917, -1.1102230246251565e-16]], [[-0.030046587894975794, -0.042038623815088355, -4.440892098500626e-16], [-0.007578939370510268, -0.05203184177985917, -1.1102230246251565e-16], [-0.007578939370510268, 0.028567406105599685, 0], [-0.01714635591203731, 0.033605401882281144, 0]]];
  const b = [[[-0.007578939370510268, 0.028567406105599685, 0], [0.027451566277452343, 0.010121095260507057, -1.1102230246251565e-16], [0.04688704952527964, 0.0655070683716446, -3.3306690738754696e-16], [0.016656535759185374, 0.08343556096136145, 0], [-0.007578939370510275, 0.08970655600740696, 1.1102230246251565e-16]], [[-0.007578939370510268, 0.028567406105599685, 0], [-0.007578939370510275, 0.08970655600740696, 1.1102230246251565e-16], [-0.01714635591203731, 0.033605401882281144, 0]]];
  const r = union(a, b);
  t.deepEqual(r, []);
});

test('indefinite loop', t => {
  const a = [[[0.0038566398538067426, -0.05711818784841144, -1.1102230246251565e-16], [0.027451566277452343, 0.010121095260507057, -1.1102230246251565e-16], [-0.007578939370510268, 0.028567406105599685, 0], [-0.007578939370510268, -0.05203184177985917, -1.1102230246251565e-16]], [[-0.030046587894975794, -0.042038623815088355, -4.440892098500626e-16], [-0.007578939370510268, -0.05203184177985917, -1.1102230246251565e-16], [-0.007578939370510268, 0.028567406105599685, 0], [-0.01714635591203731, 0.033605401882281144, 0]]];

  const b = [[[-0.007578939370510268, 0.028567406105599685, 0], [0.027451566277452343, 0.010121095260507057, -1.1102230246251565e-16], [0.04688704952527964, 0.0655070683716446, -3.3306690738754696e-16], [0.016656535759185374, 0.08343556096136145, 0], [-0.007578939370510275, 0.08970655600740696, 1.1102230246251565e-16]], [[-0.007578939370510268, 0.028567406105599685, 0], [-0.007578939370510275, 0.08970655600740696, 1.1102230246251565e-16], [-0.01714635591203731, 0.033605401882281144, 0]]];

  const fromSurface = (surface) => {
    const flattenPolygon = new Polygon();
    for (const polygon of surface) {
      flattenPolygon.addFace(polygon.map(([x, y]) => point(x, y)));
    }
    return flattenPolygon;
  };

  // The unify operation seems to loop indefinitely.
  unify(fromSurface(a), fromSurface(b));
  t.is(1, 2);
});
*/
