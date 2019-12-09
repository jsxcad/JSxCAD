import { identity, multiply, fromXRotation, fromYRotation, fromZRotation, fromTranslation, fromScaling } from './jsxcad-math-mat4.js';
import { cache, cacheRewriteTags, cacheTransform } from './jsxcad-cache.js';
import { transform as transform$1, canonicalize as canonicalize$2, difference as difference$4, eachPoint as eachPoint$2, flip as flip$2, intersection as intersection$4, union as union$4 } from './jsxcad-geometry-paths.js';
import { transform as transform$3, canonicalize as canonicalize$3, flip as flip$5 } from './jsxcad-math-plane.js';
import { transform as transform$2, canonicalize as canonicalize$1, eachPoint as eachPoint$1, flip as flip$1 } from './jsxcad-geometry-points.js';
import { transform as transform$4, canonicalize as canonicalize$5, eachPoint as eachPoint$3, flip as flip$4, measureBoundingBox as measureBoundingBox$1 } from './jsxcad-geometry-solid.js';
import { transform as transform$5, canonicalize as canonicalize$4, eachPoint as eachPoint$4, flip as flip$3, measureBoundingBox as measureBoundingBox$2, makeConvex, toPlane } from './jsxcad-geometry-surface.js';
import { difference as difference$1, intersection as intersection$1, union as union$2 } from './jsxcad-geometry-solid-boolean.js';
import { difference as difference$3, intersection as intersection$3, union as union$1 } from './jsxcad-geometry-surface-boolean.js';
import { difference as difference$2, intersection as intersection$2, union as union$3 } from './jsxcad-geometry-z0surface-boolean.js';
import { min, max } from './jsxcad-math-vec3.js';
import { measureBoundingBox as measureBoundingBox$3 } from './jsxcad-geometry-z0surface.js';

// FIX: Refactor the geometry walkers.

const allTags = (geometry) => {
  const tags = new Set();
  const walk = (item) => {
    if (item.tags) {
      for (const tag of item.tags) {
        tags.add(tag);
      }
    }
    if (item.assembly) {
      item.assembly.forEach(walk);
    } else if (item.disjointAssembly) {
      item.disjointAssembly.forEach(walk);
    } else if (item.untransformed) {
      walk(item.untransformed);
    } else if (item.item) {
      walk(item.item);
    }
  };
  walk(geometry);
  return tags;
};

const assembleImpl = (...taggedGeometries) => ({ assembly: taggedGeometries });

const assemble = cache(assembleImpl);

const transformedGeometry = Symbol('transformedGeometry');

// Apply the accumulated matrix transformations and produce a geometry without them.

const toTransformedGeometry = (geometry) => {
  if (geometry[transformedGeometry] === undefined) {
    const walk = (matrix, geometry) => {
      const { tags } = geometry;
      if (geometry.matrix) {
        // Preserve any tags applied to the untransformed geometry.
        // FIX: Ensure tags are merged between transformed and untransformed upon resolution.
        return walk(multiply(matrix, geometry.matrix),
                    geometry.untransformed);
      } else if (geometry.assembly) {
        return {
          assembly: geometry.assembly.map(geometry => walk(matrix, geometry)),
          tags
        };
      } else if (geometry.disjointAssembly) {
        return {
          disjointAssembly: geometry.disjointAssembly.map(geometry => walk(matrix, geometry)),
          tags
        };
      } else if (geometry.item) {
        return {
          item: walk(matrix, geometry.item),
          tags
        };
      } else if (geometry.connection) {
        return {
          // A connection is a list of geometry with connections (connectors that have been connected)
          // The join can be released, to yield the geometry with the disconnected connections reconnected.
          connection: geometry.connection,
          geometries: geometry.geometries.map(geometry => walk(matrix, geometry)),
          connectors: geometry.connectors.map(connector => walk(matrix, connector)),
          tags
        };
      } else if (geometry.paths) {
        return {
          paths: transform$1(matrix, geometry.paths),
          tags
        };
      } else if (geometry.plan) {
        return {
          plan: geometry.plan,
          marks: transform$2(matrix, geometry.marks),
          planes: geometry.planes.map(plane => transform$3(matrix, plane)),
          visualization: walk(matrix, geometry.visualization),
          tags
        };
      } else if (geometry.points) {
        return {
          points: transform$2(matrix, geometry.points),
          tags
        };
      } else if (geometry.solid) {
        return {
          solid: transform$4(matrix, geometry.solid),
          tags
        };
      } else if (geometry.surface) {
        return {
          surface: transform$5(matrix, geometry.surface),
          tags
        };
      } else if (geometry.z0Surface) {
        // FIX: Consider transforms that preserve z0.
        return {
          surface: transform$5(matrix, geometry.z0Surface),
          tags
        };
      } else {
        throw Error(`die: ${JSON.stringify(geometry)}`);
      }
    };
    geometry[transformedGeometry] = walk(identity(), geometry);
  }
  return geometry[transformedGeometry];
};

const canonicalize = (rawGeometry) => {
  const geometry = toTransformedGeometry(rawGeometry);
  const canonicalized = {};
  if (geometry.points !== undefined) {
    canonicalized.points = canonicalize$1(geometry.points);
  } else if (geometry.paths !== undefined) {
    canonicalized.paths = canonicalize$2(geometry.paths);
  } else if (geometry.plan !== undefined) {
    canonicalized.plan = geometry.plan;
    canonicalized.marks = canonicalize$1(geometry.marks);
    canonicalized.planes = geometry.planes.map(canonicalize$3);
    canonicalized.visualization = canonicalize(geometry.visualization);
  } else if (geometry.connection) {
    canonicalized.connection = geometry.connection;
    canonicalized.geometries = geometry.geometries.map(canonicalize);    canonicalized.connectors = geometry.connectors.map(canonicalize);  } else if (geometry.surface !== undefined) {
    canonicalized.surface = canonicalize$4(geometry.surface);
  } else if (geometry.z0Surface !== undefined) {
    canonicalized.z0Surface = canonicalize$4(geometry.z0Surface);
  } else if (geometry.solid !== undefined) {
    canonicalized.solid = canonicalize$5(geometry.solid);
  } else if (geometry.assembly !== undefined) {
    canonicalized.assembly = geometry.assembly.map(canonicalize);
  } else if (geometry.disjointAssembly !== undefined) {
    canonicalized.disjointAssembly = geometry.disjointAssembly.map(canonicalize);
    if (geometry.nonNegative) {
      canonicalized.nonNegative = geometry.nonNegative.map(canonicalize);
    }
  } else if (geometry.item !== undefined) {
    canonicalized.item = geometry.item(canonicalize);
  } else {
    throw Error('die');
  }
  if (geometry.tags !== undefined) {
    canonicalized.tags = geometry.tags;
  }
  return canonicalized;
};

const eachItem = (geometry, operation) => {
  const walk = (geometry) => {
    if (geometry.assembly) {
      geometry.assembly.forEach(walk);
    } else if (geometry.item) {
      walk(geometry.item);
    } else if (geometry.disjointAssembly) {
      geometry.disjointAssembly.forEach(walk);
    } else if (geometry.connection) {
      geometry.geometries.forEach(walk);
    }
    operation(geometry);
  };
  walk(geometry);
};

const getConnections = (geometry) => {
  const connections = [];
  eachItem(geometry,
           item => {
             if (item.connection) {
               connections.push(item);
             }
           });
  return connections;
};

const getItems = (geometry) => {
  const items = [];
  eachItem(geometry,
           item => {
             if (item.item) {
               items.push(item);
             }
           });
  return items;
};

const getPaths = (geometry) => {
  const pathsets = [];
  eachItem(geometry,
           item => {
             if (item.paths) {
               pathsets.push(item);
             }
           });
  return pathsets;
};

const getPlans = (geometry) => {
  const plans = [];
  eachItem(geometry,
           item => {
             if (item.plan) {
               plans.push(item);
             }
           });
  return plans;
};

const getPoints = (geometry) => {
  const pointsets = [];
  eachItem(geometry,
           item => {
             if (item.points) {
               pointsets.push(item);
             }
           });
  return pointsets;
};

const getSolids = (geometry) => {
  const solids = [];
  eachItem(geometry,
           item => {
             if (item.solid) {
               solids.push(item);
             }
           });
  return solids;
};

const getSurfaces = (geometry) => {
  const surfaces = [];
  eachItem(geometry,
           item => {
             if (item.surface) {
               surfaces.push(item);
             }
           });
  return surfaces;
};

const getZ0Surfaces = (geometry) => {
  const z0Surfaces = [];
  eachItem(geometry,
           item => {
             if (item.z0Surface) {
               z0Surfaces.push(item);
             }
           });
  return z0Surfaces;
};

const hasMatchingTag = (set, tags, whenSetUndefined = false) => {
  if (set === undefined) {
    return whenSetUndefined;
  } else if (tags !== undefined && tags.some(tag => set.includes(tag))) {
    return true;
  } else {
    return false;
  }
};

const buildCondition = (conditionTags, conditionSpec) => {
  switch (conditionSpec) {
    case 'has':
      return (geometryTags) => hasMatchingTag(geometryTags, conditionTags);
    case 'has not':
      return (geometryTags) => !hasMatchingTag(geometryTags, conditionTags);
    default:
      return undefined;
  }
};

const rewriteTagsImpl = (add, remove, geometry, conditionTags, conditionSpec) => {
  const condition = buildCondition(conditionTags, conditionSpec);
  const composeTags = (geometryTags) => {
    if (condition === undefined || condition(geometryTags)) {
      if (geometryTags === undefined) {
        return add.filter(tag => !remove.includes(tag));
      } else {
        return [...add, ...geometryTags].filter(tag => !remove.includes(tag));
      }
    } else {
      return geometryTags;
    }
  };

  // FIX: Minimize identity churn.
  const walk = (geometry) => {
    if (geometry.assembly) { return { assembly: geometry.assembly.map(walk) }; }
    if (geometry.disjointAssembly) { return { disjointAssembly: geometry.disjointAssembly.map(walk) }; }
    if (geometry.connection) { return { connection: geometry.connection, geometries: geometry.geometries.map(walk), connectors: geometry.connectors.map(walk), tags: composeTags(geometry.tags) }; }
    if (geometry.item) { return { item: walk(geometry.item), tags: composeTags(geometry.tags) }; }
    if (geometry.paths) { return { paths: geometry.paths, tags: composeTags(geometry.tags) }; }
    if (geometry.plan) { return { plan: geometry.plan, marks: geometry.marks, planes: geometry.planes, visualization: geometry.visualization, tags: composeTags(geometry.tags) }; }
    if (geometry.points) { return { points: geometry.points, tags: composeTags(geometry.tags) }; }
    if (geometry.solid) { return { solid: geometry.solid, tags: composeTags(geometry.tags) }; }
    if (geometry.surface) { return { surface: geometry.surface, tags: composeTags(geometry.tags) }; }
    if (geometry.untransformed) { return { untransformed: walk(geometry.untransformed), matrix: geometry.matrix }; }
    if (geometry.z0Surface) { return { z0Surface: geometry.z0Surface, tags: composeTags(geometry.tags) }; }
    throw Error('die');
  };

  return walk(geometry);
};

const rewriteTags = cacheRewriteTags(rewriteTagsImpl);

// Dropped elements displace as usual, but are not included in positive output.

const isNonNegative = (geometry) => hasMatchingTag(geometry.tags, ['compose/non-negative']);

const isNegative = (geometry) => !isNonNegative(geometry);

const nonNegative = (tags, geometry) => rewriteTags(['compose/non-negative'], [], geometry, tags, 'has');

// PROVE: Is the non-negative behavior here correct for difference in general, or only difference when makeing disjoint?

const differenceImpl = (baseGeometry, ...geometries) => {
  if (baseGeometry.item) {
    return { ...baseGeometry, item: difference(baseGeometry.item, ...geometries) };
  }

  const result = { disjointAssembly: [] };
  // Solids.
  const solids = geometries.flatMap(geometry => getSolids(geometry)).filter(isNegative).map(item => item.solid);
  for (const { solid, tags } of getSolids(baseGeometry)) {
    result.disjointAssembly.push({ solid: difference$1(solid, ...solids), tags });
  }
  // Surfaces -- generalize to surface unless specializable upon z0surface.
  const z0Surfaces = geometries.flatMap(geometry => getZ0Surfaces(geometry).filter(isNegative).map(item => item.z0Surface));
  const surfaces = geometries.flatMap(geometry => getSurfaces(geometry).filter(isNegative).map(item => item.surface));
  for (const { z0Surface, tags } of getZ0Surfaces(baseGeometry)) {
    if (surfaces.length === 0) {
      result.disjointAssembly.push({ z0Surface: difference$2(z0Surface, ...z0Surfaces), tags });
    } else {
      result.disjointAssembly.push({ surface: difference$3(z0Surface, ...z0Surfaces, ...surfaces), tags });
    }
  }
  for (const { surface, tags } of getSurfaces(baseGeometry)) {
    result.disjointAssembly.push({ surface: difference$3(surface, ...surfaces, ...z0Surfaces), tags });
  }
  // Paths.
  const pathsets = geometries.flatMap(geometry => getPaths(geometry)).filter(isNegative).map(item => item.paths);
  for (const { paths, tags } of getPaths(baseGeometry)) {
    result.disjointAssembly.push({ paths: difference$4(paths, ...pathsets), tags });
  }
  // Plans
  for (const plan of getPlans(baseGeometry)) {
    result.disjointAssembly.push(plan);
  }
  // Connections
  for (const connection of getConnections(baseGeometry)) {
    result.disjointAssembly.push(connection);
  }
  // Items
  for (const item of getItems(baseGeometry)) {
    result.disjointAssembly.push(item);
  }
  // Points
  for (const points of getPoints(baseGeometry)) {
    // FIX: Actually subtract points.
    result.disjointAssembly.push(points);
  }
  return result;
};

const difference = cache(differenceImpl);

// Dropped elements displace as usual, but are not included in positive output.

const drop = (tags, geometry) => rewriteTags(['compose/non-positive'], [], geometry, tags, 'has');

const eachPoint = (options, operation, geometry) => {
  const walk = (geometry) => {
    if (geometry.assembly) {
      geometry.assembly.forEach(walk);
    } else if (geometry.disjointAssembly) {
      geometry.disjointAssembly.forEach(walk);
    } else if (geometry.item) {
      walk(geometry.item);
    } else if (geometry.points) {
      eachPoint$1(options, operation, geometry.points);
    } else if (geometry.paths) {
      eachPoint$2(options, operation, geometry.paths);
    } else if (geometry.solid) {
      eachPoint$3(options, operation, geometry.solid);
    } else if (geometry.surface) {
      eachPoint$4(options, operation, geometry.surface);
    } else if (geometry.z0Surface) {
      eachPoint$4(options, operation, geometry.z0Surface);
    }
  };

  walk(geometry);
};

const flip = (geometry) => {
  const flipped = {};
  if (geometry.points) {
    flipped.points = flip$1(geometry.points);
  } else if (geometry.paths) {
    flipped.paths = flip$2(geometry.paths);
  } else if (geometry.surface) {
    flipped.surface = flip$3(geometry.surface);
  } else if (geometry.z0Surface) {
    flipped.z0Surface = flip$3(geometry.z0Surface);
  } else if (geometry.solid) {
    flipped.solid = flip$4(geometry.solid);
  } else if (geometry.assembly) {
    flipped.assembly = geometry.assembly.map(flip);
  } else if (geometry.disjointAssembly) {
    flipped.assembly = geometry.disjointAssembly.map(flip);
  } else if (geometry.plan) {
    if (geometry.plan.connector) {
      flipped.plan = geometry.plan;
      flipped.marks = geometry.marks;
      flipped.planes = geometry.planes.map(flip$5);
      // FIX: Mirror?
      flipped.visualization = geometry.visualization;
    } else {
      // Leave other plans be for now.
      flipped.plan = geometry.plan;
      flipped.marks = geometry.marks;
      flipped.planes = geometry.planes;
      flipped.visualization = geometry.visualization;
    }
  } else if (geometry.connection) {
    flipped.connection = geometry.connection;
    flipped.geometries = geometry.geometries.map(flip);
    flipped.connectors = geometry.connectors.map(flip);
  } else if (geometry.item) {
    // FIX: How should items deal with flip?
    flipped.item = geometry.item;
  } else {
    throw Error(`die: ${JSON.stringify(geometry)}`);
  }
  flipped.tags = geometry.tags;
  return flipped;
};

const fromPathToSurfaceImpl = (path) => {
  return { surface: [path] };
};

const fromPathToSurface = cache(fromPathToSurfaceImpl);

const fromPathToZ0SurfaceImpl = (path) => {
  return { z0Surface: [path] };
};

const fromPathToZ0Surface = cache(fromPathToZ0SurfaceImpl);

const fromPathsToSurfaceImpl = (paths) => {
  return { surface: paths };
};

const fromPathsToSurface = cache(fromPathsToSurfaceImpl);

const fromPathsToZ0SurfaceImpl = (paths) => {
  return { z0Surface: paths };
};

const fromPathsToZ0Surface = cache(fromPathsToZ0SurfaceImpl);

const fromSurfaceToPathsImpl = (surface) => {
  return { paths: surface };
};

const fromSurfaceToPaths = cache(fromSurfaceToPathsImpl);

const getAnySurfaces = (geometry) => {
  const surfaces = [];
  eachItem(geometry,
           item => {
             if (item.surface) {
               surfaces.push(item);
             }
             if (item.z0Surface) {
               surfaces.push(item);
             }
           });
  return surfaces;
};

const getTags = (geometry) => {
  if (geometry.tags === undefined) {
    return [];
  } else {
    return geometry.tags;
  }
};

const intersectionImpl = (baseGeometry, ...geometries) => {
  if (baseGeometry.item) {
    return { ...baseGeometry, item: intersection(baseGeometry.item, ...geometries) };
  }

  const result = { assembly: [] };
  // Solids.
  const solids = geometries.flatMap(geometry => getSolids(geometry).map(item => item.solid));
  for (const { solid, tags } of getSolids(baseGeometry)) {
    result.assembly.push({ solid: intersection$1(solid, ...solids), tags });
  }
  // Surfaces -- generalize to surface unless specializable upon z0surface.
  const z0Surfaces = geometries.flatMap(geometry => getZ0Surfaces(geometry).map(item => item.z0Surface));
  const surfaces = geometries.flatMap(geometry => getSurfaces(geometry).map(item => item.surface));
  for (const { z0Surface, tags } of getZ0Surfaces(baseGeometry)) {
    if (surfaces.length === 0) {
      result.assembly.push({ z0Surface: intersection$2(z0Surface, ...z0Surfaces), tags });
    } else {
      result.assembly.push({ surface: intersection$3(z0Surface, ...z0Surfaces, ...surfaces), tags });
    }
  }
  for (const { surface, tags } of getSurfaces(baseGeometry)) {
    result.assembly.push({ surface: intersection$3(surface, ...surfaces, ...z0Surfaces), tags });
  }
  // Paths.
  const pathsets = geometries.flatMap(geometry => getPaths(geometry)).filter(isNegative).map(item => item.paths);
  for (const { paths, tags } of getPaths(baseGeometry)) {
    result.disjointAssembly.push({ paths: intersection$4(paths, ...pathsets), tags });
  }
  // Plans
  for (const plan of getPlans(baseGeometry)) {
    result.disjointAssembly.push(plan);
  }
  // Connections
  for (const connection of getConnections(baseGeometry)) {
    result.disjointAssembly.push(connection);
  }
  // Items
  for (const item of getItems(baseGeometry)) {
    result.disjointAssembly.push(item);
  }
  // Points
  for (const points of getPoints(baseGeometry)) {
    // FIX: Actually subtract points.
    result.disjointAssembly.push(points);
  }
  // FIX: Surfaces, Paths, etc.
  return result;
};

const intersection = cache(intersectionImpl);

const keep = (tags, geometry) => rewriteTags(['compose/non-positive'], [], geometry, tags, 'has not');

const map = (geometry, operation) => {
  const present = item => item !== undefined;
  const walk = (geometry) => {
    if (geometry.assembly) {
      const assembly = geometry.assembly.map(walk).filter(present);
      return operation({ assembly, tags: geometry.tags });
    } else if (geometry.disjointAssembly) {
      // FIX: Consider the case where the operation does not preserve disjoinedness.
      const disjointAssembly = geometry.disjointAssembly.map(walk).filter(present);
      return operation({ disjointAssembly, tags: geometry.tags });
    } else {
      return operation(geometry);
    }
  };
  return walk(geometry);
};

const toDisjointAssembly = (geometry) => {
  if (geometry.matrix !== undefined) {
    // Transforming is identity-producing, so disjoint before transforming.
    return toTransformedGeometry({ ...geometry, untransformed: toDisjointGeometry(geometry.untransformed) });
  } else if (geometry.disjoint !== undefined) {
    return geometry.disjoint;
  } else if (geometry.item !== undefined) {
    return { ...geometry, item: toDisjointAssembly(geometry.item) };
  } else if (geometry.connection !== undefined) {
    return {
      ...geometry,
      connectors: geometry.connectors.map(toDisjointGeometry),
      geometries: geometry.geometries.map(toDisjointGeometry)
    };
  } else if (geometry.assembly !== undefined) {
    if (geometry.assembly.length === 0) {
      return { disjointAssembly: [] };
    }
    if (geometry.assembly.length === 1) {
      return toDisjointAssembly(geometry.assembly[0]);
    }
    const disjoint = [];
    for (let nth = geometry.assembly.length - 1; nth >= 0; nth--) {
      const item = toDisjointAssembly(geometry.assembly[nth]);
      if (item !== undefined) {
        disjoint.unshift(difference(item, ...disjoint));
      }
    }
    if (disjoint.length === 0) {
      return;
    }
    const disjointAssembly = { disjointAssembly: disjoint };
    geometry.disjoint = disjointAssembly;
    return disjointAssembly;
  } else {
    return geometry;
  }
};

const toDisjointGeometry = (inputGeometry) => {
  const disjointAssembly = toDisjointAssembly(inputGeometry);
  if (disjointAssembly === undefined) {
    return { disjointAssembly };
  } else {
    return disjointAssembly;
  }
};

const keptGeometry = Symbol('keptGeometry');

// Produce a disjoint geometry suitable for display.

const toKeptGeometry = (geometry) => {
  if (geometry[keptGeometry] === undefined) {
    const disjointGeometry = toDisjointGeometry(geometry);
    const walk = (geometry) => {
      if (geometry[keptGeometry] !== undefined) {
        return geometry[keptGeometry];
      } else if (geometry.tags === undefined || !geometry.tags.includes('compose/non-positive')) {
        if (geometry.disjointAssembly) {
          const kept = geometry.disjointAssembly.map(walk).filter(item => item !== undefined);
          if (kept.length > 0) {
            const kept = {
              ...geometry,
              disjointAssembly: geometry.disjointAssembly.map(walk).filter(item => item !== undefined)
            };
            geometry[keptGeometry] = kept;
            return kept;
          } else {
            return undefined;
          }
        } else if (geometry.connection) {
          return {
            ...geometry,
            geometries: geometry.geometries.map(toKeptGeometry)
          };
        } else {
          return geometry;
        }
      }
    };
    const kept = walk(disjointGeometry);
    geometry[keptGeometry] = kept || { disjointAssembly: [] };
  }
  return geometry[keptGeometry];
};

const measureBoundingBoxGeneric = (geometry) => {
  let minPoint = [Infinity, Infinity, Infinity];
  let maxPoint = [-Infinity, -Infinity, -Infinity];
  let empty = true;
  eachPoint({},
            (point) => {
              minPoint = min(minPoint, point);
              maxPoint = max(maxPoint, point);
              empty = false;
            },
            geometry);
  if (empty) {
    return [[0, 0, 0], [0, 0, 0]];
  } else {
    return [minPoint, maxPoint];
  }
};

const measureBoundingBox = (rawGeometry) => {
  const geometry = toKeptGeometry(rawGeometry);
  let empty = true;

  let minPoint = [Infinity, Infinity, Infinity];
  let maxPoint = [-Infinity, -Infinity, -Infinity];

  const update = ([itemMinPoint, itemMaxPoint]) => {
    empty = false;
    minPoint = min(minPoint, itemMinPoint);
    maxPoint = max(maxPoint, itemMaxPoint);
  };

  const walk = (item) => {
    if (item.assembly) {
      // Should we cache at the assembly level?
      for (const subitem of item.assembly) {
        walk(subitem);
      }
    } else if (item.disjointAssembly) {
      // Should we cache at the disjointAssembly level?
      for (const subitem of item.disjointAssembly) {
        walk(subitem);
      }
    } else if (item.item) {
      walk(item.item);
    } else if (item.solid) {
      update(measureBoundingBox$1(item.solid));
    } else if (item.surface) {
      update(measureBoundingBox$2(item.surface));
    } else if (item.z0Surface) {
      update(measureBoundingBox$3(item.z0Surface));
    } else if (item.plan) ; else {
      update(measureBoundingBoxGeneric(item));
    }
  };

  walk(geometry);

  if (empty) {
    return [[0, 0, 0], [0, 0, 0]];
  } else {
    return [minPoint, maxPoint];
  }
};

const toOutlineFromSurface = (surface) => {
  const convexSurface = makeConvex({}, surface);
  const pathSurfaces = [];
  for (const path of convexSurface) {
    const pathSurface = [path];
    pathSurface.plane = toPlane(convexSurface);
    pathSurfaces.push(pathSurface);
  }
  const simplified = union$1(...pathSurfaces);
  return simplified;
};

const outlineImpl = (geometry) => {
  // FIX: This assumes general coplanarity.
  const keptGeometry = toKeptGeometry(geometry);
  const outlines = [];
  for (const { surface, z0Surface } of getAnySurfaces(keptGeometry)) {
    const anySurface = surface || z0Surface;
    outlines.push(toOutlineFromSurface(anySurface));
  }
  return outlines.map(outline => ({ paths: outline }));
};

const outline = cache(outlineImpl);

const specify = (geometry) => ({ item: geometry });

// The resolution is 1 / multiplier.
const multiplier = 1e5;

const X = 0;
const Y = 1;
const Z = 2;

const createPointNormalizer = () => {
  const map = new Map();
  const normalize = (coordinate) => {
    // Apply a spatial quantization to the 3 dimensional coordinate.
    const nx = Math.floor(coordinate[X] * multiplier - 0.5);
    const ny = Math.floor(coordinate[Y] * multiplier - 0.5);
    const nz = Math.floor(coordinate[Z] * multiplier - 0.5);
    // Look for an existing inhabitant.
    const value = map.get(`${nx}/${ny}/${nz}`);
    if (value !== undefined) {
      return value;
    }
    // One of the ~0 or ~1 values will match the rounded values above.
    // The other will match the adjacent cell.
    const nx0 = nx;
    const ny0 = ny;
    const nz0 = nz;
    const nx1 = nx0 + 1;
    const ny1 = ny0 + 1;
    const nz1 = nz0 + 1;
    // Populate the space of the quantized coordinate and its adjacencies.
    // const normalized = [nx1 / multiplier, ny1 / multiplier, nz1 / multiplier];
    const normalized = coordinate;
    map.set(`${nx0}/${ny0}/${nz0}`, normalized);
    map.set(`${nx0}/${ny0}/${nz1}`, normalized);
    map.set(`${nx0}/${ny1}/${nz0}`, normalized);
    map.set(`${nx0}/${ny1}/${nz1}`, normalized);
    map.set(`${nx1}/${ny0}/${nz0}`, normalized);
    map.set(`${nx1}/${ny0}/${nz1}`, normalized);
    map.set(`${nx1}/${ny1}/${nz0}`, normalized);
    map.set(`${nx1}/${ny1}/${nz1}`, normalized);
    // This is now the normalized coordinate for this region.
    return normalized;
  };
  return normalize;
};

const toPoints = (options = {}, geometry) => {
  const normalize = createPointNormalizer();
  const points = new Set();
  eachPoint(options, point => points.add(normalize(point)), geometry);
  return { points: [...points] };
};

// Produce a standard geometry representation without caches, etc.

const toStandardGeometry = (geometry) => {
  const walk = (item) => {
    if (item.assembly) {
      return { assembly: item.assembly.map(walk), tags: item.tags };
    } else if (item.paths) {
      return { paths: item.paths, tags: item.tags };
    } else if (item.plan) {
      return { plan: item.plan, marks: item.marks, planes: item.planes, visualization: item.visualization, tags: item.tags };
    } else if (item.item) {
      return { item: item.item, tags: item.tags };
    } else if (item.connection) {
      return { connection: item.connection.map(walk), geometries: item.geometries.map(walk), connectors: item.connectors.map(walk), tags: item.tags };
    } else if (item.solid) {
      return { solid: item.solid, tags: item.tags };
    } else if (item.surface) {
      return { surface: item.surface, tags: item.tags };
    } else if (item.z0Surface) {
      return { z0Surface: item.z0Surface, tags: item.tags };
    } else {
      throw Error('die');
    }
  };

  return walk(geometry);
};

const transformImpl = (matrix, untransformed) => {
  if (matrix.some(value => typeof value !== 'number' || isNaN(value))) {
    throw Error('die');
  }
  return { matrix, untransformed, tags: untransformed.tags };
};

const transform = cacheTransform(transformImpl);

const unionImpl = (baseGeometry, ...geometries) => {
  if (baseGeometry.item) {
    return { ...baseGeometry, item: union(baseGeometry.item, ...geometries) };
  }

  const result = { assembly: [] };
  // Solids.
  const solids = geometries.flatMap(geometry => getSolids(geometry).map(item => item.solid));
  for (const { solid, tags } of getSolids(baseGeometry)) {
    result.assembly.push({ solid: union$2(solid, ...solids), tags });
  }
  // Surfaces -- generalize to surface unless specializable upon z0surface.
  const z0Surfaces = geometries.flatMap(geometry => getZ0Surfaces(geometry).map(item => item.z0Surface));
  const surfaces = geometries.flatMap(geometry => getSurfaces(geometry).map(item => item.surface));
  for (const { z0Surface, tags } of getZ0Surfaces(baseGeometry)) {
    if (surfaces.length === 0) {
      result.assembly.push({ z0Surface: union$3(z0Surface, ...z0Surfaces), tags });
    } else {
      result.assembly.push({ surface: union$1(z0Surface, ...z0Surfaces, ...surfaces), tags });
    }
  }
  for (const { surface, tags } of getSurfaces(baseGeometry)) {
    result.assembly.push({ surface: union$1(surface, ...surfaces, ...z0Surfaces), tags });
  }
  // Paths.
  const pathsets = geometries.flatMap(geometry => getPaths(geometry)).filter(isNegative).map(item => item.paths);
  for (const { paths, tags } of getPaths(baseGeometry)) {
    result.disjointAssembly.push({ paths: union$4(paths, ...pathsets), tags });
  }
  // Plans
  for (const plan of getPlans(baseGeometry)) {
    result.disjointAssembly.push(plan);
  }
  // Connections
  for (const connection of getConnections(baseGeometry)) {
    result.disjointAssembly.push(connection);
  }
  // Items
  for (const item of getItems(baseGeometry)) {
    result.disjointAssembly.push(item);
  }
  // Points
  for (const points of getPoints(baseGeometry)) {
    // FIX: Actually subtract points.
    result.disjointAssembly.push(points);
  }
  // FIX: Surfaces, Paths, etc.
  return result;
};

const union = cache(unionImpl);

const rotateX = (angle, assembly) => transform(fromXRotation(angle * Math.PI / 180), assembly);
const rotateY = (angle, assembly) => transform(fromYRotation(angle * Math.PI / 180), assembly);
const rotateZ = (angle, assembly) => transform(fromZRotation(angle * Math.PI / 180), assembly);
const translate = (vector, assembly) => transform(fromTranslation(vector), assembly);
const scale = (vector, assembly) => transform(fromScaling(vector), assembly);

export { allTags, assemble, canonicalize, difference, drop, eachItem, eachPoint, flip, fromPathToSurface, fromPathToZ0Surface, fromPathsToSurface, fromPathsToZ0Surface, fromSurfaceToPaths, getAnySurfaces, getItems, getPaths, getPlans, getPoints, getSolids, getSurfaces, getTags, getZ0Surfaces, intersection, keep, map, measureBoundingBox, nonNegative, outline, rewriteTags, rotateX, rotateY, rotateZ, scale, specify, toDisjointGeometry, toKeptGeometry, toPoints, toStandardGeometry, toTransformedGeometry, transform, translate, union };
