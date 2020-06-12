import { cacheTransform } from "@jsxcad/cache";

const transformImpl = (matrix, untransformed) => {
  if (matrix.some((value) => typeof value !== "number" || isNaN(value))) {
    throw Error("die");
  }
  return { matrix, untransformed, tags: untransformed.tags };
};

export const transform = cacheTransform(transformImpl);
