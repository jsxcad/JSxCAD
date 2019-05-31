
import { unitGeodesicSphere20Polygons, unitRegularTrianglePolygon, unitSquarePolygon } from '@jsxcad/data-shape';

import { fromPolygons } from '@jsxcad/geometry-solid';
import fs from 'fs';
import { scale as scalePaths } from '@jsxcad/geometry-paths';
import { scale as scaleSurface } from '@jsxcad/geometry-surface';
import test from 'ava';
import { toSvg } from './toSvg';

const { readFile } = fs.promises;

test('Example', async (t) => {
  const svg = await toSvg(
    { view: { position: [0, 0, 16] } },
    { assembly: [{ paths: scalePaths([3, 3, 3], [unitRegularTrianglePolygon]), tags: ['paths'] },
                 { solid: fromPolygons({}, unitGeodesicSphere20Polygons), tags: ['solid'] },
                 { z0Surface: scaleSurface([2, 2, 2], [unitSquarePolygon]), tags: ['surface'] }] });
  t.is(svg, await readFile('toThreejsPage.test.svg', { encoding: 'utf8' }));
});
