import { scale } from "./scale";
import test from "ava";

test("vec2: scale() should return a vec2 with positive values", (t) => {
  t.deepEqual(scale(0, [0, 0]), [0, 0]);
  t.deepEqual(scale(3, [1, 2]), [3, 6]);
  t.deepEqual(scale(3, [-1, -2]), [-3, -6]);
});
