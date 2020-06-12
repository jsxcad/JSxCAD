import { boot } from "@jsxcad/sys";
import { canonicalize } from "@jsxcad/geometry-surface";
import { createNormalize3 } from "@jsxcad/algorithm-quantize";
import { fromPolygons } from "@jsxcad/geometry-solid";
import { section } from "./section";
import test from "ava";

// Producing duplicate paths within surfaces.

const cubePolygons = [
  [
    [-1, -1, -1],
    [-1, -1, 1],
    [-1, 1, 1],
    [-1, 1, -1],
  ],
  [
    [1, -1, -1],
    [1, 1, -1],
    [1, 1, 1],
    [1, -1, 1],
  ],
  [
    [-1, -1, -1],
    [1, -1, -1],
    [1, -1, 1],
    [-1, -1, 1],
  ],
  [
    [-1, 1, -1],
    [-1, 1, 1],
    [1, 1, 1],
    [1, 1, -1],
  ],
  [
    [-1, -1, -1],
    [-1, 1, -1],
    [1, 1, -1],
    [1, -1, -1],
  ],
  [
    [-1, -1, 1],
    [1, -1, 1],
    [1, 1, 1],
    [-1, 1, 1],
  ],
];

test.beforeEach(async (t) => {
  await boot();
});

test("Section", (t) => {
  const surface = section(
    fromPolygons({}, cubePolygons),
    [
      [
        [
          [-10, -10, 0],
          [10, -10, 0],
          [10, 10, 0],
          [-10, 10, 0],
        ],
      ],
    ],
    createNormalize3()
  );
  t.deepEqual(canonicalize(surface[0]), [
    [
      [-1, -1, 0],
      [1, -1, 0],
      [1, 1, 0],
      [-1, 1, 0],
    ],
  ]);
});
