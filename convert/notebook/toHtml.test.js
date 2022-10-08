import { toHtmlFromNotebook, toHtmlFromScript } from './toHtml.js';

import { boot } from '@jsxcad/sys';
import fs from 'fs';
import test from 'ava';
import { unitGeodesicSphere20Polygons } from '@jsxcad/data-shape';

const { readFile, writeFile } = fs.promises;

test.beforeEach(async (t) => {
  await boot();
});

test('Test precomputed notebook', async (t) => {
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
  const { html } = await toHtmlFromNotebook(notebook);
  t.is(
    new TextDecoder('utf8').decode(html),
    await readFile('toHtml.test.html', { encoding: 'utf8' })
  );
});

test('Test dynamic notebook', async (t) => {
  const files = { 'test.js': 'Box(1).view()' };
  const { html } = await toHtmlFromScript({ files, module: 'test.js' });
  await writeFile('toHtml.dynamic.test.html', html, { encoding: 'utf8' });
  t.is(
    new TextDecoder('utf8').decode(html),
    await readFile('toHtml.dynamic.test.html', { encoding: 'utf8' })
  );
});
