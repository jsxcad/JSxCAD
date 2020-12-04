import { fromSurface } from './fromSurface.js';
import { initCgal } from '@jsxcad/algorithm-cgal';
import { offset } from './offset.js';
import { outline } from './outline.js';
import test from 'ava';

test.beforeEach(async (t) => {
  await initCgal();
});

test('offset', (t) => {
  const square = [
    [
      [-0.5, 0.5, -0.5],
      [0.5, 0.5, -0.5],
      [0.5, -0.5, -0.5],
    ],
    [
      [0.5, -0.5, -0.5],
      [-0.5, -0.5, -0.5],
      [-0.5, 0.5, -0.5],
    ],
  ];
  const graph = fromSurface(square);
  const outlineGraph = outline(graph);
  t.deepEqual(JSON.parse(JSON.stringify(outlineGraph)), {
    isClosed: false,
    isLazy: true,
    isOutline: true,
    isWireframe: true,
  });
  const offsetGraph = offset(outlineGraph, -0.2);
  t.deepEqual(JSON.parse(JSON.stringify(offsetGraph)), {
    points: [
      [0.3, 0.5, -0.5],
      [0.5, 0.3, -0.5],
      [0.3, 0.3, -0.5],
      [0.5, -0.3, -0.5],
      [0.3, -0.5, -0.5],
      [0.3, -0.3, -0.5],
      [-0.3, -0.5, -0.5],
      [-0.5, -0.3, -0.5],
      [-0.3, -0.3, -0.5],
      [-0.5, 0.3, -0.5],
      [-0.3, 0.5, -0.5],
      [-0.3, 0.3, -0.5],
    ],
    edges: [
      { point: 0, loop: 0, twin: -1, next: 1 },
      { point: 1, loop: 0, twin: -1, next: 2 },
      { point: 2, loop: 0, twin: -1, next: 3 },
      { point: 2, loop: 0, twin: -1, next: 4 },
      { point: 3, loop: 0, twin: -1, next: 5 },
      { point: 4, loop: 0, twin: -1, next: 6 },
      { point: 5, loop: 0, twin: -1, next: 7 },
      { point: 5, loop: 0, twin: -1, next: 8 },
      { point: 6, loop: 0, twin: -1, next: 9 },
      { point: 7, loop: 0, twin: -1, next: 10 },
      { point: 8, loop: 0, twin: -1, next: 11 },
      { point: 8, loop: 0, twin: -1, next: 12 },
      { point: 9, loop: 0, twin: -1, next: 13 },
      { point: 10, loop: 0, twin: -1, next: 14 },
      { point: 11, loop: 0, twin: -1, next: 15 },
      { point: 11, loop: 0, twin: -1, next: 0 },
    ],
    loops: [{ edge: 0, face: 0 }],
    faces: [{ plane: [0, 0, -1, 0.5], loop: 0 }],
    isClosed: false,
    isOutline: true,
  });
});
