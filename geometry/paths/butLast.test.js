import { butLast } from "./butLast";
import test from "ava";

test("butLast gets all but the last.", (t) => {
  t.deepEqual(
    butLast([
      [1, 2],
      [3, 4],
    ]),
    [[1, 2]]
  );
});
