import { toRgbFromTags, toTagFromRgbInt } from "./color";

import test from "ava";

test("Default works.", (t) => {
  t.deepEqual(toRgbFromTags(["color/black"]), [0, 0, 0]);
});

test("Blue works.", (t) => {
  t.deepEqual(toRgbFromTags(["color/blue"]), [0, 0, 255]);
});

test("255 works.", (t) => {
  t.is(toTagFromRgbInt(255), "color/blue");
});

test("123214 works.", (t) => {
  t.is(toTagFromRgbInt(123214), "color/malachite");
});
