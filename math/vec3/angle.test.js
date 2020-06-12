import { angle } from "./angle";
import { reallyQuantizeForSpace as q } from "@jsxcad/math-utils";
import test from "ava";

test("vec3: angle() should return correct values", (t) => {
  t.is(q(angle([5, 5, 5], [0, 0, 0])), 1.5708);
  t.is(q(angle([1, 0, 0], [1, 0, 0])), 0);
  t.is(q(angle([1, 0, 0], [0, 1, 0])), 1.5708);
  t.is(q(angle([1, 1, 1], [-1, -1, -1])), 3.14159);
});
