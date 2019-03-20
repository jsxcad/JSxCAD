import { readFileSync } from 'fs';
import { trianglesToThreejsPage } from './trianglesToThreejsPage';
import { test } from 'ava';
import { unitGeodesicSphere20Polygons } from '@jsxcad/data-shape';

test('Geodesic sphere', t => {
  const page = trianglesToThreejsPage({}, unitGeodesicSphere20Polygons);
  t.is(page, readFileSync('trianglesToThreejsPage.test.sphere.html', { encoding: 'utf8' }));
});
