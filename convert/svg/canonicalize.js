import { reallyQuantizeForSpace as q } from "@jsxcad/math-utils";

const canonicalizeSegment = ([directive, ...args]) => [
  directive,
  ...args.map(q),
];

export const canonicalize = (svgPath) => svgPath.map(canonicalizeSegment);
