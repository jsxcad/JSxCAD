const q = require('@jsxcad/math-utils').reallyQuantizeForSpace;

const canonicalizeSegment = ([directive, ...args]) => [directive, ...args.map(q)];
const canonicalize = (svgPath) => svgPath.map(canonicalizeSegment);

module.exports = canonicalize;
