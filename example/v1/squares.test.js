import { isExpected, run } from "./run";

import test from "ava";

test("Expected pdf", async (t) => {
  await run("squares");
  isExpected(t, "squares/output/squares_0.pdf");
});
