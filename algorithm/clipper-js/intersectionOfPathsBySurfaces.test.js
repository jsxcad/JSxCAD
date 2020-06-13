import { intersectionOfPathsBySurfaces } from './intersectionOfPathsBySurfaces';
import test from 'ava';

test('Line vs Square', (t) => {
  const paths = intersectionOfPathsBySurfaces(
    [[null, [0, 0, 0], [20, 20, 0]]],
    [
      [
        [5, 5, 0],
        [-5, 5, 0],
        [-5, -5, 0],
        [5, -5, 0],
      ],
    ]
  );
  t.deepEqual(paths, [[null, [0, 0, 0], [5, 5, 0]]]);
});

test('Square vs Square', (t) => {
  const paths = intersectionOfPathsBySurfaces(
    [
      [
        [10, 10, 0],
        [0, 10, 0],
        [0, 0, 0],
        [10, 0, 0],
      ],
    ],
    [
      [
        [5, 5, 0],
        [-5, 5, 0],
        [-5, -5, 0],
        [5, -5, 0],
      ],
    ]
  );
  t.deepEqual(paths, [
    [
      [5, 5, 0],
      [0, 5],
      [0, 0, 0],
      [5, 0],
    ],
  ]);
});
