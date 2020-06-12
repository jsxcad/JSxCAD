import { distance } from "./distance";
import test from "ava";

test("vec3: distance() should return correct values", (t) => {
  t.is(distance([0, 0, 0], [0, 0, 0]), 0);
  t.is(distance([0, 0, 0], [1, 2, 3]), 3.7416573867739413);
  t.is(distance([0, 0, 0], [1, -2, 3]), 3.7416573867739413);
  t.is(distance([0, 0, 0], [-1, -2, 3]), 3.7416573867739413);
  t.is(distance([0, 0, 0], [-1, 2, 3]), 3.7416573867739413);
  t.is(distance([0, 0, 0], [1, 2, -3]), 3.7416573867739413);
  t.is(distance([0, 0, 0], [1, -2, -3]), 3.7416573867739413);
  t.is(distance([0, 0, 0], [-1, -2, -3]), 3.7416573867739413);
  t.is(distance([0, 0, 0], [-1, 2, -3]), 3.7416573867739413);
});
