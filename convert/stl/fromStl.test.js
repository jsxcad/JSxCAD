import { boot } from '@jsxcad/sys';
import { fromStl } from './fromStl.js';
import { readFileSync } from 'fs';
import { realize } from '@jsxcad/geometry';
import test from 'ava';

test('Read example', async (t) => {
  await boot();
  const stl = readFileSync('fromStl.test.box.stl');
  const geometry = await fromStl(stl);
  t.deepEqual(JSON.parse(JSON.stringify(geometry)), {
    type: 'graph',
    tags: [],
    graph: {
      isClosed: true,
      isEmpty: false,
      isLazy: true,
    },
  });
  t.deepEqual(JSON.parse(JSON.stringify(realize(geometry))), {
    type: 'graph',
    tags: [],
    graph: {
      isClosed: true,
      isEmpty: false,
      isLazy: false,
      edges: [
        { point: 0, next: 2, twin: 1, facet: 0, face: 0 },
        { point: 1, next: 23, twin: 0, facet: 5, face: 4 },
        { point: 1, next: 4, twin: 3, facet: 0, face: 0 },
        { point: 2, next: 35, twin: 2, facet: 11, face: 10 },
        { point: 2, next: 0, twin: 5, facet: 0, face: 0 },
        { point: 0, next: 6, twin: 4, facet: 1, face: 0 },
        { point: 2, next: 8, twin: 7, facet: 1, face: 0 },
        { point: 3, next: 26, twin: 6, facet: 6, face: 6 },
        { point: 3, next: 5, twin: 9, facet: 1, face: 0 },
        { point: 0, next: 31, twin: 8, facet: 8, face: 8 },
        { point: 4, next: 12, twin: 11, facet: 2, face: 2 },
        { point: 5, next: 21, twin: 10, facet: 9, face: 8 },
        { point: 5, next: 14, twin: 13, facet: 2, face: 2 },
        { point: 6, next: 30, twin: 12, facet: 7, face: 6 },
        { point: 6, next: 10, twin: 15, facet: 2, face: 2 },
        { point: 4, next: 16, twin: 14, facet: 3, face: 2 },
        { point: 6, next: 18, twin: 17, facet: 3, face: 2 },
        { point: 7, next: 34, twin: 16, facet: 10, face: 10 },
        { point: 7, next: 15, twin: 19, facet: 3, face: 2 },
        { point: 4, next: 22, twin: 18, facet: 4, face: 4 },
        { point: 0, next: 19, twin: 21, facet: 4, face: 4 },
        { point: 4, next: 33, twin: 20, facet: 9, face: 8 },
        { point: 7, next: 20, twin: 23, facet: 4, face: 4 },
        { point: 0, next: 24, twin: 22, facet: 5, face: 4 },
        { point: 7, next: 1, twin: 25, facet: 5, face: 4 },
        { point: 1, next: 17, twin: 24, facet: 10, face: 10 },
        { point: 2, next: 28, twin: 27, facet: 6, face: 6 },
        { point: 6, next: 3, twin: 26, facet: 11, face: 10 },
        { point: 6, next: 7, twin: 29, facet: 6, face: 6 },
        { point: 3, next: 13, twin: 28, facet: 7, face: 6 },
        { point: 5, next: 29, twin: 31, facet: 7, face: 6 },
        { point: 3, next: 32, twin: 30, facet: 8, face: 8 },
        { point: 5, next: 9, twin: 33, facet: 8, face: 8 },
        { point: 0, next: 11, twin: 32, facet: 9, face: 8 },
        { point: 6, next: 25, twin: 35, facet: 10, face: 10 },
        { point: 1, next: 27, twin: 34, facet: 11, face: 10 },
      ],
      points: [
        [-5, -5, -5],
        [-5, -5, 5],
        [-5, 5, 5],
        [-5, 5, -5],
        [5, -5, -5],
        [5, 5, -5],
        [5, 5, 5],
        [5, -5, 5],
      ],
      exactPoints: [
        ['-5', '-5', '-5'],
        ['-5', '-5', '5'],
        ['-5', '5', '5'],
        ['-5', '5', '-5'],
        ['5', '-5', '-5'],
        ['5', '5', '-5'],
        ['5', '5', '5'],
        ['5', '-5', '5'],
      ],
      faces: [
        { plane: [-1, 0, 0, -500], exactPlane: ['-100', '0', '0', '-500'] },
        null,
        { plane: [1, 0, 0, -500], exactPlane: ['100', '0', '0', '-500'] },
        null,
        { plane: [0, -1, 0, -500], exactPlane: ['0', '-100', '0', '-500'] },
        null,
        { plane: [0, 1, 0, -500], exactPlane: ['0', '100', '0', '-500'] },
        null,
        { plane: [0, 0, -1, -500], exactPlane: ['0', '0', '-100', '-500'] },
        null,
        { plane: [0, 0, 1, -500], exactPlane: ['0', '0', '100', '-500'] },
      ],
      facets: [
        { edge: 4 },
        { edge: 8 },
        { edge: 14 },
        { edge: 18 },
        { edge: 22 },
        { edge: 24 },
        { edge: 28 },
        { edge: 30 },
        { edge: 32 },
        { edge: 33 },
        { edge: 34 },
        { edge: 35 },
      ],
    },
  });
});
