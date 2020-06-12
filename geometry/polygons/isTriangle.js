import { isClosed } from "@jsxcad/geometry-path";

export const isTriangle = (path) => isClosed(path) && path.length === 3;
