import { fromPoints } from "./fromPoints";
import { fromValues } from "./fromValues";
import test from "ava";
import { xAtY } from "./xAtY";

test("line2: xAtY() should return proper values", (t) => {
  const line1 = fromValues();

  const x1 = xAtY(0, line1);
  t.is(x1, 0);

  const x2 = xAtY(6, line1);
  t.false(Number.isFinite(x2)); // X is infinite, as the line is parallel to X-axis

  const x3 = xAtY(-6, line1);
  t.false(Number.isFinite(x3)); // X is infinite, as the line is parallel to X-axis

  const line2 = fromPoints([-5, 4], [5, -6]);
  const y1 = xAtY(0, line2);
  t.is(y1, -1);

  const y2 = xAtY(1, line2);
  t.is(y2, -2);

  const y3 = xAtY(2, line2);
  t.is(y3, -3);

  const y4 = xAtY(-1, line2);
  t.is(y4, 0);

  const y5 = xAtY(-2, line2);
  t.is(y5, 1);

  const y6 = xAtY(-3, line2);
  t.is(y6, 2);

  t.true(true);
});
