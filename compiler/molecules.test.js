import { readFileSync, writeFileSync } from "fs";
import { toDotFromFlows, toFlows } from "./molecules";

import test from "ava";

test("toFlows", (t) => {
  const data = JSON.parse(readFileSync("molecule.json"));
  const flows = toFlows(data);
  writeFileSync("molecule-observed.flow", JSON.stringify(flows, null, "  "));
  writeFileSync("molecule-observed.dot", toDotFromFlows(flows));
  const observed = JSON.parse(
    readFileSync("molecule-observed.flow", { encoding: "utf8" })
  );
  const expected = JSON.parse(
    readFileSync("molecule-expected.flow", { encoding: "utf8" })
  );
  t.deepEqual(observed, expected);
});
