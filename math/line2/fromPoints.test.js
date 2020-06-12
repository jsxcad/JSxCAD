import { canonicalize as c } from "./canonicalize";
import { fromPoints } from "./fromPoints";
import test from "ava";

test("line2: fromPoints() should return a new line2 with correct values", (t) => {
  const obs1 = fromPoints([0, 0], [0, 0]);
  t.deepEqual(c(obs1), [0, 0, 0]);

  const obs2 = fromPoints([1, 0], [0, 1]);
  t.deepEqual(c(obs2), [-0.70711, -0.70711, -0.70711]);

  const obs3 = fromPoints([0, 1], [1, 0]);
  t.deepEqual(c(obs3), [0.70711, 0.70711, 0.70711]);

  const obs4 = fromPoints([0, 6], [6, 0]);
  t.deepEqual(c(obs4), [0.70711, 0.70711, 4.24264]);

  // line2 created from the same points results in an invalid line2
  const obs9 = fromPoints([0, 5], [0, 5]);
  t.deepEqual(c(obs9), [0, 0, 0]);
});
