import { cache } from "@jsxcad/cache";

const assembleImpl = (...taggedGeometries) => ({ assembly: taggedGeometries });

export const assemble = cache(assembleImpl);
