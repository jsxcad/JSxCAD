import { toSolid } from './toSolid.js';
import test from 'ava';

const canonicalize = (input) => JSON.parse(JSON.stringify(input));

test('Box', (t) => {
  const graph = {
    point: [
      [-0.5, 0.5, -0.5],
      [-0.5, 0.5, 0.5],
      [0.5, 0.5, 0.5],
      [0.5, 0.5, -0.5],
      [0.5, -0.5, 0.5],
      [-0.5, -0.5, 0.5],
      [-0.5, -0.5, -0.5],
      [0.5, -0.5, -0.5],
    ],
    edge: [
      { start: 0, face: 0, twin: 12, next: 1 },
      { start: 1, face: 0, twin: 7, next: 2 },
      { start: 2, face: 0, twin: 5, next: 5 },
      { start: 2, face: 0, twin: 24, next: 4 },
      { start: 3, face: 0, twin: 18, next: 0 },
      { start: 0, face: 0, twin: 2, next: 3 },
      { start: 4, face: 2, twin: 25, next: 7 },
      { start: 2, face: 2, twin: 1, next: 8 },
      { start: 1, face: 2, twin: 11, next: 11 },
      { start: 1, face: 2, twin: 16, next: 10 },
      { start: 5, face: 2, twin: 34, next: 6 },
      { start: 4, face: 2, twin: 8, next: 9 },
      { start: 1, face: 4, twin: 0, next: 13 },
      { start: 0, face: 4, twin: 22, next: 14 },
      { start: 6, face: 4, twin: 17, next: 17 },
      { start: 6, face: 4, twin: 30, next: 16 },
      { start: 5, face: 4, twin: 9, next: 12 },
      { start: 1, face: 4, twin: 14, next: 15 },
      { start: 0, face: 6, twin: 4, next: 19 },
      { start: 3, face: 6, twin: 28, next: 20 },
      { start: 7, face: 6, twin: 23, next: 23 },
      { start: 7, face: 6, twin: 31, next: 22 },
      { start: 6, face: 6, twin: 13, next: 18 },
      { start: 0, face: 6, twin: 20, next: 21 },
      { start: 3, face: 8, twin: 3, next: 25 },
      { start: 2, face: 8, twin: 6, next: 26 },
      { start: 4, face: 8, twin: 29, next: 29 },
      { start: 4, face: 8, twin: 33, next: 28 },
      { start: 7, face: 8, twin: 19, next: 24 },
      { start: 3, face: 8, twin: 26, next: 27 },
      { start: 5, face: 10, twin: 15, next: 31 },
      { start: 6, face: 10, twin: 21, next: 32 },
      { start: 7, face: 10, twin: 35, next: 35 },
      { start: 7, face: 10, twin: 27, next: 34 },
      { start: 4, face: 10, twin: 10, next: 30 },
      { start: 5, face: 10, twin: 32, next: 33 },
    ],
    face: [
      { plane: [1.1102230246251565e-16, 1, 0, 0.5], edge: 2, holes: [] },
      { plane: [1.1102230246251565e-16, 1, 0, 0.5], edge: -1, holes: [] },
      { plane: [1.1102230246251563e-16, 0, 1, 0.5], edge: 8, holes: [] },
      { plane: [-1.6653345369377343e-16, 0, 1, 0.5], edge: -1, holes: [] },
      {
        plane: [-1, 3.3306690738754696e-16, 0, 0.5000000000000001],
        edge: 14,
        holes: [],
      },
      {
        plane: [-1, 2.220446049250313e-16, 0, 0.5000000000000001],
        edge: -1,
        holes: [],
      },
      { plane: [2.220446049250313e-16, 0, -1, 0.5], edge: 20, holes: [] },
      {
        plane: [-2.2204460492503126e-16, 0, -1, 0.5000000000000001],
        edge: -1,
        holes: [],
      },
      { plane: [1, -2.2204460492503126e-16, 0, 0.5], edge: 26, holes: [] },
      {
        plane: [1, -2.2204460492503126e-16, 0, 0.5000000000000001],
        edge: -1,
        holes: [],
      },
      {
        plane: [-2.7755575615628914e-16, -1, 0, 0.5000000000000001],
        edge: 32,
        holes: [],
      },
      {
        plane: [-2.7755575615628914e-16, -1, 0, 0.5000000000000001],
        edge: -1,
        holes: [],
      },
    ],
  };

  const solid = toSolid(graph);

  t.deepEqual(canonicalize(solid), [
    [
      [ [-0.5, 0.5, 0.5], [0.5, 0.5, 0.5], [-0.5, 0.5, -0.5], ],
      [ [-0.5, 0.5, -0.5], [0.5, 0.5, 0.5], [0.5, 0.5, -0.5], ],
    ],
    [
      [ [0.5, 0.5, 0.5], [-0.5, 0.5, 0.5], [0.5, -0.5, 0.5], ],
      [ [0.5, -0.5, 0.5], [-0.5, 0.5, 0.5], [-0.5, -0.5, 0.5], ],
    ],
    [
      [ [-0.5, 0.5, -0.5], [-0.5, -0.5, -0.5], [-0.5, 0.5, 0.5], ],
      [ [-0.5, 0.5, 0.5], [-0.5, -0.5, -0.5], [-0.5, -0.5, 0.5], ],
    ],
    [
      [ [0.5, 0.5, -0.5], [0.5, -0.5, -0.5], [-0.5, 0.5, -0.5], ],
      [ [-0.5, 0.5, -0.5], [0.5, -0.5, -0.5], [-0.5, -0.5, -0.5], ],
    ],
    [
      [ [0.5, 0.5, 0.5], [0.5, -0.5, 0.5], [0.5, 0.5, -0.5], ],
      [ [0.5, 0.5, -0.5], [0.5, -0.5, 0.5], [0.5, -0.5, -0.5], ],
    ],
    [
      [ [-0.5, -0.5, -0.5], [0.5, -0.5, -0.5], [-0.5, -0.5, 0.5], ],
      [ [-0.5, -0.5, 0.5], [0.5, -0.5, -0.5], [0.5, -0.5, 0.5], ],
    ],
  ]);
});
