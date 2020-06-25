import { createNormalize3 } from '@jsxcad/algorithm-quantize';
import { makeWatertight } from './makeWatertight';
import test from 'ava';

const canonicalize = (solid) =>
  solid.map((surface) =>
    surface.map((path) => path.map((point) => point.map((value) => value)))
  );

test('colinear', (t) => {
  const normalize = createNormalize3();
  const solid = [
    [
      [
        [0.4999999999999999, -0.5000000000000002, -0.5],
        [0.4999999999999999, -0.5000000000000002, 0.5],
        [0.0, -0.5000000000000002, 0.0],
      ],
    ],
    [
      [
        [0.4999999999999999, -0.5000000000000002, 0.5], // A
        [0.5100000000000001, -0.5000000000000001, -0.02000000000000024],
        [0.4999999999999999, -0.5000000000000002, -0.5], // B
      ],
    ],
  ];
  const watertightSolid = makeWatertight(solid, normalize);
  t.deepEqual(canonicalize(watertightSolid), [
    [
      [
        [0.4999999999999999, -0.5000000000000002, -0.5],
        [0.4999999999999999, -0.5000000000000002, 0.5],
        [0, -0.5000000000000002, 0],
      ],
    ],
    [
      [
        [0.4999999999999999, -0.5000000000000002, 0.5],
        [0.5100000000000001, -0.5000000000000001, -0.02000000000000024],
        [0.4999999999999999, -0.5000000000000002, -0.5],
      ],
    ],
  ]);
});
