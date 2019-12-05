import { unitGeodesicSphere20Polygons, unitRegularTrianglePolygon, unitSquarePolygon } from '@jsxcad/data-shape';

import { fromPolygons } from '@jsxcad/geometry-solid';
import fs from 'fs';
import { scale as scalePaths } from '@jsxcad/geometry-paths';
import { scale as scaleSurface } from '@jsxcad/geometry-surface';
import test from 'ava';
import { toThreejsPage } from './toThreejsPage';

const { readFile, writeFile } = fs.promises;

test('No-eval geodesic sphere', async (t) => {
  const html = await toThreejsPage(
    { includeEvaluator: false },
    { assembly: [{ paths: scalePaths([3, 3, 3], [unitRegularTrianglePolygon]), tags: ['paths'] },
                 { solid: fromPolygons({}, unitGeodesicSphere20Polygons), tags: ['solid'] },
                 { z0Surface: scaleSurface([2, 2, 2], [unitSquarePolygon]), tags: ['surface'] }] });
  await writeFile('toThreejsPage.test.noeval.html', html, { encoding: 'utf8' });
  t.is(html, await readFile('toThreejsPage.test.noeval.html', { encoding: 'utf8' }));
});

test('Eval lego skeleton sphere', async (t) => {
  const html = await toThreejsPage(
    { includeEvaluator: true,
      includeEditor: true,
      initialScript: `
const main = async () => {
   const skeleton = await readLDraw({ part: '6260c01.dat' });
   await writeStl({ path: 'window/skeleton' }, difference(skeleton.scale([0.1, 0.1, 0.1]), Cube(5)));
 }
`
    },
    { empty: true });
  await writeFile('toThreejsPage.test.eval.html', html, { encoding: 'utf8' });
  t.is(html, await readFile('toThreejsPage.test.eval.html', { encoding: 'utf8' }));
});
