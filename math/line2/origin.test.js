import { canonicalize } from "@jsxcad/math-vec2";
import { fromPoints } from "./fromPoints";
import { fromValues } from "./fromValues";
import { origin } from "./origin";
import test from "ava";

test("line2: origin() should return proper origins", (t) => {
  const line1 = fromValues();
  const org1 = origin(line1);
  t.deepEqual(canonicalize(org1), [0, 0]);

  const line2 = fromPoints([1, 0], [0, 1]);
  const org2 = origin(line2);
  t.deepEqual(canonicalize(org2), [0.5, 0.5]);

  const line3 = fromPoints([0, 1], [1, 0]);
  const org3 = origin(line3);
  t.deepEqual(canonicalize(org3), [0.5, 0.5]);

  const line4 = fromPoints([0, 6], [6, 0]);
  const org4 = origin(line4);
  t.deepEqual(canonicalize(org4), [3, 3]);

  const line5 = fromPoints([-5, 5], [5, -5]);
  const org5 = origin(line5);
  t.deepEqual(canonicalize(org5), [0, 0]);
});
