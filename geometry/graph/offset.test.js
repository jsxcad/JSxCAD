import { fromSurface } from './fromSurface.js';
import { initCgal } from '@jsxcad/algorithm-cgal';
import { offset } from './offset.js';
import { outline } from './outline.js';
import test from 'ava';

test.beforeEach(async (t) => {
  await initCgal();
});

test('fromSolid', (t) => {
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
    isOutline: true,
    isWireframe: true,
    edges: [
      { point: 1, next: 2, twin: 1, loop: 0 },
      null,
      { point: 2, next: 6, twin: 3, loop: 0 },
      null,
      { point: 0, next: 0, twin: 5, loop: 0 },
      null,
      { point: 3, next: 4, twin: 7, loop: 0 },
    ],
    faces: [{ loop: 0, plane: [0, 0, -1, 0.5] }],
    loops: [{ edge: 2, face: 0 }],
    points: [
      [-0.5, 0.5, -0.5],
      [0.5, 0.5, -0.5],
      [0.5, -0.5, -0.5],
      [-0.5, -0.5, -0.5],
    ],
  });
  const offsetGraph = offset(outlineGraph, -0.2);
  t.deepEqual(JSON.parse(JSON.stringify(offsetGraph)), {
    points: [
      [0.3, -0.3, 0.5],
      [-0.3, -0.3, 0.5],
      [-0.3, 0.3, 0.5],
      [0.3, 0.3, 0.5],
    ],
    edges: [
      { point: 0, loop: 0, twin: -1, next: 1 },
      { point: 1, loop: 0, twin: -1, next: 2 },
      { point: 2, loop: 0, twin: -1, next: 3 },
      { point: 3, loop: 0, twin: -1, next: 0 },
    ],
    loops: [{ edge: 0, face: 0 }],
    faces: [{ plane: [0, 0, -1, 0.5], loop: 0 }],
  });
});
