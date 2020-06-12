import ConvexHull2d from "monotone-convex-hull-2d";
import { cache } from "@jsxcad/cache";

const buildConvexSurfaceHullImpl = (points) => {
  const hull = [];
  for (const nth of ConvexHull2d(points)) {
    hull.push(points[nth]);
  }
  return { z0Surface: [hull.reverse()] };
};

export const buildConvexSurfaceHull = cache(buildConvexSurfaceHullImpl);
