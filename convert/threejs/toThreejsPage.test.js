import {
  unitGeodesicSphere20Polygons,
  unitRegularTrianglePolygon,
  unitSquarePolygon,
} from '@jsxcad/data-shape';

import { boot } from '@jsxcad/sys';
import { fromPolygons } from '@jsxcad/geometry-solid';
import fs from 'fs';
import { scale as scalePaths } from '@jsxcad/geometry-paths';
import { scale as scaleSurface } from '@jsxcad/geometry-surface';
import test from 'ava';
import { toThreejsPage } from './toThreejsPage.js';

const { readFile } = fs.promises;

test.beforeEach(async (t) => {
  await boot();
});

test('Geodesic sphere', async (t) => {
  const html = await toThreejsPage({
    type: 'assembly',
    content: [
      {
        type: 'paths',
        paths: scalePaths([3, 3, 3], [unitRegularTrianglePolygon]),
        tags: ['paths'],
      },
      {
        type: 'solid',
        solid: fromPolygons(unitGeodesicSphere20Polygons),
        tags: ['solid'],
      },
      {
        type: 'z0Surface',
        z0Surface: scaleSurface([2, 2, 2], [unitSquarePolygon]),
        tags: ['surface'],
      },
    ],
  });
  t.is(
    new TextDecoder('utf8').decode(html),
    await readFile('toThreejsPage.test.html', { encoding: 'utf8' })
  );
});
