import {
  unitGeodesicSphere20Polygons,
  unitGeodesicSphere80Polygons,
} from '@jsxcad/data-shape';

import { buildGeodesicSphere } from './buildGeodesicSphere.js';
import { canonicalize } from './canonicalize.js';
import test from 'ava';

test('Build minimal sphere.', (t) => {
  t.deepEqual(
    canonicalize(buildGeodesicSphere()),
    unitGeodesicSphere20Polygons
  );
});

test('Test subdivision.', (t) => {
  t.deepEqual(
    canonicalize(buildGeodesicSphere(80)),
    unitGeodesicSphere80Polygons
  );
});

test('Show subdivision starts at 21.', (t) => {
  t.is(buildGeodesicSphere(21).length, 80);
});

test('Show subdivision stops until 80.', (t) => {
  t.is(buildGeodesicSphere(80).length, 80);
});

test('Show next subdivision starts at 81.', (t) => {
  t.is(buildGeodesicSphere(81).length, 320);
});
