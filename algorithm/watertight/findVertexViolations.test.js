import { findVertexViolations } from "./findVertexViolations";
import test from "ava";

test("Watertight vertex is has no violations", (t) => {
  t.deepEqual(findVertexViolations([0, 0, 0], [1, 1, 1], [1, 1, 1]), []);
});

test("Vertex with misaligned colinear edges has violations", (t) => {
  t.deepEqual(findVertexViolations([0, 0, 0], [1, 1, 1], [2, 2, 2]), [
    [
      "unequal",
      [
        [0, 0, 0],
        [1, 1, 1],
        [2, 2, 2],
      ],
    ],
    [
      "unequal",
      [
        [2, 2, 2],
        [1, 1, 1],
        [0, 0, 0],
      ],
    ],
  ]);
});

test("Vertex without paired colinear edges has no violation", (t) => {
  t.deepEqual(findVertexViolations([0, 0, 0], [1, 1, 1], [2, 2, 1]), []);
});
