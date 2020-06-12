import { canonicalize } from "./canonicalize";
import { equals } from "./equals";
import test from "ava";

const piVec = [Math.PI, Math.PI];

// This test is intended to be illustrative, and establish ground truth
// It will need to be updated if ../../constants.spatialResolution changes.
test("vec2: Canonicalization quantizes to spatial resolution", (t) => {
  t.true(equals(canonicalize(piVec), [3.14159, 3.14159]));
});

test("vec2: Canonicalization is transformative", (t) => {
  t.false(equals(piVec, canonicalize(piVec)));
});

test("vec2: Canonicalization is idempotent", (t) => {
  t.true(equals(canonicalize(piVec), canonicalize(canonicalize(piVec))));
});
