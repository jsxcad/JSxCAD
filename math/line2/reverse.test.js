import { canonicalize } from "./canonicalize";
import { fromPoints } from "./fromPoints";
import { fromValues } from "./fromValues";
import { reverse } from "./reverse";
import test from "ava";

test("line2: reverse() should return proper lines", (t) => {
  const line1 = fromValues();
  const rev1 = reverse(line1);
  t.deepEqual(canonicalize(rev1), [-0, -1, -0]);

  const line2 = fromPoints([1, 0], [0, 1]);
  const rev2 = reverse(line2);
  t.deepEqual(canonicalize(rev2), [0.70711, 0.70711, 0.70711]);

  const line3 = fromPoints([0, 1], [1, 0]);
  const rev3 = reverse(line3);
  t.deepEqual(canonicalize(rev3), [-0.70711, -0.70711, -0.70711]);

  const line4 = fromPoints([0, 6], [6, 0]);
  const rev4 = reverse(line4);
  t.deepEqual(canonicalize(rev4), [-0.70711, -0.70711, -4.24264]);

  const line5 = fromPoints([-5, 5], [5, -5]);
  const rev5 = reverse(line5);
  t.deepEqual(canonicalize(rev5), [-0.70711, -0.70711, -0]);
});
