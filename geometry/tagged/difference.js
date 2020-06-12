import { cache } from "@jsxcad/cache";
import { getPaths } from "./getPaths";
import { getSolids } from "./getSolids";
import { getSurfaces } from "./getSurfaces";
import { getZ0Surfaces } from "./getZ0Surfaces";
import { difference as pathsDifference } from "@jsxcad/geometry-paths";
import { rewrite } from "./visit";
import { difference as solidDifference } from "@jsxcad/geometry-solid-boolean";
import { difference as surfaceDifference } from "@jsxcad/geometry-surface-boolean";
import { difference as z0SurfaceDifference } from "@jsxcad/geometry-z0surface-boolean";

const differenceImpl = (geometry, ...geometries) => {
  const op = (geometry, descend) => {
    if (geometry.solid) {
      const todo = [];
      for (const geometry of geometries) {
        for (const { solid } of getSolids(geometry)) {
          todo.push(solid);
        }
      }
      return {
        solid: solidDifference(geometry.solid, ...todo),
        tags: geometry.tags,
      };
    } else if (geometry.surface) {
      // FIX: Solids should cut surfaces
      const todo = [];
      for (const geometry of geometries) {
        for (const { surface } of getSurfaces(geometry)) {
          todo.push(surface);
        }
        for (const { z0Surface } of getZ0Surfaces(geometry)) {
          todo.push(z0Surface);
        }
      }
      return {
        surface: surfaceDifference(geometry.surface, ...todo),
        tags: geometry.tags,
      };
    } else if (geometry.z0Surface) {
      // FIX: Solids should cut surfaces
      const todoSurfaces = [];
      const todoZ0Surfaces = [];
      for (const geometry of geometries) {
        for (const { surface } of getSurfaces(geometry)) {
          todoSurfaces.push(surface);
        }
        for (const { z0Surface } of getZ0Surfaces(geometry)) {
          todoZ0Surfaces.push(z0Surface);
        }
      }
      if (todoSurfaces.length > 0) {
        return {
          surface: surfaceDifference(
            geometry.z0Surface,
            ...todoSurfaces,
            ...todoZ0Surfaces
          ),
          tags: geometry.tags,
        };
      } else {
        return {
          surface: z0SurfaceDifference(geometry.z0Surface, ...todoZ0Surfaces),
          tags: geometry.tags,
        };
      }
    } else if (geometry.paths) {
      const todo = [];
      for (const geometry of geometries) {
        for (const { paths } of getPaths(geometry)) {
          todo.push(paths);
        }
      }
      return {
        paths: pathsDifference(geometry.paths, ...todo),
        tags: geometry.tags,
      };
    } else {
      return descend();
    }
  };

  return rewrite(geometry, op);
};

export const difference = cache(differenceImpl);
