import { isExpected, run } from "./run";

import test from "ava";

test("Expected stl", async (t) => {
  await run("text");
  isExpected(t, "text/output/text_0.stl");
  isExpected(t, "text/output/text_0.pdf");
});
