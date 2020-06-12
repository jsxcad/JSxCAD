import { isExpected, run } from "./run";

import test from "ava";

test("Expected pdf", async (t) => {
  await run("square");
  isExpected(t, "square/output/square_0.pdf");
});
