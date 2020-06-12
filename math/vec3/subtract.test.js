import { subtract } from "./subtract";
import test from "ava";

test("vec3: subtract() called with two paramerters should return a vec3 with correct values", (t) => {
  t.deepEqual(subtract([0, 0, 0], [0, 0, 0]), [0, 0, 0]);
  t.deepEqual(subtract([1, 2, 3], [3, 2, 1]), [-2, 0, 2]);
  t.deepEqual(subtract([1, 2, 3], [-1, -2, -3]), [2, 4, 6]);
  t.deepEqual(subtract([-1, -2, -3], [-1, -2, -3]), [0, 0, 0]);
});
