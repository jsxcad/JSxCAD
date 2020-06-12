import { measureBoundingBox } from "./measureBoundingBox";
import test from "ava";

test("Check points in assembly are measured.", (t) => {
  const geometry = {
    assembly: [
      { points: [[0, 0, 0]] },
      { points: [[100, 0, 0]] },
      { points: [[0, 100, 0]] },
    ],
  };
  const box = measureBoundingBox(geometry);

  t.deepEqual(box, [
    [0, 0, 0],
    [100, 100, 0],
  ]);
});
