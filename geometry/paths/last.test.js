import { last } from "./last";
import test from "ava";

test("last gets the last.", (t) => {
  t.deepEqual(
    last([
      [1, 2],
      [3, 4],
    ]),
    [3, 4]
  );
});
