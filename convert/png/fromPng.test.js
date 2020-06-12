import { fromPng } from "./fromPng";
import fs from "fs";
import test from "ava";

const { readFile } = fs.promises;

test("Simple", async (t) => {
  const data = await readFile("test.png");
  const { width, height, pixels } = await fromPng(data);
  t.is(width, 4);
  t.is(height, 4);
  t.deepEqual(
    [...pixels],
    [
      13,
      13,
      13,
      255,
      34,
      34,
      34,
      255,
      53,
      53,
      53,
      255,
      75,
      75,
      75,
      255,
      34,
      34,
      34,
      255,
      46,
      46,
      46,
      255,
      61,
      61,
      61,
      255,
      79,
      79,
      79,
      255,
      59,
      59,
      59,
      255,
      64,
      64,
      64,
      255,
      71,
      71,
      71,
      255,
      86,
      86,
      86,
      255,
      77,
      77,
      77,
      255,
      81,
      81,
      81,
      255,
      86,
      86,
      86,
      255,
      99,
      99,
      99,
      255,
    ]
  );
});
