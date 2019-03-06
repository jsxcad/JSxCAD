const buildGeodesicSphere = require('./buildGeodesicSphere');
const { canonicalize } = require('@jsxcad/algorithm-polygons');
const { unitGeodesicSphere } = require('@jsxcad/data-shape');
const test = require('ava');

test('Build minimal sphere.', t => {
  t.deepEqual(canonicalize(buildGeodesicSphere({})), unitGeodesicSphere.unitGeodesicSphere20Polygons);
});

test('Test subdivision.', t => {
  t.deepEqual(canonicalize(buildGeodesicSphere({ faces: 80 })), unitGeodesicSphere.unitGeodesicSphere80Polygons);
});

test('Show subdivision starts at 21.', t => {
  t.is(buildGeodesicSphere({ faces: 21 }).length, 80);
});

test('Show subdivision stops until 80.', t => {
  t.is(buildGeodesicSphere({ faces: 80 }).length, 80);
});

test('Show next subdivision starts at 81.', t => {
  t.is(buildGeodesicSphere({ faces: 81 }).length, 320);
});
