import { unitGeodesicSphere20Polygons, unitRegularTrianglePolygon, unitSquarePolygon } from '@jsxcad/data-shape';

import { fromPolygons } from '@jsxcad/geometry-solid';
import fs from 'fs';
import { scale as scalePaths } from '@jsxcad/geometry-paths';
import { scale as scaleSurface } from '@jsxcad/geometry-surface';
import test from 'ava';
import { toPng } from './toPng';

const { readFile, writeFile } = fs.promises;

test('Example', async (t) => {
  const png = await toPng(
    { view: { position: [0, 0, 32] } },
    { assembly: [{ paths: scalePaths([3, 3, 3], [unitRegularTrianglePolygon]), tags: ['paths'] },
                 { solid: fromPolygons({}, unitGeodesicSphere20Polygons), tags: ['solid'] },
                 { z0Surface: scaleSurface([2, 2, 2], [unitSquarePolygon]), tags: ['surface'] }] });
  await writeFile('toThreejsPage.test.png', png);
  t.deepEqual(png, new Uint8Array(await readFile('toThreejsPage.test.png')));
});
