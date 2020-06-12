import { divide } from "./divide";
import test from "ava";

test("vec3: divide() called with two parameters should return a vec3 with correct values", (t) => {
  t.deepEqual(divide([0, 0, 0], [0, 0, 0]), [0 / 0, 0 / 0, 0 / 0]);
  t.deepEqual(divide([0, 0, 0], [1, 2, 3]), [0, 0, 0]);
  t.deepEqual(divide([6, 6, 6], [1, 2, 3]), [6, 3, 2]);
  t.deepEqual(divide([-6, -6, -6], [1, 2, 3]), [-6, -3, -2]);
  t.deepEqual(divide([6, 6, 6], [-1, -2, -3]), [-6, -3, -2]);
  t.deepEqual(divide([-6, -6, -6], [-1, -2, -3]), [6, 3, 2]);
});
