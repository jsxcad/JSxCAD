import { canonicalize as canonicalizeSurface } from "@jsxcad/geometry-surface";

export const canonicalize = (solid) => solid.map(canonicalizeSurface);
