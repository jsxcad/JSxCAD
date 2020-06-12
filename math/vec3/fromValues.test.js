import { fromValues } from "./fromValues";
import test from "ava";

test("vec3: fromValues() should return a new vec3 with correct values", (t) => {
  t.deepEqual(fromValues(0, 0, 0), [0, 0, 0]);
  t.deepEqual(fromValues(0, 1, -5), [0, 1, -5]);
});
