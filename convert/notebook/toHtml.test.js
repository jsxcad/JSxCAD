import { boot } from '@jsxcad/sys';
import { fromPolygons } from '@jsxcad/geometry-solid';
import fs from 'fs';
import test from 'ava';
import { toHtml } from './toHtml.js';
import { unitGeodesicSphere20Polygons } from '@jsxcad/data-shape';

const { readFile } = fs.promises;

test.beforeEach(async (t) => {
  await boot();
});

test('Geodesic sphere', async (t) => {
  const notebook = [
    { md: '# Test Notebook.' },
    { md: '## A Sphere.' },
    {
      view: {
        geometry: {
          type: 'solid',
          solid: fromPolygons(unitGeodesicSphere20Polygons),
          tags: ['solid'],
        },
      },
    },
  ];
  const html = await toHtml(notebook);
  t.is(
    new TextDecoder('utf8').decode(html),
    await readFile('toHtml.test.html', { encoding: 'utf8' })
  );
});
