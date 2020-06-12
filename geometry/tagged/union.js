import { cache } from "@jsxcad/cache";
import { getPaths } from "./getPaths";
import { getSolids } from "./getSolids";
import { getSurfaces } from "./getSurfaces";
import { getZ0Surfaces } from "./getZ0Surfaces";
import { union as pathsUnion } from "@jsxcad/geometry-paths";
import { rewrite } from "./visit";
import { union as solidUnion } from "@jsxcad/geometry-solid-boolean";
import { union as surfaceUnion } from "@jsxcad/geometry-surface-boolean";
import { union as z0SurfaceUnion } from "@jsxcad/geometry-z0surface-boolean";

// Union is a little more complex, since it can make violate disjointAssembly invariants.

/*
const unifySolids = (geometry, ...geometries) => {
  const todo = [];
  for (const geometry of geometries) {
    for (const { solid } of getSolids(geometry)) {
      todo.push(solid);
    }
  }
  return { solid: solidUnion(geometry.solid, ...todo), tags: geometry.tags };
};

const unifySurfaces = (geometry, ...geometries) => {
  const todo = [];
  for (const geometry of geometries) {
    for (const { surface } of getSurfaces(geometry)) {
      todo.push(surface);
    }
    for (const { z0Surface } of getZ0Surfaces(geometry)) {
      todo.push(z0Surface);
    }
  }
  return { surface: surfaceUnion(geometry.surface, ...todo), tags: geometry.tags };
};

const unifyZ0Surfaces = (geometry, ...geometries) => {
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
    return { surface: surfaceUnion(geometry.z0Surface, ...todoSurfaces, ...todoZ0Surfaces), tags: geometry.tags };
  } else {
    return { surface: z0SurfaceUnion(geometry.z0Surface, ...todoZ0Surfaces), tags: geometry.tags };
  }
};

const unifyPaths = (geometry, ...geometries) => {
  const todo = [];
  for (const geometry of geometries) {
    for (const { paths } of getPaths(geometry)) {
      todo.push(paths);
    }
  }
  return { paths: pathsUnion(geometry.paths, ...todo), tags: geometry.tags };
};
*/

const unionImpl = (geometry, ...geometries) => {
  // Extract the compositional geometries to add.
  const pathsets = [];
  const solids = [];
  const surfaces = [];
  const z0Surfaces = [];
  for (const geometry of geometries) {
    for (const { surface } of getSurfaces(geometry)) {
      surfaces.push(surface);
    }
    for (const { z0Surface } of getZ0Surfaces(geometry)) {
      z0Surfaces.push(z0Surface);
    }
    for (const { solid } of getSolids(geometry)) {
      solids.push(solid);
    }
    for (const { paths } of getPaths(geometry)) {
      pathsets.push(paths);
    }
  }

  // For assemblies and layers we effectively compose with each element.
  // This renders disjointAssemblies into assemblies.
  // TODO: Preserve disjointAssemblies by only composing with the last compatible item.

  const op = (geometry, descend) => {
    if (geometry.solid) {
      const { solid, tags } = geometry;
      return { solid: solidUnion(solid, ...solids), tags };
    } else if (geometry.surface) {
      const { surface, tags } = geometry;
      return {
        surface: surfaceUnion(surface, ...surfaces, ...z0Surfaces),
        tags,
      };
    } else if (geometry.z0Surface) {
      const { z0Surface, tags } = geometry;
      if (surfaces.length === 0) {
        return { z0Surface: z0SurfaceUnion(z0Surface, ...z0Surfaces), tags };
      } else {
        return {
          surface: surfaceUnion(z0Surface, ...surfaces, ...z0Surfaces),
          tags,
        };
      }
    } else if (geometry.paths) {
      const { paths, tags } = geometry;
      return { paths: pathsUnion(paths, ...pathsets), tags };
    } else if (geometry.assembly) {
      const { assembly, tags } = geometry;
      return { assembly: assembly.map((entry) => rewrite(entry, op)), tags };
    } else if (geometry.disjointAssembly) {
      const { disjointAssembly, tags } = geometry;
      return {
        assembly: disjointAssembly.map((entry) => rewrite(entry, op)),
        tags,
      };
    } else if (geometry.layers) {
      const { layers, tags } = geometry;
      return { layers: layers.map((entry) => rewrite(entry, op)), tags };
    } else {
      return descend();
    }
  };

  return rewrite(geometry, op);
};

export const union = cache(unionImpl);
