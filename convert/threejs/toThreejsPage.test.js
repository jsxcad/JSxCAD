import { readFileSync, writeFileSync } from 'fs';
import { unitGeodesicSphere20Polygons, unitRegularTrianglePolygon, unitSquarePolygon } from '@jsxcad/data-shape';

import { fromPolygons } from '@jsxcad/algorithm-solid';
import { scale as scalePaths } from '@jsxcad/algorithm-paths';
import { scale as scaleSurface } from '@jsxcad/algorithm-surface';
import { test } from 'ava';
import { toThreejsPage } from './toThreejsPage';

test('Geodesic sphere', async (t) => {
  const html = await toThreejsPage(
    {},
    { assembly: [{ paths: scalePaths([3, 3, 3], [unitRegularTrianglePolygon]), tags: ['paths'] },
                 { solid: fromPolygons({}, unitGeodesicSphere20Polygons), tags: ['solid'] },
                 { z0Surface: scaleSurface([2, 2, 2], [unitSquarePolygon]), tags: ['surface'] }] });
  writeFileSync('toThreejsPage.test.html', html, { encoding: 'utf8' });
  t.is(html, readFileSync('toThreejsPage.test.html', { encoding: 'utf8' }));
});
