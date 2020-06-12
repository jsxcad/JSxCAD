import { rewriteTags } from "./rewriteTags";
import test from "ava";

test("Simple add", (t) => {
  t.deepEqual(rewriteTags(["x"], [], { solid: [] }), {
    solid: [],
    tags: ["x"],
  });
});

test("Simple remove", (t) => {
  t.deepEqual(rewriteTags([], ["x"], { solid: [], tags: ["x"] }), {
    solid: [],
    tags: [],
  });
});
