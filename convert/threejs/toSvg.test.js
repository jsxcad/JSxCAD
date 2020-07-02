import {
  unitGeodesicSphere20Polygons,
  unitRegularTrianglePolygon,
  unitSquarePolygon,
} from '@jsxcad/data-shape';

import { fromPolygons } from '@jsxcad/geometry-solid';
import fs from 'fs';
import { scale as scalePaths } from '@jsxcad/geometry-paths';
import { scale as scaleSurface } from '@jsxcad/geometry-surface';
import test from 'ava';
import { toSvg } from './toSvg.js';

const { readFile } = fs.promises;

test('Example', async (t) => {
  const svg = await toSvg(
    { view: { position: [0, 0, 16] } },
    {
      type: 'assembly',
      content: [
        {
          type: 'paths',
          paths: scalePaths([3, 3, 3], [unitRegularTrianglePolygon]),
          tags: ['paths'],
        },
        {
          type: 'solid',
          solid: fromPolygons({}, unitGeodesicSphere20Polygons),
          tags: ['solid'],
        },
        {
          type: 'z0Surface',
          z0Surface: scaleSurface([2, 2, 2], [unitSquarePolygon]),
          tags: ['surface'],
        },
      ],
    }
  );
  t.is(
    new TextDecoder('utf8').decode(svg),
    await readFile('toThreejsPage.test.svg', { encoding: 'utf8' })
  );
});
