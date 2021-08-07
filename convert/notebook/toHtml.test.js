import { boot } from '@jsxcad/sys';
import fs from 'fs';
import test from 'ava';
import { toHtml } from './toHtml.js';
import { unitGeodesicSphere20Polygons } from '@jsxcad/data-shape';

const { readFile } = fs.promises;

test.beforeEach(async (t) => {
  await boot();
});

test('Test notebook', async (t) => {
  const notebook = [
    { md: '# Test Notebook.', hash: 'a' },
    { md: '## A Sphere.', hash: 'b' },
    {
      data: {
        type: 'triangles',
        triangles: unitGeodesicSphere20Polygons,
        tags: ['solid'],
      },
      view: { width: 512, height: 512, position: [50, 50, 50] },
      hash: 'c',
    },
  ];
  const html = await toHtml(notebook);
  t.is(
    new TextDecoder('utf8').decode(html),
    await readFile('toHtml.test.html', { encoding: 'utf8' })
  );
});
