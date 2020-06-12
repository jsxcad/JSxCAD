import { add } from "./add";
import test from "ava";

test("vec3: add() called with two parameters should return a vec3 with correct values", (t) => {
  t.deepEqual(add([0, 0, 0], [0, 0, 0]), [0, 0, 0]);
  t.deepEqual(add([1, 2, 3], [3, 2, 1]), [4, 4, 4]);
  t.deepEqual(add([1, 2, 3], [-1, -2, -3]), [0, 0, 0]);
  t.deepEqual(add([-1, -2, -3], [-1, -2, -3]), [-2, -4, -6]);
});
