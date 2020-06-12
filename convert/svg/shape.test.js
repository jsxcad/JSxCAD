import { getPoints, toPath } from "svg-shapes";

import absolutifySvgPath from "abs-svg-path";
import { canonicalize } from "./canonicalize";
import curvifySvgPath from "curvify-svg-path";
import parseSvgPath from "parse-svg-path";
import test from "ava";

test("Circle as cubic bezier.", (t) => {
  const circlePath = toPath(getPoints("circle", { cx: 0, cy: 0, r: 1 }));
  const parsedCirclePath = parseSvgPath(circlePath);
  const absoluteCirclePath = absolutifySvgPath(parsedCirclePath);
  const curvifiedCirclePath = canonicalize(curvifySvgPath(absoluteCirclePath));
  t.deepEqual(curvifiedCirclePath, [
    ["M", 0, -1],
    ["C", -0.55228, -1, -1, -0.55228, -1, -0],
    ["C", -1, 0.55228, -0.55228, 1, -0, 1],
    ["C", 0.55228, 1, 1, 0.55228, 1, 0],
    ["C", 1, -0.55228, 0.55228, -1, 0, -1],
    ["C", 0, -1, 0, -1, 0, -1],
  ]);
});
