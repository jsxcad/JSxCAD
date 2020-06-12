import { concatenate } from "./concatenate";
import test from "ava";

test("Concatenation of closed paths succeeds", (t) => {
  t.deepEqual(
    concatenate(
      [
        [1, 1],
        [2, 2],
      ],
      [
        [3, 3],
        [4, 4],
      ]
    ),
    [null, [1, 1], [2, 2], [3, 3], [4, 4]]
  );
});

test("Concatenation of open paths succeeds", (t) => {
  t.deepEqual(concatenate([null, [1, 1], [2, 2]], [null, [3, 3], [4, 4]]), [
    null,
    [1, 1],
    [2, 2],
    [3, 3],
    [4, 4],
  ]);
});
