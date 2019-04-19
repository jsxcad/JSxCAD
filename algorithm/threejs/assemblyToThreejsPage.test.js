import { readFileSync, writeFileSync } from 'fs';
import { assemblyToThreejsPage } from './assemblyToThreejsPage';
import { test } from 'ava';
import { unitGeodesicSphere20Polygons, unitRegularTrianglePolygon, unitSquarePolygon } from '@jsxcad/data-shape';
import { scale as scaleSurface } from '@jsxcad/algorithm-surface';
import { scale as scalePaths } from '@jsxcad/algorithm-paths';
import { fromPolygons } from '@jsxcad/algorithm-solid';

test('Geodesic sphere', async (t) => {
  const html = await assemblyToThreejsPage(
    {},
    {
      paths: scalePaths([3, 3, 3], [unitRegularTrianglePolygon]),
      solids: [fromPolygons({}, unitGeodesicSphere20Polygons)],
      surfaces: [scaleSurface([2, 2, 2], [unitSquarePolygon])]
    });
  writeFileSync('assemblyToThreejsPage.test.html', html, { encoding: 'utf8' });
  t.is(html, readFileSync('assemblyToThreejsPage.test.html', { encoding: 'utf8' }));
});
