import { readFileSync, writeFileSync } from 'fs';
import { assemblyToThreejsPage } from './assemblyToThreejsPage';
import { test } from 'ava';
import { unitGeodesicSphere20Polygons, unitRegularTrianglePolygon, unitSquarePolygon } from '@jsxcad/data-shape';
import { scale as scaleSurface } from '@jsxcad/algorithm-surface';
import { scale as scalePaths } from '@jsxcad/algorithm-paths';
import { fromPolygons } from '@jsxcad/algorithm-solid';

test('Geodesic sphere', t => {
  const page = assemblyToThreejsPage({
                 paths: scalePaths([3, 3, 3], [unitRegularTrianglePolygon]),
                 solids: [fromPolygons({}, unitGeodesicSphere20Polygons)],
                 surfaces: [scaleSurface([2, 2, 2], [unitSquarePolygon])],
               });
  writeFileSync('assemblyToThreejsPage.test.html', page, { encoding: 'utf8' });
  t.is(page,
       readFileSync('assemblyToThreejsPage.test.html', { encoding: 'utf8' }));
});
