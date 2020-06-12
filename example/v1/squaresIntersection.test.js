import { isExpected, run } from "./run";

import test from "ava";

test("Expected pdf", async (t) => {
  await run("squaresIntersection");
  isExpected(t, "squaresIntersection/output/squaresIntersection_0.pdf");
});
