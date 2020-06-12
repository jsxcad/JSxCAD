import { reallyQuantizeForSpace as q } from "@jsxcad/math-utils";

export const canonicalize = (vector) => vector.map(q);
