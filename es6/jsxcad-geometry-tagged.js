import { identity, multiply, fromXRotation, fromYRotation, fromZRotation, fromTranslation, fromScaling } from './jsxcad-math-mat4.js';
import { cacheTransform, cache, cacheRewriteTags } from './jsxcad-cache.js';
import { reconcile as reconcile$1, makeWatertight as makeWatertight$1, isWatertight as isWatertight$1, findOpenEdges as findOpenEdges$1, transform as transform$4, canonicalize as canonicalize$5, eachPoint as eachPoint$3, flip as flip$4, measureBoundingBox as measureBoundingBox$1, outline as outline$1 } from './jsxcad-geometry-solid.js';
import { close } from './jsxcad-geometry-path.js';
import { createNormalize3 } from './jsxcad-algorithm-quantize.js';
import { transform as transform$1, canonicalize as canonicalize$2, difference as difference$4, eachPoint as eachPoint$2, flip as flip$2, intersection as intersection$4, union as union$3 } from './jsxcad-geometry-paths.js';
import { transform as transform$3, canonicalize as canonicalize$3, flip as flip$5 } from './jsxcad-math-plane.js';
import { transform as transform$2, canonicalize as canonicalize$1, eachPoint as eachPoint$1, flip as flip$1 } from './jsxcad-geometry-points.js';
import { transform as transform$5, canonicalize as canonicalize$4, eachPoint as eachPoint$4, flip as flip$3, makeConvex, measureArea as measureArea$1, measureBoundingBox as measureBoundingBox$2, outline as outline$2 } from './jsxcad-geometry-surface.js';
import { difference as difference$1, intersection as intersection$1, union as union$1 } from './jsxcad-geometry-solid-boolean.js';
import { difference as difference$2, intersection as intersection$2, union as union$2 } from './jsxcad-geometry-surface-boolean.js';
import { difference as difference$3, intersection as intersection$3, outline as outline$3, union as union$4 } from './jsxcad-geometry-z0surface-boolean.js';
import { min, max } from './jsxcad-math-vec3.js';
import { measureBoundingBox as measureBoundingBox$3 } from './jsxcad-geometry-z0surface.js';

const transformImpl = (matrix, untransformed) => {
  if (matrix.some(value => typeof value !== 'number' || isNaN(value))) {
    throw Error('die');
  }
  return { matrix, untransformed, tags: untransformed.tags };
};

const transform = cacheTransform(transformImpl);

const update = (geometry, updates) => {
  const updated = {};
  for (const key of Object.keys(geometry)) {
    if (typeof key !== 'symbol') {
      updated[key] = geometry[key];
    }
  }
  for (const key of Object.keys(updates)) {
    updated[key] = updates[key];
  }
  return updated;
};

const rewrite = (geometry, op) => {
  const walk = (geometry) => {
    if (geometry.assembly) {
      return op(geometry, _ => update(geometry, { assembly: geometry.assembly.map(walk) }), walk);
    } else if (geometry.disjointAssembly) {
      return op(geometry, _ => update(geometry, { disjointAssembly: geometry.disjointAssembly.map(walk) }), walk);
    } else if (geometry.layers) {
      return op(geometry, _ => update(geometry, { layers: geometry.layers.map(walk) }), walk);
    } else if (geometry.connection) {
      return op(geometry,
                _ => update(geometry, { geometries: geometry.geometries.map(walk), connectors: geometry.connectors.map(walk) }),
                walk);
    } else if (geometry.item) {
      return op(geometry, _ => update(geometry, { item: walk(geometry.item) }), walk);
    } else if (geometry.paths) {
      return op(geometry, _ => geometry, walk);
    } else if (geometry.plan) {
      return op(geometry, _ => update(geometry, { content: walk(geometry.content) }), walk);
    } else if (geometry.points) {
      return op(geometry, _ => geometry, walk);
    } else if (geometry.solid) {
      return op(geometry, _ => geometry, walk);
    } else if (geometry.surface) {
      return op(geometry, _ => geometry, walk);
    } else if (geometry.untransformed) {
      return op(geometry, _ => update(geometry, { untransformed: walk(geometry.untransformed) }), walk);
    } else if (geometry.z0Surface) {
      return op(geometry, _ => geometry, walk);
    } else {
      throw Error('die: Unknown geometry');
    }
  };
  return walk(geometry);
};

const visit = (geometry, op) => {
  const walk = (geometry) => {
    if (geometry.assembly) {
      op(geometry, _ => geometry.assembly.forEach(walk));
    } else if (geometry.disjointAssembly) {
      op(geometry, _ => geometry.disjointAssembly.forEach(walk));
    } else if (geometry.layers) {
      op(geometry, _ => geometry.layers.forEach(walk));
    } else if (geometry.connection) {
      op(geometry, _ => { geometry.geometries.forEach(walk); geometry.connectors.forEach(walk); });
    } else if (geometry.item) {
      op(geometry, _ => walk(geometry.item));
    } else if (geometry.paths) {
      op(geometry, _ => undefined);
    } else if (geometry.plan) {
      op(geometry, _ => { walk(geometry.content); });
    } else if (geometry.points) {
      op(geometry, _ => undefined);
    } else if (geometry.solid) {
      op(geometry, _ => undefined);
    } else if (geometry.surface) {
      op(geometry, _ => undefined);
    } else if (geometry.untransformed) {
      op(geometry, _ => walk(geometry.untransformed));
    } else if (geometry.z0Surface) {
      op(geometry, _ => undefined);
    } else {
      throw Error('die: Unknown geometry');
    }
  };
  walk(geometry);
};

const reconcile = (geometry, normalize = createNormalize3()) =>
  rewrite(geometry,
          (geometry, descend) => {
            if (geometry.solid) {
              return {
                solid: reconcile$1(geometry.solid, normalize),
                tags: geometry.tags
              };
            } else {
              return descend();
            }
          });

const makeWatertight = (geometry, normalize = createNormalize3(), onFixed) =>
  rewrite(geometry,
          (geometry, descend) => {
            if (geometry.solid) {
              return {
                solid: makeWatertight$1(geometry.solid, normalize, onFixed),
                tags: geometry.tags
              };
            } else {
              return descend();
            }
          });

const isWatertight = (geometry) => {
  let watertight = true;
  visit(geometry,
        (geometry, descend) => {
          if (geometry.solid && !isWatertight$1(geometry.solid)) {
            watertight = false;
          }
          return descend();
        });
  return watertight;
};

const findOpenEdges = (geometry) => {
  const openEdges = [];
  visit(geometry,
        (geometry, descend) => {
          if (geometry.solid) {
            openEdges.push(...findOpenEdges$1(geometry.solid).map(close));
          }
          return descend();
        });
  return { paths: openEdges };
};

// Remove any symbols (which refer to cached values).
const fresh = (geometry) => {
  const fresh = {};
  for (const key of Object.keys(geometry)) {
    if (typeof key !== 'symbol') {
      fresh[key] = geometry[key];
    }
  }
  return fresh;
};

const shallowEq = (a, b) => {
  if (a === undefined) throw Error('die');
  if (b === undefined) throw Error('die');
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
};

// Rewrite on the way back up the call-path.
const rewriteUp = (geometry, op) => {
  // FIX: Minimize identity churn.
  const walk = (geometry) => {
    const q = (postopGeometry) => {
      if (postopGeometry === undefined) {
        return geometry;
      } else if (postopGeometry === geometry) {
        return geometry;
      } else {
        return fresh(postopGeometry);
      }
    };

    if (geometry.assembly) {
      const assembly = geometry.assembly.map(walk);
      if (shallowEq(assembly, geometry.assembly)) {
        return q(op(geometry));
      } else {
        return q(op({ ...geometry, assembly }));
      }
    } else if (geometry.disjointAssembly) {
      const disjointAssembly = geometry.disjointAssembly.map(walk);
      if (shallowEq(disjointAssembly, geometry.disjointAssembly)) {
        return q(op(geometry));
      } else {
        return q(op({ ...geometry, disjointAssembly }));
      }
    } else if (geometry.layers) {
      const layers = geometry.layers.map(walk);
      if (shallowEq(layers, geometry.layers)) {
        return q(op(geometry));
      } else {
        return q(op({ ...geometry, layers }));
      }
    } else if (geometry.connection) {
      const geometries = geometry.geometries.map(walk);
      const connectors = geometry.connectors.map(walk);
      if (shallowEq(geometries, geometry.geometries) &&
          shallowEq(connectors, geometry.connectors)) {
        return q(op(geometry));
      } else {
        return q(op({ ...geometry, geometries, connectors }));
      }
    } else if (geometry.item) {
      const item = walk(geometry.item);
      if (item === geometry.item) {
        return q(op(geometry));
      } else {
        return q(op({ ...geometry, item }));
      }    } else if (geometry.paths) {
      return q(op(geometry));
    } else if (geometry.plan) {
      const content = walk(geometry.content);
      if (content === geometry.content) {
        return q(op(geometry));
      } else {
        return q(op({ ...geometry, content }));
      }
    } else if (geometry.points) {
      return q(op(geometry));
    } else if (geometry.solid) {
      return q(op(geometry));
    } else if (geometry.surface) {
      return q(op(geometry));
    } else if (geometry.untransformed) {
      const untransformed = walk(geometry.untransformed);
      if (untransformed === geometry.untransformed) {
        return q(op(geometry));
      } else {
        return q(op({ ...geometry, untransformed }));
      }
    } else if (geometry.z0Surface) {
      return q(op(geometry));
    } else {
      throw Error('die: Unknown geometry');
    }
  };

  return walk(geometry);
};

// FIX: Refactor the geometry walkers.

const allTags = (geometry) => {
  const collectedTags = new Set();
  const op = ({ tags }) => {
    if (tags !== undefined) {
      for (const tag of tags) {
        collectedTags.add(tag);
      }
    }
  };
  rewriteUp(geometry, op);
  return collectedTags;
};

const assembleImpl = (...taggedGeometries) => ({ assembly: taggedGeometries });

const assemble = cache(assembleImpl);

const transformedGeometry = Symbol('transformedGeometry');

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
      } else if (geometry.layers) {
        return {
          layers: geometry.layers.map(geometry => walk(matrix, geometry)),
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
          content: walk(matrix, geometry.content),
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
          solid: transform$4(matrix, reconcile$1(geometry.solid)),
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
    canonicalized.content = canonicalize(geometry.content);
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
  } else if (geometry.layers !== undefined) {
    canonicalized.layers = geometry.layers.map(canonicalize);
  } else if (geometry.disjointAssembly !== undefined) {
    canonicalized.disjointAssembly = geometry.disjointAssembly.map(canonicalize);
  } else if (geometry.item !== undefined) {
    canonicalized.item = canonicalize(geometry.item);
  } else {
    throw Error('die');
  }
  if (geometry.tags !== undefined) {
    canonicalized.tags = geometry.tags;
  }
  return canonicalized;
};

const eachItem = (geometry, op) => {
  const walk = (geometry, descend) => { op(geometry); descend(); };
  visit(geometry, walk);
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

const differenceImpl = (geometry, ...geometries) => {
  const op = (geometry, descend) => {
    if (geometry.solid) {
      const todo = [];
      for (const geometry of geometries) {
        for (const { solid } of getSolids(geometry)) {
          todo.push(solid);
        }
      }
      return { solid: difference$1(geometry.solid, ...todo), tags: geometry.tags };
    } else if (geometry.surface) {
      const todo = [];
      for (const geometry of geometries) {
        for (const { surface } of getSurfaces(geometry)) {
          todo.push(surface);
        }
        for (const { z0Surface } of getZ0Surfaces(geometry)) {
          todo.push(z0Surface);
        }
      }
      return { surface: difference$2(geometry.surface, ...todo), tags: geometry.tags };
    } else if (geometry.z0Surface) {
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
        return { surface: difference$2(geometry.z0Surface, ...todoSurfaces, ...todoZ0Surfaces), tags: geometry.tags };
      } else {
        return { surface: difference$3(geometry.z0Surface, ...todoZ0Surfaces), tags: geometry.tags };
      }
    } else if (geometry.paths) {
      const todo = [];
      for (const geometry of geometries) {
        for (const { paths } of getPaths(geometry)) {
          todo.push(paths);
        }
      }
      return { paths: difference$4(geometry.paths, ...todo), tags: geometry.tags };
    } else {
      return descend();
    }
  };

  return rewrite(geometry, op);
};

const difference = cache(differenceImpl);

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

  const op = (geometry) => {
    if (geometry.assembly || geometry.disjointAssembly) {
      // These structural geometries don't take tags.
      return geometry;
    }
    const composedTags = composeTags(geometry.tags);
    if (composedTags === undefined) {
      const copy = { ...geometry };
      delete copy.tags;
      return copy;
    } if (composedTags === geometry.tags) {
      return geometry;
    } else {
      return { ...geometry, tags: composedTags };
    }
  };

  return rewriteUp(geometry, op);
};

const rewriteTags = cacheRewriteTags(rewriteTagsImpl);

// Dropped elements displace as usual, but are not included in positive output.

const drop = (tags, geometry) => rewriteTags(['compose/non-positive'], [], geometry, tags, 'has');

const eachPoint = (operation, geometry) => {
  const walk = (geometry) => {
    if (geometry.assembly) {
      geometry.assembly.forEach(walk);
    } else if (geometry.layers) {
      geometry.layers.forEach(walk);
    } else if (geometry.disjointAssembly) {
      geometry.disjointAssembly.forEach(walk);
    } else if (geometry.connection) {
      geometry.geometries.forEach(walk);
    } else if (geometry.item) {
      walk(geometry.item);
    } else if (geometry.points) {
      eachPoint$1(operation, geometry.points);
    } else if (geometry.paths) {
      eachPoint$2(operation, geometry.paths);
    } else if (geometry.solid) {
      eachPoint$3(operation, geometry.solid);
    } else if (geometry.surface) {
      eachPoint$4(operation, geometry.surface);
    } else if (geometry.z0Surface) {
      eachPoint$4(operation, geometry.z0Surface);
    }
  };

  walk(geometry);
};

const flip = (geometry) => {
  const op = (geometry) => {
    if (geometry.points) {
      return { ...geometry, points: flip$1(geometry.points) };
    } else if (geometry.paths) {
      return { ...geometry, paths: flip$2(geometry.paths) };
    } else if (geometry.surface) {
      return { ...geometry, surface: flip$3(geometry.surface) };
    } else if (geometry.z0Surface) {
      return { ...geometry, surface: flip$3(geometry.z0Surface) };
    } else if (geometry.solid) {
      return { ...geometry, solid: flip$4(geometry.solid) };
    } else if (geometry.assembly) {
      return geometry;
    } else if (geometry.layers) {
      return geometry;
    } else if (geometry.disjointAssembly) {
      return geometry;
    } else if (geometry.plan) {
      if (geometry.plan.connector) {
        // FIX: Mirror visualization?
        return { ...geometry, planes: geometry.planes.map(flip$5) };
      } else {
        return { ...geometry, content: flip(geometry.content) };
      }
    } else if (geometry.connection) {
      return {
        ...geometry,
        geometries: geometry.geometries.map(flip),
        connectors: geometry.connectors.map(flip)
      };
    } else if (geometry.item) {
      // FIX: How should items deal with flip?
      return geometry;
    } else {
      throw Error(`die: ${JSON.stringify(geometry)}`);
    }
  };
  return rewriteUp(geometry, op);
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
  return { surface: makeConvex(paths) };
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
  const op = (geometry, descend) => {
    if (geometry.item) {
      items.push(geometry);
    } else {
      descend();
    }
  };
  visit(geometry, op);
  return items;
};

// This gets each layer independently.

const getLayers = (geometry) => {
  const layers = [];
  const op = (geometry, descend, walk) => {
    if (geometry.layers) {
      geometry.layers.forEach(layer => layers.unshift(walk(layer)));
      return { assembly: [] };
    } else {
      return descend();
    }
  };
  rewrite(geometry, op);
  return layers;
};

// Retrieve leaf geometry.

const getLeafs = (geometry) => {
  const leafs = [];
  const op = (geometry, descend) => {
    if (geometry.assembly || geometry.disjointAssembly || geometry.layers || geometry.content) {
      descend();
    } else {
      leafs.push(geometry);
    }
  };
  visit(geometry, op);
  return leafs;
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

const getTags = (geometry) => {
  if (geometry.tags === undefined) {
    return [];
  } else {
    return geometry.tags;
  }
};

const intersectionImpl = (geometry, ...geometries) => {
  const op = (geometry, descend) => {
    if (geometry.solid) {
      const todo = [];
      for (const geometry of geometries) {
        for (const { solid } of getSolids(geometry)) {
          todo.push(solid);
        }
      }
      return { solid: intersection$1(geometry.solid, ...todo), tags: geometry.tags };
    } else if (geometry.surface) {
      const todo = [];
      for (const geometry of geometries) {
        for (const { surface } of getSurfaces(geometry)) {
          todo.push(surface);
        }
        for (const { z0Surface } of getZ0Surfaces(geometry)) {
          todo.push(z0Surface);
        }
      }
      return { surface: intersection$2(geometry.surface, ...todo), tags: geometry.tags };
    } else if (geometry.z0Surface) {
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
        return { surface: intersection$2(geometry.z0Surface, ...todoSurfaces, ...todoZ0Surfaces), tags: geometry.tags };
      } else {
        return { surface: intersection$3(geometry.z0Surface, ...todoZ0Surfaces), tags: geometry.tags };
      }
    } else if (geometry.paths) {
      const todo = [];
      for (const geometry of geometries) {
        for (const { paths } of getPaths(geometry)) {
          todo.push(paths);
        }
      }
      return { paths: intersection$4(geometry.paths, ...todo), tags: geometry.tags };
    } else {
      return descend();
    }
  };

  return rewrite(geometry, op);
};

const intersection = cache(intersectionImpl);

const keep = (tags, geometry) => rewriteTags(['compose/non-positive'], [], geometry, tags, 'has not');

const map = (geometry, operation) => {
  const present = item => item !== undefined;
  const walk = (geometry) => {
    if (geometry.assembly) {
      // CHECK: When can items not be present?
      const assembly = geometry.assembly.map(walk).filter(present);
      return operation({ assembly, tags: geometry.tags });
    } else if (geometry.layers) {
      const layers = geometry.layers.map(walk);
      return operation({ layers, tags: geometry.tags });
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

const disjointAssembly = Symbol('disjointAssembly');

const toDisjointAssembly = (geometry) => {
  if (geometry.matrix) {
    // Transforming is identity-producing, so disjoint before transforming.
    return toTransformedGeometry({ ...geometry, untransformed: toDisjointGeometry(geometry.untransformed) });
  } else if (geometry[disjointAssembly]) {
    return geometry[disjointAssembly];
  } else if (geometry.item) {
    return { ...geometry, item: toDisjointAssembly(geometry.item) };
  } else if (geometry.connection) {
    return {
      ...geometry,
      connectors: geometry.connectors.map(toDisjointGeometry),
      geometries: geometry.geometries.map(toDisjointGeometry)
    };
  } else if (geometry.layers) {
    return {
      ...geometry,
      layers: geometry.layers.map(toDisjointGeometry)
    };
  } else if (geometry.plan) {
    return {
      ...geometry,
      content: toDisjointGeometry(geometry.content)
    };
  } else if (geometry.assembly) {
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
    const result = { disjointAssembly: disjoint };
    geometry[disjointAssembly] = result;
    return result;
  } else {
    return geometry;
  }
};

const toDisjointGeometry = (inputGeometry) => {
  const disjointAssembly = toDisjointAssembly(inputGeometry);
  if (disjointAssembly === undefined) {
    return { disjointAssembly: [] };
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
        } else if (geometry.item) {
          return {
            ...geometry,
            item: toKeptGeometry(geometry.item)
          };
        } else if (geometry.plan) {
          return {
            ...geometry,
            content: toKeptGeometry(geometry.content)
          };
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

const measureArea = (rawGeometry) => {
  const geometry = toKeptGeometry(rawGeometry);
  let area = 0;
  const op = (geometry, descend) => {
    if (geometry.surface || geometry.z0Surface) {
      area += measureArea$1(geometry.surface);
    } else if (geometry.solid) {
      for (const surface of geometry.solid) {
        area += measureArea$1(surface);
      }
    }
    descend();
  };
  visit(geometry, op);
  return area;
};

const measureBoundingBoxGeneric = (geometry) => {
  let minPoint = [Infinity, Infinity, Infinity];
  let maxPoint = [-Infinity, -Infinity, -Infinity];
  eachPoint(point => {
    minPoint = min(minPoint, point);
    maxPoint = max(maxPoint, point);
  },
            geometry);
  return [minPoint, maxPoint];
};

const measureBoundingBox = (rawGeometry) => {
  const geometry = toKeptGeometry(rawGeometry);

  let minPoint = [Infinity, Infinity, Infinity];
  let maxPoint = [-Infinity, -Infinity, -Infinity];

  const update = ([itemMinPoint, itemMaxPoint]) => {
    minPoint = min(minPoint, itemMinPoint);
    maxPoint = max(maxPoint, itemMaxPoint);
  };

  const walk = (item) => {
    if (item.assembly) {
      item.assembly.forEach(walk);
    } else if (item.layers) {
      item.layers.forEach(walk);
    } else if (item.connection) {
      item.geometries.map(walk);
    } else if (item.disjointAssembly) {
      item.disjointAssembly.forEach(walk);
    } else if (item.item) {
      walk(item.item);
    } else if (item.solid) {
      update(measureBoundingBox$1(item.solid));
    } else if (item.surface) {
      update(measureBoundingBox$2(item.surface));
    } else if (item.z0Surface) {
      update(measureBoundingBox$3(item.z0Surface));
    } else if (item.plan) {
      if (item.plan.page) {
        update(item.marks);
      }
      walk(item.content);
    } else {
      update(measureBoundingBoxGeneric(item));
    }
  };

  walk(geometry);

  return [minPoint, maxPoint];
};

const nonNegative = (tags, geometry) => rewriteTags(['compose/non-negative'], [], geometry, tags, 'has');

const outlineImpl = (geometry) => {
  const normalize = createNormalize3();

  // FIX: This assumes general coplanarity.
  const keptGeometry = toKeptGeometry(geometry);
  const outlines = [];
  for (const { solid } of getSolids(keptGeometry)) {
    outlines.push(outline$1(solid, normalize));
  }
  for (const { surface } of getSurfaces(keptGeometry)) {
    outlines.push(outline$2(surface, normalize));
  }
  for (const { z0Surface } of getZ0Surfaces(keptGeometry)) {
    outlines.push(outline$3(z0Surface, normalize));
  }
  return outlines.map(outline => ({ paths: outline }));
};

const outline = cache(outlineImpl);

const specify = (geometry) => ({ item: geometry });

const splice = (geometry, find, replace) =>
  rewriteUp(geometry, geometry => geometry.connection === find.connection ? replace : geometry);

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

const toPoints = (geometry) => {
  const normalize = createPointNormalizer();
  const points = new Set();
  eachPoint(point => points.add(normalize(point)), geometry);
  return { points: [...points] };
};

// Union is a little more complex, since it can make violate disjointAssembly invariants.

const unifySolids = (geometry, ...geometries) => {
  const todo = [];
  for (const geometry of geometries) {
    for (const { solid } of getSolids(geometry)) {
      todo.push(solid);
    }
  }
  return { solid: union$1(geometry.solid, ...todo), tags: geometry.tags };
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
  return { surface: union$2(geometry.surface, ...todo), tags: geometry.tags };
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
    return { surface: union$2(geometry.z0Surface, ...todoSurfaces, ...todoZ0Surfaces), tags: geometry.tags };
  } else {
    return { surface: union$4(geometry.z0Surface, ...todoZ0Surfaces), tags: geometry.tags };
  }
};

const unifyPaths = (geometry, ...geometries) => {
  const todo = [];
  for (const geometry of geometries) {
    for (const { paths } of getPaths(geometry)) {
      todo.push(paths);
    }
  }
  return { paths: union$3(geometry.paths, ...todo), tags: geometry.tags };
};

const unionImpl = (geometry, ...geometries) => {
  const op = (geometry, descend) => {
    if (geometry.solid) {
      return unifySolids(geometry, ...geometries);
    } else if (geometry.surface) {
      return unifySurfaces(geometry, ...geometries);
    } else if (geometry.z0Surface) {
      return unifyZ0Surfaces(geometry, ...geometries);
    } else if (geometry.paths) {
      return unifyPaths(geometry, ...geometries);
    } else if (geometry.assembly || geometry.disjointAssembly) {
      const payload = geometry.assembly || geometry.disjointAssembly;
      // We consider assemblies to have an implicit Empty() at the end.
      return {
        assembly: [
          ...payload,
          unifySolids({ solid: [] }, ...geometries),
          unifySurfaces({ surface: [] }, ...geometries),
          unifyPaths({ paths: [] }, ...geometries)
        ],
        tags: geometry.tags
      };
    } else if (geometry.layers) {
      // We consider layers to have an implicit Empty() at the end.
      return {
        layers: [
          ...geometry.layers,
          unifySolids({ solid: [] }, ...geometries),
          unifySurfaces({ surface: [] }, ...geometries),
          unifyPaths({ paths: [] }, ...geometries)
        ],
        tags: geometry.tags
      };
    } else {
      return descend();
    }
  };

  return rewrite(geometry, op);
};

const union = cache(unionImpl);

const rotateX = (angle, assembly) => transform(fromXRotation(angle * Math.PI / 180), assembly);
const rotateY = (angle, assembly) => transform(fromYRotation(angle * Math.PI / 180), assembly);
const rotateZ = (angle, assembly) => transform(fromZRotation(angle * Math.PI / 180), assembly);
const translate = (vector, assembly) => transform(fromTranslation(vector), assembly);
const scale = (vector, assembly) => transform(fromScaling(vector), assembly);

export { allTags, assemble, canonicalize, difference, drop, eachItem, eachPoint, findOpenEdges, flip, fresh, fromPathToSurface, fromPathToZ0Surface, fromPathsToSurface, fromPathsToZ0Surface, fromSurfaceToPaths, getAnySurfaces, getConnections, getItems, getLayers, getLeafs, getPaths, getPlans, getPoints, getSolids, getSurfaces, getTags, getZ0Surfaces, intersection, isWatertight, keep, makeWatertight, map, measureArea, measureBoundingBox, nonNegative, outline, reconcile, rewrite, rewriteTags, rotateX, rotateY, rotateZ, scale, specify, splice, toDisjointGeometry, toKeptGeometry, toPoints, toTransformedGeometry, transform, translate, union, update, visit };
