import { flip as flipSurface } from "@jsxcad/geometry-surface";

export const flip = (solid) => solid.map((surface) => flipSurface(surface));
