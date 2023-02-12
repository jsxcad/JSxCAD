import { composeTransforms, approximate as approximate$1, deletePendingSurfaceMeshes, disjoint as disjoint$1, bend as bend$1, serialize as serialize$1, cast as cast$1, clip as clip$1, computeCentroid as computeCentroid$1, computeImplicitVolume as computeImplicitVolume$1, computeNormal as computeNormal$1, computeOrientedBoundingBox as computeOrientedBoundingBox$1, computeToolpath as computeToolpath$1, convexHull as convexHull$1, convertPolygonsToMeshes as convertPolygonsToMeshes$1, cut as cut$1, deform as deform$1, demesh as demesh$1, dilateXY as dilateXY$1, fromSegmentToInverseTransform, invertTransform, faceEdges, eachPoint as eachPoint$1, outline as outline$1, eachTriangle as eachTriangle$1, eagerTransform as eagerTransform$1, extrude as extrude$1, fix as fix$1, fromPolygons as fromPolygons$1, fromPolygonSoup as fromPolygonSoup$1, fuse as fuse$1, generateEnvelope, grow as grow$1, involute as involute$1, fill as fill$1, inset as inset$1, join as join$1, link as link$1, loft as loft$1, makeAbsolute as makeAbsolute$1, computeArea, computeBoundingBox, computeVolume, offset as offset$1, remesh as remesh$1, seam as seam$1, section as section$1, shell as shell$1, simplify as simplify$1, smooth as smooth$1, separate as separate$1, identity, twist as twist$1, unfold as unfold$1, wrap as wrap$1, fromRotateXToTransform, fromRotateYToTransform, fromRotateZToTransform, fromTranslateToTransform, fromScaleToTransform } from './jsxcad-algorithm-cgal.js';
export { fromRotateXToTransform, fromRotateYToTransform, fromRotateZToTransform, fromScaleToTransform, fromTranslateToTransform, identity, withAabbTreeQuery } from './jsxcad-algorithm-cgal.js';
import { computeHash, write as write$1, read as read$1, readNonblocking as readNonblocking$1, ErrorWouldBlock, addPending } from './jsxcad-sys.js';
import { toTagsFromName } from './jsxcad-algorithm-material.js';

const update = (geometry, updates, changes) => {
  if (updates === undefined) {
    return geometry;
  }
  if (geometry === updates) {
    return geometry;
  }
  const updated = {};
  for (const key of Object.keys(geometry)) {
    if (key === 'cache') {
      // Caches contains derivations from the original object.
      continue;
    }
    if (key === 'hash') {
      // Hash is a bit like a symbol, but we want it to persist.
      continue;
    }
    if (typeof key === 'symbol') {
      // Don't copy symbols.
      continue;
    }
    updated[key] = geometry[key];
  }
  let changed = false;
  for (const key of Object.keys(updates)) {
    if (updates[key] !== updated[key]) {
      updated[key] = updates[key];
      changed = true;
    }
  }
  if (changes !== undefined) {
    for (const key of Object.keys(changes)) {
      if (changes[key] !== updated[key]) {
        updated[key] = changes[key];
        changed = true;
      }
    }
  }
  if (changed) {
    return updated;
  } else {
    return geometry;
  }
};

const replacer = (from, to, limit = from.length) => {
  const map = new Map();
  for (let nth = 0; nth < limit; nth++) {
    map.set(from[nth], to[nth]);
  }
  const update = (geometry, descend) => {
    const cut = map.get(geometry);
    if (cut) {
      return cut;
    } else {
      return descend();
    }
  };
  return (geometry) => rewrite(geometry, update);
};

const validateContent = (geometry, content) => {
  if (content && content.some((value) => !value)) {
    for (const v of content) {
      console.log(`QQ/content: ${v}`);
    }
    throw Error(
      `Invalid content: ${JSON.stringify(geometry, (k, v) =>
        !v ? `<# ${v} #>` : v
      )} ${JSON.stringify(content, (k, v) => (!v ? `<# ${v} #>` : v))}`
    );
  }
  return content;
};

const rewrite = (geometry, op, state) => {
  const walk = (geometry, state) => {
    if (geometry.content) {
      return op(
        geometry,
        (changes, newState = state) =>
          update(
            geometry,
            {
              content: validateContent(
                geometry,
                geometry.content?.map?.((entry) => walk(entry, newState))
              ),
            },
            changes
          ),
        walk,
        state
      );
    } else {
      return op(geometry, (changes) => update(geometry, changes), walk, state);
    }
  };
  return walk(geometry, state);
};

const visit = (geometry, op, state) => {
  const walk = (geometry, state) => {
    if (geometry.content) {
      if (geometry.content.some((x) => x === undefined)) {
        throw Error(`Bad geometry: ${JSON.stringify(geometry)}`);
      }
      return op(
        geometry,
        (state) =>
          geometry.content?.forEach((geometry) => walk(geometry, state)),
        state
      );
    } else {
      return op(geometry, (state) => undefined, state);
    }
  };
  return walk(geometry, state);
};

const transform$1 = (matrix, geometry) => {
  const op = (geometry, descend, walk) =>
    descend({
      matrix: geometry.matrix
        ? composeTransforms(matrix, geometry.matrix)
        : matrix,
    });
  return rewrite(geometry, op);
};

const linearize = (
  geometry,
  filter,
  out = [],
  includeSketches = false
) => {
  const collect = (geometry, descend) => {
    if (filter(geometry)) {
      out.push(geometry);
    }
    if (includeSketches || geometry.type !== 'sketch') {
      descend();
    }
  };
  visit(geometry, collect);
  return out;
};

// import { asyncRewrite } from './visit.js';

// export const registry = new Map();

const reify = (geometry) => {
  // We'll return to an early reification model, avoiding re-entrance to the async user api.
  return geometry;
  /*
  if (!geometry) {
    console.log(`Reifying undefined geometry`);
  }
  if (geometry.type === 'plan' && geometry.content.length > 0) {
    return geometry;
  }
  const op = async (geometry, descend) => {
    switch (geometry.type) {
      case 'graph':
      case 'toolpath':
      case 'triangles':
      case 'points':
      case 'segments':
      case 'paths':
      case 'polygonsWithHoles':
        // No plan to realize.
        return geometry;
      case 'plan': {
        if (geometry.content.length === 0) {
          // This plan is not reified, generate content.
          const reifier = registry.get(geometry.plan.type);
          if (reifier === undefined) {
            throw Error(
              `Do not know how to reify plan: ${JSON.stringify(geometry.plan)}`
            );
          }
          const reified = await reifier(geometry);
          // We can't share the reification since things like tags applied to the plan need to propagate separately.
          return descend({ content: [reified] });
        }
        return geometry;
      }
      case 'displayGeometry':
        // CHECK: Should this taint the results if there is a plan?
        return geometry;
      case 'item':
      case 'group':
      case 'layout':
      case 'sketch':
      case 'transform':
        return descend();
      default:
        throw Error(`Unexpected geometry: ${JSON.stringify(geometry)}`);
    }
  };

  const result = await asyncRewrite(geometry, op);
  return result;
*/
};

const toConcreteGeometry = (geometry) => reify(geometry);

const filter$G = (geometry) => ['graph'].includes(geometry.type);

const approximate = (
  geometry,
  iterations,
  relaxationSteps,
  minimumErrorDrop,
  subdivisionRatio,
  relativeToChord,
  withDihedralAngle,
  optimizeAnchorLocation,
  pcaPlane,
  maxNumberOfProxies
) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter$G, inputs);
  const outputs = approximate$1(
    inputs,
    iterations,
    relaxationSteps,
    minimumErrorDrop,
    subdivisionRatio,
    relativeToChord,
    withDihedralAngle,
    optimizeAnchorLocation,
    pcaPlane,
    maxNumberOfProxies
  );
  deletePendingSurfaceMeshes();
  return replacer(inputs, outputs)(concreteGeometry);
};

const allTags = (geometry) => {
  const collectedTags = new Set();
  const op = ({ tags }, descend) => {
    if (tags !== undefined) {
      for (const tag of tags) {
        collectedTags.add(tag);
      }
    }
    descend();
  };
  visit(geometry, op);
  return collectedTags;
};

const rewriteType = (op) => (geometry) =>
  rewrite(geometry, (geometry, descend) => descend(op(geometry)));

const addType = (type) => (geometry) => {
  if (geometry.tags.includes(type)) {
    return undefined;
  } else {
    return { tags: [...geometry.tags, type] };
  }
};

const removeType = (type) => (geometry) => {
  if (geometry.tags.includes(type)) {
    return { tags: geometry.tags.filter((tag) => tag !== type) };
  } else {
    return undefined;
  }
};

const hasNotType = (type) => rewriteType(removeType(type));
const hasType = (type) => rewriteType(addType(type));
const isNotType =
  (type) =>
  ({ tags }) =>
    !tags.includes(type);
const isType =
  (type) =>
  ({ tags }) =>
    tags.includes(type);

const typeReference = 'type:reference';
const hasNotTypeReference = hasNotType(typeReference);
const hasTypeReference = hasType(typeReference);
const isNotTypeReference = isNotType(typeReference);
const isTypeReference = isType(typeReference);

const typeGhost = 'type:ghost';
const hasNotTypeGhost = hasNotType(typeGhost);
const hasTypeGhost = hasType(typeGhost);
const isNotTypeGhost = isNotType(typeGhost);
const isTypeGhost = isType(typeGhost);

const typeMasked = 'type:masked';
const hasNotTypeMasked = hasNotType(typeMasked);
const hasTypeMasked = hasType(typeMasked);
const isNotTypeMasked = isNotType(typeMasked);
const isTypeMasked = isType(typeMasked);

const typeVoid = 'type:void';
const hasNotTypeVoid = hasNotType(typeVoid);
const hasTypeVoid = hasType(typeVoid);
const isNotTypeVoid = isNotType(typeVoid);
const isTypeVoid = isType(typeVoid);

const taggedGroup = ({ tags = [], matrix, provenance }, ...content) => {
  if (content.some((value) => !value)) {
    throw Error(`Undefined Group content`);
  }
  if (content.some((value) => value.length)) {
    throw Error(`Group content is an array`);
  }
  if (content.some((value) => value.then)) {
    throw Error(`Group content is a promise`);
  }
  if (content.length === 1) {
    return content[0];
  }
  return { type: 'group', tags, matrix, content, provenance };
};

const filter$F = (geometry) =>
  ['graph', 'polygonsWithHoles', 'segments', 'points'].includes(
    geometry.type
  ) &&
  (isNotTypeGhost(geometry) || isTypeVoid(geometry));

const disjoint = (geometries, mode, exact) => {
  const concreteGeometries = geometries.map((geometry) =>
    toConcreteGeometry(geometry)
  );
  const inputs = [];
  for (const concreteGeometry of concreteGeometries) {
    linearize(concreteGeometry, filter$F, inputs);
  }
  // console.log(`QQ/disjoint/inputs: ${JSON.stringify(inputs)}`);
  const outputs = disjoint$1(inputs, mode, exact);
  const disjointGeometries = [];
  const update = replacer(inputs, outputs);
  for (const concreteGeometry of concreteGeometries) {
    disjointGeometries.push(update(concreteGeometry));
  }
  deletePendingSurfaceMeshes();
  return taggedGroup({}, ...disjointGeometries);
};

const assemble = (geometries, exact) =>
  disjoint(geometries, undefined, exact);

const filter$E = (geometry) => ['graph'].includes(geometry.type);

const bend = (geometry, radius) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter$E, inputs);
  const outputs = bend$1(inputs, radius);
  deletePendingSurfaceMeshes();
  return replacer(inputs, outputs)(concreteGeometry);
};

const filter$D = (geometry) =>
  geometry.type === 'graph' && !geometry.graph.serializedSurfaceMesh;

const serialize = (geometry) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter$D, inputs, /* includeSketches= */ true);
  if (inputs.length === 0) {
    return geometry;
  }
  serialize$1(inputs);
  deletePendingSurfaceMeshes();
  return geometry;
};

const hash = (geometry) => {
  if (geometry.hash === undefined) {
    if (geometry.content) {
      for (const content of geometry.content) {
        hash(content);
      }
    }
    serialize(geometry);
    geometry.hash = computeHash(geometry);
  }
  return geometry.hash;
};

const isStored = Symbol('isStored');

const store = async (geometry) => {
  if (geometry === undefined) {
    throw Error('Attempted to store undefined geometry');
  }
  const uuid = hash(geometry);
  if (geometry[isStored]) {
    return { type: 'link', hash: uuid };
  }
  const stored = { ...geometry, content: geometry.content?.slice() };
  geometry[isStored] = true;
  // Share graphs across geometries.
  const graph = geometry.graph;
  if (graph && !graph[isStored]) {
    if (graph.hash === undefined) {
      throw Error(`Graph has no hash`);
    }
    if (!graph.serializedSurfaceMesh && !graph.serializedOcctShape) {
      throw Error('Attempted to store graph without serialization');
    }
    await write$1(`graph/${graph.hash}`, graph);
    stored.graph = {
      hash: graph.hash,
      isClosed: graph.isClosed,
      isEmpty: graph.isEmpty,
      provenance: graph.provenance,
    };
  }
  if (geometry.content) {
    for (let nth = 0; nth < geometry.content.length; nth++) {
      if (!geometry.content[nth]) {
        throw Error('Store has empty content/1');
      }
      stored.content[nth] = await store(geometry.content[nth]);
      if (!stored.content[nth]) {
        throw Error('Store has empty content/2');
      }
    }
  }
  await write$1(`hash/${uuid}`, stored);
  return { type: 'link', hash: uuid };
};

const isLoaded = Symbol('isLoaded');

const load = async (geometry) => {
  if (geometry === undefined || geometry[isLoaded]) {
    return geometry;
  }
  if (!geometry.hash) {
    throw Error(`No hash`);
  }
  geometry = await read$1(`hash/${geometry.hash}`);
  if (!geometry) {
    return;
  }
  if (geometry[isLoaded]) {
    return geometry;
  }
  geometry[isLoaded] = true;
  geometry[isStored] = true;
  // Link to any associated graph structure.
  if (geometry.graph && geometry.graph.hash) {
    geometry.graph = await read$1(`graph/${geometry.graph.hash}`);
    if (
      !geometry.graph.serializedSurfaceMesh &&
      !geometry.graph.serializedOcctShape
    ) {
      throw Error('No serialized graph');
    }
  }
  if (geometry.content) {
    for (let nth = 0; nth < geometry.content.length; nth++) {
      if (!geometry.content[nth]) {
        throw Error('Load has empty content/1');
      }
      geometry.content[nth] = await load(geometry.content[nth]);
      if (!geometry.content[nth]) {
        throw Error('Load has empty content/2');
      }
    }
  }
  return geometry;
};

const loadNonblocking = (geometry) => {
  if (geometry === undefined || geometry[isLoaded]) {
    return geometry;
  }
  if (!geometry.hash) {
    return;
  }
  geometry = readNonblocking$1(`hash/${geometry.hash}`);
  if (!geometry) {
    return;
  }
  if (geometry[isLoaded]) {
    return geometry;
  }
  geometry[isStored] = true;
  // Link to any associated graph structure.
  if (geometry.graph && geometry.graph.hash) {
    geometry.graph = readNonblocking$1(`graph/${geometry.graph.hash}`);
    if (
      !geometry.graph.serializedSurfaceMesh &&
      !geometry.graph.serializedOcctShape
    ) {
      throw Error('No serialized graph');
    }
  }
  if (geometry.content) {
    for (let nth = 0; nth < geometry.content.length; nth++) {
      if (!geometry.content[nth]) {
        throw Error('Load has empty content/3');
      }
      geometry.content[nth] = loadNonblocking(geometry.content[nth]);
      if (!geometry.content[nth]) {
        throw Error('Load has empty content/4');
      }
    }
  }
  geometry[isLoaded] = true;
  return geometry;
};

const read = async (path, options) => {
  const readData = await read$1(path, options);
  if (!readData) {
    return;
  }
  return load(readData);
};

const readNonblocking = (path, options) => {
  const readData = readNonblocking$1(path, options);
  if (!readData) {
    return;
  }
  try {
    return loadNonblocking(readData);
  } catch (error) {
    if (error instanceof ErrorWouldBlock) {
      if (options && options.errorOnMissing === false) {
        return;
      }
    }
    throw error;
  }
};

const write = async (path, geometry, options) => {
  // Ensure that the geometry carries a hash before saving.
  hash(geometry);
  const stored = await store(geometry);
  await write$1(path, stored, options);
  return geometry;
};

// Generally addPending(write(...)) seems a better option.
const writeNonblocking = (path, geometry, options) => {
  addPending(write(path, geometry, options));
  return geometry;
};

const cached =
  (computeKey, op) =>
  (...args) => {
    let key;
    try {
      key = computeKey(...args);
    } catch (error) {
      console.log(JSON.stringify([...args]));
      throw error;
    }
    const hash = computeHash(key);
    const path = `op/${hash}`;
    const data = readNonblocking(path, { errorOnMissing: false });
    if (data !== undefined) {
      return data;
    }
    const result = op(...args);
    addPending(write(path, result));
    return result;
  };

const filter$C = (geometry) =>
  ['graph', 'polygonsWithHoles'].includes(geometry.type) &&
  isNotTypeGhost(geometry);

const filterReferences$1 = (geometry) =>
  ['graph', 'polygonsWithHoles', 'segments', 'points', 'empty'].includes(
    geometry.type
  );

const cast = (planeReference, sourceReference, geometry) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(toConcreteGeometry(planeReference), filterReferences$1, inputs);
  inputs.length = 1;
  linearize(toConcreteGeometry(sourceReference), filterReferences$1, inputs);
  inputs.length = 2;
  linearize(concreteGeometry, filter$C, inputs);
  const outputs = cast$1(inputs);
  deletePendingSurfaceMeshes();
  return taggedGroup({}, ...outputs);
};

const hasMatchingTag = (set, tags, whenSetUndefined = false) => {
  if (set === undefined) {
    return whenSetUndefined;
  } else if (tags !== undefined && tags.some((tag) => set.includes(tag))) {
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

const rewriteTags = (
  add,
  remove,
  geometry,
  conditionTags,
  conditionSpec
) => {
  const condition = buildCondition(conditionTags, conditionSpec);
  const composeTags = (geometryTags) => {
    if (condition === undefined || condition(geometryTags)) {
      if (geometryTags === undefined) {
        return add.filter((tag) => !remove.includes(tag));
      } else {
        return [...add, ...geometryTags].filter((tag) => !remove.includes(tag));
      }
    } else {
      return geometryTags;
    }
  };
  const op = (geometry, descend) => {
    switch (geometry.type) {
      case 'group':
        return descend();
      default:
        const composedTags = composeTags(geometry.tags);
        if (composedTags === undefined) {
          const copy = { ...geometry };
          delete copy.tags;
          return copy;
        }
        if (composedTags === geometry.tags) {
          return geometry;
        } else {
          return descend({ tags: composedTags });
        }
    }
  };
  return rewrite(geometry, op);
};

const hasMaterial = (geometry, name) =>
  rewriteTags(toTagsFromName(name), [], geometry);

const filter$B = (noVoid) => (geometry) =>
  ['graph', 'polygonsWithHoles', 'segments', 'points'].includes(
    geometry.type
  ) &&
  (isNotTypeGhost(geometry) || (!noVoid && isTypeVoid(geometry)));

const clip = (geometry, geometries, open, exact, noVoid, noGhost) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter$B(noVoid), inputs);
  const count = inputs.length;
  for (const geometry of geometries) {
    linearize(geometry, filter$B(noVoid), inputs);
  }
  const outputs = clip$1(inputs, count, open, exact);
  const ghosts = [];
  if (!noGhost) {
    for (let nth = 0; nth < inputs.length; nth++) {
      ghosts.push(hasMaterial(hasTypeGhost(inputs[nth]), 'ghost'));
    }
  }
  deletePendingSurfaceMeshes();
  return taggedGroup(
    {},
    replacer(inputs, outputs, count)(concreteGeometry),
    ...ghosts
  );
};

const filter$A = (geometry) =>
  ['graph', 'polygonsWithHoles'].includes(geometry.type) &&
  isNotTypeGhost(geometry);

const computeCentroid = (geometry, top, bottom) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter$A, inputs);
  const outputs = computeCentroid$1(inputs, top, bottom);
  deletePendingSurfaceMeshes();
  return replacer(inputs, outputs)(concreteGeometry);
};

const computeImplicitVolume = (
  op,
  radius,
  angularBound,
  radiusBound,
  distanceBound,
  errorBound
) => {
  const outputs = computeImplicitVolume$1(
    op,
    radius,
    angularBound,
    radiusBound,
    distanceBound,
    errorBound
  );
  deletePendingSurfaceMeshes();
  return taggedGroup({}, ...outputs);
};

const filter$z = (geometry) =>
  ['graph', 'polygonsWithHoles'].includes(geometry.type) &&
  isNotTypeGhost(geometry);

const computeNormal = (geometry, top, bottom) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter$z, inputs);
  const outputs = computeNormal$1(inputs, top, bottom);
  deletePendingSurfaceMeshes();
  return taggedGroup({}, ...outputs);
};

const filter$y = (geometry) =>
  isNotTypeGhost(geometry) &&
  ((geometry.type === 'graph' && !geometry.graph.isEmpty) ||
    ['polygonsWithHoles', 'segments', 'points'].includes(geometry.type));

const computeOrientedBoundingBox = (geometry) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter$y, inputs);
  const outputs = computeOrientedBoundingBox$1(inputs);
  deletePendingSurfaceMeshes();
  return outputs[0];
};

const filter$x = (geometry) =>
  ['graph'].includes(geometry.type) && isNotTypeGhost(geometry);

const computeToolpath = (
  geometry,
  material,
  selection,
  toolSpacing,
  toolSize,
  toolCutDepth
) => {
  const inputs = [];
  linearize(geometry, filter$x, inputs);
  const materialStart = inputs.length;
  linearize(material, filter$x, inputs);
  const selectionStart = inputs.length;
  linearize(selection, filter$x, inputs);
  const outputs = computeToolpath$1(
    inputs,
    materialStart,
    selectionStart,
    inputs.length,
    toolSpacing,
    toolSize,
    toolCutDepth
  );
  deletePendingSurfaceMeshes();
  return taggedGroup({}, ...outputs);
};

const filter$w = (geometry) =>
  ['graph', 'polygonsWithHoles', 'segments', 'points'].includes(geometry.type);

const convexHull = (geometries) => {
  const inputs = [];
  for (const geometry of geometries) {
    linearize(toConcreteGeometry(geometry), filter$w, inputs);
  }
  const outputs = convexHull$1(inputs);
  deletePendingSurfaceMeshes();
  return taggedGroup({}, ...outputs);
};

const filter$v = () => (geometry) =>
  ['polygonsWithHoles'].includes(geometry.type);

const convertPolygonsToMeshes = (geometry) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter$v(), inputs);
  if (inputs.length === 0) {
    return geometry;
  }
  try {
    const outputs = convertPolygonsToMeshes$1(inputs);
    deletePendingSurfaceMeshes();
    return replacer(inputs, outputs)(concreteGeometry);
  } catch (e) {
    console.log(e.stack);
    throw e;
  }
};

const filterTargets$2 = (noVoid) => (geometry) =>
  ['graph', 'polygonsWithHoles', 'segments', 'points'].includes(
    geometry.type
  ) &&
  (isNotTypeGhost(geometry) || (!noVoid && isTypeVoid(geometry)));

const filterRemoves = (noVoid) => (geometry) =>
  filterTargets$2(noVoid)(geometry) && isNotTypeMasked(geometry);

const cut = (
  geometry,
  geometries,
  open = false,
  exact,
  noVoid,
  noGhost
) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filterTargets$2(noVoid), inputs);
  const count = inputs.length;
  for (const geometry of geometries) {
    linearize(geometry, filterRemoves(noVoid), inputs);
  }
  const outputs = cut$1(inputs, count, open, exact);
  const ghosts = [];
  if (!noGhost) {
    for (let nth = count; nth < inputs.length; nth++) {
      ghosts.push(hasMaterial(hasTypeGhost(inputs[nth]), 'ghost'));
    }
  }
  deletePendingSurfaceMeshes();
  return taggedGroup(
    {},
    replacer(inputs, outputs, count)(concreteGeometry),
    ...ghosts
  );
};

const filterShape = (geometry) =>
  ['graph', 'polygonsWithHoles'].includes(geometry.type) &&
  isNotTypeGhost(geometry);

const filterSelection = (geometry) =>
  ['graph', 'polygonsWithHoles', 'points', 'segments'].includes(
    geometry.type
  ) && isNotTypeGhost(geometry);

const deform = (geometry, selections, iterations, tolerance, alpha) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filterShape, inputs);
  const length = inputs.length;
  for (const selection of selections) {
    linearize(toConcreteGeometry(selection), filterSelection, inputs);
  }
  const outputs = deform$1(inputs, length, iterations, tolerance, alpha);
  deletePendingSurfaceMeshes();
  return replacer(inputs, outputs, length)(concreteGeometry);
};

const filter$u = (geometry) => ['graph'].includes(geometry.type);

const demesh = (geometry) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter$u, inputs);
  const outputs = demesh$1(inputs);
  deletePendingSurfaceMeshes();
  return replacer(inputs, outputs)(concreteGeometry);
};

const filter$t = (geometry, parent) =>
  ['graph'].includes(geometry.type) && isNotTypeGhost(geometry);

const dilateXY = (geometry, amount) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter$t, inputs);
  const outputs = dilateXY$1(inputs, amount);
  const ghosts = [];
  for (let nth = 0; nth < inputs.length; nth++) {
    ghosts.push(hasMaterial(hasTypeGhost(inputs[nth]), 'ghost'));
  }
  deletePendingSurfaceMeshes();
  return taggedGroup(
    {},
    replacer(inputs, outputs)(concreteGeometry),
    ...ghosts
  );
};

const taggedSegments = (
  { tags = [], matrix, provenance, orientation },
  segments
) => {
  return { type: 'segments', tags, matrix, provenance, segments, orientation };
};

const transform = ([x = 0, y = 0, z = 0], matrix) => {
  if (!matrix) {
    return [x, y, z];
  }
  let w = matrix[3] * x + matrix[7] * y + matrix[11] * z + matrix[15] || 1.0;
  return [
    (matrix[0] * x + matrix[4] * y + matrix[8] * z + matrix[12]) / w,
    (matrix[1] * x + matrix[5] * y + matrix[9] * z + matrix[13]) / w,
    (matrix[2] * x + matrix[6] * y + matrix[10] * z + matrix[14]) / w,
  ];
};

const transformCoordinate = (coordinate, matrix) =>
  transform(coordinate, matrix);

const transformingCoordinates =
  (matrix, op) =>
  (coordinate, ...args) =>
    op(transformCoordinate(coordinate, matrix), ...args);

const SOURCE = 0;
const TARGET = 1;

const subtract = ([ax, ay, az], [bx, by, bz]) => [
  ax - bx,
  ay - by,
  az - bz,
];

const disorientSegment = (segment, matrix, normal) => {
  const absoluteSegment = [
    transformCoordinate(segment[SOURCE], matrix),
    transformCoordinate(segment[TARGET], matrix),
  ];
  const absoluteOppositeSegment = [
    transformCoordinate(segment[TARGET], matrix),
    transformCoordinate(segment[SOURCE], matrix),
  ];
  const absoluteNormal = normal
    ? subtract(transformCoordinate(normal, matrix), absoluteSegment[SOURCE])
    : [0, 0, 1];
  const inverse = fromSegmentToInverseTransform(
    absoluteSegment,
    absoluteNormal
  );
  const oppositeInverse = fromSegmentToInverseTransform(
    absoluteOppositeSegment,
    absoluteNormal
  );
  const baseSegment = [
    transformCoordinate(absoluteSegment[SOURCE], inverse),
    transformCoordinate(absoluteSegment[TARGET], inverse),
  ];
  const oppositeSegment = [
    transformCoordinate(absoluteSegment[TARGET], oppositeInverse),
    transformCoordinate(absoluteSegment[SOURCE], oppositeInverse),
  ];
  const inverseMatrix = invertTransform(inverse);
  const oppositeInverseMatrix = invertTransform(oppositeInverse);

  return [
    taggedSegments({ matrix: inverseMatrix }, [baseSegment]),
    taggedSegments({ matrix: oppositeInverseMatrix }, [oppositeSegment]),
  ];
};

// Dropped elements displace as usual, but are not included in positive output.

const drop = (tags, geometry) =>
  rewriteTags(['type:void'], [], geometry, tags, 'has');

const filter$s = (geometry) =>
  ['graph', 'polygonsWithHoles'].includes(geometry.type) &&
  isNotTypeGhost(geometry);

const eachFaceEdges = (geometry, selections, emitFaceEdges) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter$s, inputs);
  const count = inputs.length;
  for (const selection of selections) {
    linearize(toConcreteGeometry(selection), filter$s, inputs);
  }
  const outputs = faceEdges(inputs, count).filter(({ type }) =>
    ['polygonsWithHoles', 'segments'].includes(type)
  );
  for (let nth = 0; nth < outputs.length; nth += 2) {
    const face = outputs[nth + 0];
    const edges = outputs[nth + 1];
    emitFaceEdges(face, edges);
  }
  deletePendingSurfaceMeshes();
};

const eachItem = (geometry, op) => {
  const walk = (geometry, descend) => {
    switch (geometry.type) {
      case 'sketch': {
        // Sketches aren't real.
        return;
      }
      default: {
        op(geometry);
        return descend();
      }
    }
  };
  visit(geometry, walk);
};

const filter$r = (geometry) =>
  ['graph', 'polygonsWithHoles', 'segments', 'points'].includes(
    geometry.type
  ) && isNotTypeGhost(geometry);

const eachPoint = (geometry, emit) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter$r, inputs);
  eachPoint$1(inputs, emit);
  deletePendingSurfaceMeshes();
};

const filter$q = (geometry) =>
  ['graph', 'polygonsWithHoles'].includes(geometry.type) &&
  isNotTypeGhost(geometry);

const outline = (geometry, selections) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter$q, inputs);
  const count = inputs.length;
  for (const selection of selections) {
    linearize(toConcreteGeometry(selection), filter$q, inputs);
  }
  const outputs = outline$1(inputs, count);
  deletePendingSurfaceMeshes();
  return replacer(inputs, outputs)(concreteGeometry);
};

const filter$p = ({ type }) => type === 'segments';

const eachSegment = (geometry, emit, selections = []) => {
  for (const { matrix, segments, normals, faces } of linearize(
    outline(geometry, selections),
    filter$p
  )) {
    for (let nth = 0; nth < segments.length; nth++) {
      const [source, target] = segments[nth];
      const normal = normals
        ? transformCoordinate(normals[nth], matrix)
        : undefined;
      const face = faces ? faces[nth] : undefined;
      emit(
        [
          transformCoordinate(source, matrix),
          transformCoordinate(target, matrix),
        ],
        normal,
        face
      );
    }
  }
};

const filterTargets$1 = (geometry) =>
  ['graph'].includes(geometry.type) && isNotTypeGhost(geometry);

const eachTriangle = (geometry, emitTriangle) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filterTargets$1, inputs);
  eachTriangle$1(inputs, emitTriangle);
  deletePendingSurfaceMeshes();
};

const filterTargets = (noVoid) => (geometry) =>
  ['graph', 'polygonsWithHoles', 'segments', 'points'].includes(geometry.type);

// CHECK: We should pass in reference geometry rather than a matrix.
const eagerTransform = (matrix, geometry, noVoid) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filterTargets(), inputs);
  const count = inputs.length;
  inputs.push(hasTypeReference(taggedGroup({ matrix })));
  const outputs = eagerTransform$1(inputs);
  deletePendingSurfaceMeshes();
  return replacer(inputs, outputs, count)(concreteGeometry);
};

const filter$o = (noVoid) => (geometry) =>
  ['graph', 'polygonsWithHoles'].includes(geometry.type) &&
  (isNotTypeGhost(geometry) || (!noVoid && isTypeVoid));

const extrude = (geometry, top, bottom, noVoid) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter$o(noVoid), inputs);
  const count = inputs.length;
  inputs.push(top, bottom);
  const outputs = extrude$1(inputs, count, noVoid);
  deletePendingSurfaceMeshes();
  return replacer(inputs, outputs)(concreteGeometry);
};

const filter$n = (geometry) =>
  ['graph'].includes(geometry.type) && isNotTypeGhost(geometry);

const fix = (geometry, selfIntersection = true) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter$n, inputs);
  const outputs = fix$1(inputs, selfIntersection);
  deletePendingSurfaceMeshes();
  return replacer(inputs, outputs)(concreteGeometry);
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

const fromPolygons = (
  polygons,
  { tags = [], close = false, tolerance = 0.001 } = {}
) => {
  const outputs = fromPolygons$1(polygons, close, tolerance);
  deletePendingSurfaceMeshes();
  return taggedGroup({}, ...outputs.map((output) => ({ ...output, tags })));
};

const fromPolygonSoup = (
  polygons,
  { tags = [], close = false, tolerance = 0.001 } = {}
) => {
  const outputs = fromPolygonSoup$1(polygons, close, tolerance);
  deletePendingSurfaceMeshes();
  return taggedGroup({}, ...outputs.map((output) => ({ ...output, tags })));
};

const filter$m = (geometry) =>
  ['graph', 'polygonsWithHoles', 'segments'].includes(geometry.type) &&
  isNotTypeGhost(geometry);

const fuse = (geometry, exact = false) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter$m, inputs);
  const outputs = fuse$1(inputs, exact);
  deletePendingSurfaceMeshes();
  return taggedGroup({}, ...outputs);
};

const filter$l = (geometry) =>
  ['graph'].includes(geometry.type) && isNotTypeGhost(geometry);

const generateLowerEnvelope = (geometry) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter$l, inputs);
  const outputs = generateEnvelope(inputs, /* envelopeType= */ 1);
  deletePendingSurfaceMeshes();
  return replacer(inputs, outputs)(concreteGeometry);
};

const filter$k = (geometry) =>
  ['graph'].includes(geometry.type) && isNotTypeGhost(geometry);

const generateUpperEnvelope = (geometry) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter$k, inputs);
  const outputs = generateEnvelope(inputs, /* envelopeType= */ 0);
  deletePendingSurfaceMeshes();
  return replacer(inputs, outputs)(concreteGeometry);
};

const getAnySurfaces = (geometry) => {
  const surfaces = [];
  eachItem(geometry, (item) => {
    switch (item.type) {
      case 'surface':
      case 'z0Surface':
        surfaces.push(item);
    }
  });
  return surfaces;
};

const getItems = (geometry) => {
  const items = [];
  const op = (geometry, descend) => {
    switch (geometry.type) {
      case 'item':
        return items.push(geometry);
      case 'sketch':
        // We don't look inside sketches.
        return;
      default:
        return descend();
    }
  };
  visit(geometry, op);
  return items;
};

const getInverseMatrices = (geometry) => {
  geometry = toConcreteGeometry(geometry);
  switch (geometry.type) {
    case 'plan': {
      if (geometry.content.length === 1) {
        return getInverseMatrices(geometry.content[0]);
      }
    }
    // fallthrough
    default: {
      return {
        global: geometry.matrix,
        local: invertTransform(geometry.matrix),
      };
    }
  }
};

const getLayouts = (geometry) => {
  const layouts = [];
  eachItem(geometry, (item) => {
    if (item.type === 'layout') {
      layouts.push(item);
    }
  });
  return layouts;
};

// Retrieve leaf geometry.

const getLeafs = (geometry) => {
  const leafs = [];
  const op = (geometry, descend) => {
    switch (geometry.type) {
      case 'group':
      case 'layout':
        return descend();
      default:
        return leafs.push(geometry);
    }
  };
  visit(geometry, op);
  return leafs;
};

// Retrieve leaf geometry.

const getLeafsIn = (geometry) => {
  const leafs = [];
  const op = (geometry, descend) => {
    switch (geometry.type) {
      case 'group':
      case 'layout':
      case 'item':
        return descend();
      default:
        return leafs.push(geometry);
    }
  };
  visit(geometry, op);
  return leafs;
};

const getGraphs = (geometry) => {
  const graphs = [];
  eachItem(geometry, (item) => {
    if (item.type === 'graph') {
      graphs.push(item);
    }
  });
  return graphs;
};

const getPlans = (geometry) => {
  const plans = [];
  eachItem(geometry, (item) => {
    if (item.type === 'plan') {
      plans.push(item);
    }
  });
  return plans;
};

const getPoints = (geometry) => {
  const pointsets = [];
  eachItem(geometry, (item) => {
    if (item.type === 'points') {
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

const filter$j = (geometry, parent) =>
  ['graph'].includes(geometry.type) && isNotTypeGhost(geometry);

const grow = (geometry, offset, selections, options) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter$j, inputs);
  const count = inputs.length;
  inputs.push(offset);
  for (const selection of selections) {
    linearize(toConcreteGeometry(selection), filter$j, inputs);
  }
  const outputs = grow$1(inputs, count, options);
  const ghosts = [];
  for (let nth = count; nth < inputs.length; nth++) {
    ghosts.push(hasMaterial(hasTypeGhost(inputs[nth]), 'ghost'));
  }
  deletePendingSurfaceMeshes();
  return taggedGroup(
    {},
    replacer(inputs, outputs)(concreteGeometry),
    ...ghosts
  );
};

const filter$i = (geometry) =>
  ['graph', 'polygonsWithHoles'].includes(geometry.type);

const involute = (geometry) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter$i, inputs);
  const outputs = involute$1(inputs);
  deletePendingSurfaceMeshes();
  return replacer(inputs, outputs)(concreteGeometry);
};

const filter$h = (geometry) =>
  ['graph', 'polygonsWithHoles', 'segments'].includes(geometry.type) &&
  isNotTypeGhost(geometry);

const fill = (geometry, tags = []) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter$h, inputs);
  const outputs = fill$1(inputs);
  deletePendingSurfaceMeshes();
  return taggedGroup({}, ...outputs.map((output) => ({ ...output, tags })));
};

const filter$g = (geometry) =>
  ['graph', 'polygonsWithHoles'].includes(geometry.type) &&
  isNotTypeGhost(geometry);

const inset = (geometry, ...args) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter$g, inputs);
  const outputs = inset$1(inputs, ...args);
  // Put the inner insets first.
  deletePendingSurfaceMeshes();
  return taggedGroup({}, ...outputs);
};

const hasNotShow = (geometry, show) =>
  isNotShow(geometry, show)
    ? geometry
    : { ...geometry, tags: geometry.tags.filter((tag) => tag !== show) };
const hasShow = (geometry, show) =>
  isShow(geometry, show)
    ? geometry
    : { ...geometry, tags: [...geometry.tags, show] };
const isNotShow = ({ tags }, show) => !tags.includes(show);
const isShow = ({ tags }, show) => tags.includes(show);

const showOutline = 'show:outline';
const hasNotShowOutline = (geometry) =>
  hasNotShow(geometry, showOutline);
const hasShowOutline = (geometry) => hasShow(geometry, showOutline);
const isNotShowOutline = (geometry) => isNotShow(geometry, showOutline);
const isShowOutline = (geometry) => isShow(geometry, showOutline);

const showOverlay = 'show:overlay';
const hasNotShowOverlay = (geometry) =>
  hasNotShow(geometry, showOutline);
const hasShowOverlay = (geometry) => hasShow(geometry, showOverlay);
const isNotShowOverlay = (geometry) => isNotShow(geometry, showOverlay);
const isShowOverlay = (geometry) => isShow(geometry, showOverlay);

const showSkin = 'show:skin';
const hasNotShowSkin = (geometry) => hasNotShow(geometry, showSkin);
const hasShowSkin = (geometry) => hasShow(geometry, showSkin);
const isNotShowSkin = (geometry) => isNotShow(geometry, showSkin);
const isShowSkin = (geometry) => isShow(geometry, showSkin);

const showWireframe = 'show:wireframe';
const hasNotShowWireframe = (geometry) =>
  hasNotShow(geometry, showWireframe);
const hasShowWireframe = (geometry) => hasShow(geometry, showWireframe);
const isNotShowWireframe = (geometry) =>
  isNotShow(geometry, showWireframe);
const isShowWireframe = (geometry) => isShow(geometry, showWireframe);

const filter$f = (noVoid) => (geometry) =>
  ['graph', 'polygonsWithHoles', 'segments'].includes(geometry.type) &&
  isNotTypeGhost(geometry);

const filterAdds = (noVoid) => (geometry) =>
  filter$f() && isNotTypeGhost(geometry);

const join = (geometry, geometries, exact, noVoid) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter$f(), inputs);
  const count = inputs.length;
  for (const geometry of geometries) {
    linearize(geometry, filterAdds(), inputs);
  }
  const outputs = join$1(inputs, count, exact);
  deletePendingSurfaceMeshes();
  return replacer(inputs, outputs, count)(concreteGeometry);
};

const keep = (tags, geometry) =>
  rewriteTags(['type:void'], [], geometry, tags, 'has not');

const filter$e = (geometry) =>
  ['points', 'segments'].includes(geometry.type) && isNotTypeGhost(geometry);

const link = (geometries, close = false, reverse = false) => {
  const inputs = [];
  for (const geometry of geometries) {
    linearize(toConcreteGeometry(geometry), filter$e, inputs);
  }
  const outputs = link$1(inputs, close, reverse);
  return taggedGroup({}, ...outputs);
};

const filter$d = (geometry) =>
  ['graph', 'polygonsWithHoles'].includes(geometry.type) &&
  isNotTypeGhost(geometry);

const loft = (geometries, close = true) => {
  const inputs = [];
  // This is wrong -- we produce a total linearization over geometries,
  // but really it should be partitioned.
  for (const geometry of geometries) {
    linearize(toConcreteGeometry(geometry), filter$d, inputs);
  }
  const outputs = loft$1(inputs, close);
  deletePendingSurfaceMeshes();
  return taggedGroup({}, ...outputs);
};

const filter$c = (geometry) =>
  ['graph', 'polygonsWithHoles', 'segments', 'points'].includes(
    geometry.type
  ) && isNotTypeGhost(geometry);

const makeAbsolute = (geometry, tags = []) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter$c, inputs);
  const outputs = makeAbsolute$1(inputs);
  deletePendingSurfaceMeshes();
  return replacer(inputs, outputs)(concreteGeometry);
};

const filter$b = (geometry) =>
  ['graph', 'polygonsWithHoles'].includes(geometry.type) &&
  hasNotTypeVoid(geometry);

const measureArea = (geometry) => {
  const linear = [];
  linearize(geometry, filter$b, linear);
  return computeArea(linear);
};

const filter$a = (geometry) =>
  isNotTypeGhost(geometry) &&
  ((geometry.type === 'graph' && !geometry.graph.isEmpty) ||
    ['polygonsWithHoles', 'segments', 'points'].includes(geometry.type));

const measureBoundingBox = (geometry) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter$a, inputs);
  const boundingBox = computeBoundingBox(inputs);
  deletePendingSurfaceMeshes();
  return boundingBox;
};

const filter$9 = (geometry) =>
  geometry.type === 'graph' && hasNotTypeVoid(geometry);

const measureVolume = (geometry) => {
  const linear = [];
  linearize(geometry, filter$9, linear);
  return computeVolume(linear);
};

const removeIfGhost = (geometry) =>
  isTypeGhost(geometry) && !isTypeVoid(geometry) ? taggedGroup({}) : geometry;

const noGhost = (geometry) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = linearize(concreteGeometry, isTypeGhost);
  const outputs = inputs.map(removeIfGhost);
  return replacer(inputs, outputs)(concreteGeometry);
};

const filter$8 = (geometry) =>
  ['graph', 'polygonsWithHoles'].includes(geometry.type) &&
  isNotTypeGhost(geometry);

const offset = (geometry, ...args) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter$8, inputs);
  const outputs = offset$1(inputs, ...args);
  deletePendingSurfaceMeshes();
  return taggedGroup({}, ...outputs);
};

const doNothing = (geometry) => geometry;

const op =
  (
    {
      graph = doNothing,
      layout = doNothing,
      paths = doNothing,
      points = doNothing,
      polygonsWithHoles = doNothing,
      segments = doNothing,
      toolpath = doNothing,
      triangles = doNothing,
    },
    method = rewrite,
    accumulate = (x) => x
  ) =>
  (geometry, ...args) => {
    const walk = (geometry, descend) => {
      switch (geometry.type) {
        case 'graph':
          return accumulate(graph(geometry, ...args));
        case 'paths':
          return accumulate(paths(geometry, ...args));
        case 'points':
          return accumulate(points(geometry, ...args));
        case 'polygonsWithHoles':
          return accumulate(polygonsWithHoles(geometry, ...args));
        case 'segments':
          return accumulate(segments(geometry, ...args));
        case 'toolpath':
          return accumulate(toolpath(geometry, ...args));
        case 'triangles':
          return accumulate(triangles(geometry, ...args));
        case 'plan':
        // fall through
        case 'layout':
        // return accumulate(layout(geometry, ...args));
        // fall through
        case 'item':
        case 'group': {
          return descend();
        }
        case 'sketch': {
          // Sketches aren't real for op.
          return geometry;
        }
        default:
          throw Error(`Unexpected geometry: ${JSON.stringify(geometry)}`);
      }
    };

    return method(toConcreteGeometry(geometry), walk);
  };

const filter$7 = (geometry) => ['graph'].includes(geometry.type);

const remesh = (
  geometry,
  selections,
  iterations,
  relaxationSteps,
  targetEdgeLength,
  exact
) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter$7, inputs);
  const count = inputs.length;
  for (const selection of selections) {
    linearize(toConcreteGeometry(selection), filter$7, inputs);
  }
  const outputs = remesh$1(
    inputs,
    count,
    iterations,
    relaxationSteps,
    targetEdgeLength,
    exact
  );
  deletePendingSurfaceMeshes();
  return replacer(inputs, outputs)(concreteGeometry);
};

const filter$6 = (geometry, parent) =>
  ['graph'].includes(geometry.type) && isNotTypeGhost(geometry);

const seam = (geometry, selections) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter$6, inputs);
  const count = inputs.length;
  for (const selection of selections) {
    linearize(toConcreteGeometry(selection), filter$6, inputs);
  }
  const outputs = seam$1(inputs, count);
  deletePendingSurfaceMeshes();
  return replacer(inputs, outputs)(concreteGeometry);
};

const filterInputs$1 = (geometry) =>
  ['graph', 'polygonsWithHoles', 'segments', 'points'].includes(
    geometry.type
  ) && isNotTypeGhost(geometry);

const filterReferences = (geometry) =>
  ['graph', 'polygonsWithHoles', 'segments', 'points', 'empty'].includes(
    geometry.type
  );

const section = (inputGeometry, referenceGeometries) => {
  const concreteGeometry = toConcreteGeometry(inputGeometry);
  const inputs = [];
  linearize(concreteGeometry, filterInputs$1, inputs);
  const count = inputs.length;
  for (const referenceGeometry of referenceGeometries) {
    linearize(referenceGeometry, filterReferences, inputs);
  }
  const outputs = section$1(inputs, count);
  const ghosts = [];
  for (let nth = 0; nth < count; nth++) {
    ghosts.push(hasMaterial(hasTypeGhost(inputs[nth]), 'ghost'));
  }
  deletePendingSurfaceMeshes();
  return taggedGroup({}, ...outputs, ...ghosts);
};

const filter$5 = (geometry, parent) =>
  ['graph'].includes(geometry.type) && isNotTypeGhost(geometry);

const shell = (
  geometry,
  innerOffset = 0,
  outerOffset = 0,
  protect = false
) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter$5, inputs);
  const outputs = shell$1(
    inputs,
    innerOffset,
    outerOffset,
    (protect = false)
  );
  const ghosts = [];
  for (let nth = 0; nth < inputs.length; nth++) {
    ghosts.push(hasMaterial(hasTypeGhost(inputs[nth]), 'ghost'));
  }
  deletePendingSurfaceMeshes();
  return taggedGroup(
    {},
    replacer(inputs, outputs)(concreteGeometry),
    ...ghosts
  );
};

const filter$4 = (geometry) => ['graph'].includes(geometry.type);

const simplify = (geometry, ratio, eps) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter$4, inputs);
  const outputs = simplify$1(inputs, ratio, eps);
  deletePendingSurfaceMeshes();
  return replacer(inputs, outputs)(concreteGeometry);
};

const filter$3 = (geometry) =>
  ['graph'].includes(geometry.type) && isNotTypeGhost(geometry);

const smooth = (
  geometry,
  selections,
  resolution,
  iterations,
  time,
  remeshIterations,
  remeshRelaxationSteps
) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter$3, inputs);
  const count = inputs.length;
  for (const selection of selections) {
    linearize(toConcreteGeometry(selection), filter$3, inputs);
  }
  const outputs = smooth$1(
    inputs,
    count,
    resolution,
    iterations,
    time,
    remeshIterations,
    remeshRelaxationSteps
  );
  const ghosts = [];
  for (let nth = count; nth < inputs.length; nth++) {
    ghosts.push(hasMaterial(hasTypeGhost(inputs[nth]), 'ghost'));
  }
  deletePendingSurfaceMeshes();
  return taggedGroup(
    {},
    replacer(inputs, outputs, count)(concreteGeometry),
    ...ghosts
  );
};

const filter$2 = (geometry) =>
  ['graph', 'polygonsWithHoles'].includes(geometry.type) &&
  isNotTypeGhost(geometry);

const separate = (
  geometry,
  keepShapes = true,
  keepHolesInShapes = true,
  keepHolesAsShapes = false
) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter$2, inputs);
  const outputs = separate$1(
    inputs,
    keepShapes,
    keepHolesInShapes,
    keepHolesAsShapes
  );
  deletePendingSurfaceMeshes();
  return taggedGroup({}, ...outputs);
};

const soup = (geometry) => {
  const op = (geometry, descend) => {
    switch (geometry.type) {
      case 'graph': {
        const { graph } = geometry;
        if (graph.isEmpty) {
          return taggedGroup({});
        } else {
          return geometry;
        }
      }
      // Unreachable.
      case 'polygonsWithHoles':
        return geometry;
      case 'segments':
      case 'triangles':
      case 'points':
      case 'paths':
        // Already soupy enough.
        return geometry;
      case 'toolpath':
        // Drop toolpaths for now.
        return taggedGroup({});
      case 'displayGeometry':
        // soup can handle displayGeometry.
        return descend();
      case 'layout':
      case 'plan':
      case 'item':
      case 'sketch':
      case 'group': {
        return descend();
      }
      default:
        throw Error(`Unexpected geometry: ${JSON.stringify(geometry)}`);
    }
  };

  return rewrite(
    serialize(convertPolygonsToMeshes(toConcreteGeometry(geometry))),
    op
  );
};

const taggedItem = ({ tags = [], matrix, provenance }, ...content) => {
  if (tags !== undefined && tags.length === undefined) {
    throw Error(`Bad tags: ${tags}`);
  }
  if (content.some((value) => value === undefined)) {
    throw Error(`Undefined Item content`);
  }
  if (content.length !== 1) {
    throw Error(`Item expects a single content geometry`);
  }
  return { type: 'item', tags, matrix, provenance, content };
};

const taggedDisplayGeometry = (
  { tags = [], matrix, provenance },
  ...content
) => {
  if (content.some((value) => value === undefined)) {
    throw Error(`Undefined DisplayGeometry content`);
  }
  if (content.length !== 1) {
    throw Error(`DisplayGeometry expects a single content geometry`);
  }
  return { type: 'displayGeometry', tags, matrix, provenance, content };
};

const taggedGraph = ({ tags = [], matrix, provenance }, graph) => {
  if (graph.length > 0) {
    throw Error('Graph should not be an array');
  }
  if (graph.graph) {
    throw Error('malformed graph');
  }
  return {
    type: 'graph',
    tags,
    graph,
    matrix,
    provenance,
  };
};

const taggedLayout = (
  { tags = [], matrix, provenance, size, margin, title },
  ...content
) => {
  if (content.some((value) => value === undefined)) {
    throw Error(`Undefined Layout content`);
  }
  if (content.some((value) => value.length)) {
    throw Error(`Layout content is an array`);
  }
  if (content.some((value) => value.then)) {
    throw Error(`Layout content is a promise`);
  }
  if (content.some((value) => value.geometry)) {
    throw Error(`Likely Shape in Layout`);
  }
  return {
    type: 'layout',
    layout: { size, margin, title },
    tags,
    matrix,
    provenance,
    content,
  };
};

const taggedPlan = ({ tags = [], matrix, provenance }, plan) => ({
  type: 'plan',
  tags,
  matrix,
  provenance,
  plan,
  content: [],
});

const taggedPoints = (
  { tags = [], matrix, provenance },
  points,
  exactPoints
) => {
  return { type: 'points', tags, matrix, provenance, points, exactPoints };
};

const taggedPolygons = ({ tags = [], matrix, provenance }, polygons) => {
  return { type: 'polygons', tags, matrix, provenance, polygons };
};

const taggedPolygonsWithHoles = (
  { tags = [], matrix, provenance },
  polygonsWithHoles
) => {
  return {
    type: 'polygonsWithHoles',
    tags,
    matrix,
    provenance,
    plane: [0, 0, 1, 0],
    polygonsWithHoles,
  };
};

const taggedSketch = ({ tags = [], matrix, provenance }, ...content) => {
  if (content.some((value) => value === undefined)) {
    throw Error(`Undefined Sketch content`);
  }
  if (content.length !== 1) {
    throw Error(`Sketch expects a single content geometry`);
  }
  return { type: 'sketch', tags, matrix, provenance, content };
};

const taggedTriangles = (
  { tags = [], matrix, provenance },
  triangles
) => {
  return { type: 'triangles', tags, matrix, provenance, triangles };
};

const toDisplayGeometry = (
  geometry,
  { triangles, outline = true, skin, wireframe = false } = {}
) => {
  if (!geometry) {
    throw Error('die');
  }
  if (skin === undefined) {
    skin = triangles;
  }
  if (skin === undefined) {
    skin = true;
  }
  return soup(toConcreteGeometry(geometry));
};

const toTransformedGeometry = (geometry) => geometry;

const toPoints = (geometry) => {
  const points = [];
  eachPoint(geometry, (point) => points.push(point));
  return taggedPoints({}, points);
};

Error.stackTraceLimit = Infinity;

const toTriangles = ({ tags }, geometry) => {
  geometry.cache = geometry.cache || {};
  if (!geometry.cache.triangles) {
    const { matrix } = geometry;
    const triangles = [];
    eachTriangle(geometry, (triangle) => triangles.push(triangle));
    const trianglesGeometry = taggedTriangles({ tags, matrix }, triangles);
    geometry.cache.triangles = trianglesGeometry;
  }
  return geometry.cache.triangles;
};

const toTriangleArray = (geometry) => {
  const triangles = [];
  const op = (geometry, descend) => {
    if (isTypeGhost(geometry)) {
      return;
    }
    const { matrix = identity(), tags, type } = geometry;
    const transformTriangles = (triangles) =>
      triangles.map((triangle) =>
        triangle.map((point) => transformCoordinate(point, matrix))
      );
    switch (type) {
      case 'graph': {
        triangles.push(
          ...transformTriangles(
            toTriangles({ tags }, geometry).triangles
          )
        );
        break;
      }
      case 'triangles': {
        triangles.push(...transformTriangles(geometry.triangles));
        break;
      }
      case 'polygonsWithHoles':
      case 'points':
      case 'paths':
      case 'segments':
        break;
      case 'layout':
      case 'plan':
      case 'item':
      case 'sketch':
      case 'group': {
        return descend();
      }
      default:
        throw Error(`Unexpected geometry: ${JSON.stringify(geometry)}`);
    }
  };

  visit(toConcreteGeometry(geometry), op);

  return triangles;
};

const filter$1 = (geometry) => ['graph'].includes(geometry.type);

const twist = (geometry, radius) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter$1, inputs);
  const outputs = twist$1(inputs, radius);
  deletePendingSurfaceMeshes();
  return replacer(inputs, outputs)(concreteGeometry);
};

const filterInputs = (geometry) =>
  ['graph'].includes(geometry.type) && isNotTypeGhost(geometry);

const unfold = (inputGeometry) => {
  const concreteGeometry = toConcreteGeometry(inputGeometry);
  const inputs = [];
  linearize(concreteGeometry, filterInputs, inputs);
  const count = inputs.length;
  const outputs = unfold$1(inputs);
  const ghosts = [];
  for (let nth = 0; nth < count; nth++) {
    ghosts.push(hasMaterial(hasTypeGhost(inputs[nth]), 'ghost'));
  }
  deletePendingSurfaceMeshes();
  return taggedGroup({}, ...outputs, ...ghosts);
};

const filter = (geometry) =>
  ['graph', 'polygonsWithHoles', 'segments', 'points'].includes(
    geometry.type
  ) && isNotTypeGhost(geometry);

const wrap = (geometries, offset, alpha) => {
  const inputs = [];
  for (const geometry of geometries) {
    const concreteGeometry = toConcreteGeometry(geometry);
    linearize(concreteGeometry, filter, inputs);
  }
  const outputs = wrap$1(inputs, offset, alpha);
  deletePendingSurfaceMeshes();
  return taggedGroup({}, ...outputs);
};

const rotateX = (turn, geometry) =>
  transform$1(fromRotateXToTransform(turn), geometry);
const rotateY = (turn, geometry) =>
  transform$1(fromRotateYToTransform(turn), geometry);
const rotateZ = (turn, geometry) =>
  transform$1(fromRotateZToTransform(turn), geometry);
const translate = (vector, geometry) =>
  transform$1(fromTranslateToTransform(...vector), geometry);
const scale = (vector, geometry) =>
  transform$1(fromScaleToTransform(...vector), geometry);

export { allTags, approximate, assemble, bend, cached, cast, clip, computeCentroid, computeImplicitVolume, computeNormal, computeOrientedBoundingBox, computeToolpath, convertPolygonsToMeshes, convexHull, cut, deform, demesh, dilateXY, disjoint, disorientSegment, drop, eachFaceEdges, eachItem, eachPoint, eachSegment, eachTriangle, eagerTransform, extrude, fill, fix, fresh, fromPolygonSoup, fromPolygons, fuse, generateLowerEnvelope, generateUpperEnvelope, getAnySurfaces, getGraphs, getInverseMatrices, getItems, getLayouts, getLeafs, getLeafsIn, getPlans, getPoints, getTags, grow, hasMaterial, hasNotShow, hasNotShowOutline, hasNotShowOverlay, hasNotShowSkin, hasNotShowWireframe, hasNotType, hasNotTypeGhost, hasNotTypeMasked, hasNotTypeReference, hasNotTypeVoid, hasShow, hasShowOutline, hasShowOverlay, hasShowSkin, hasShowWireframe, hasType, hasTypeGhost, hasTypeMasked, hasTypeReference, hasTypeVoid, hash, inset, involute, isNotShow, isNotShowOutline, isNotShowOverlay, isNotShowSkin, isNotShowWireframe, isNotType, isNotTypeGhost, isNotTypeMasked, isNotTypeReference, isNotTypeVoid, isShow, isShowOutline, isShowOverlay, isShowSkin, isShowWireframe, isType, isTypeGhost, isTypeMasked, isTypeReference, isTypeVoid, join, keep, linearize, link, load, loadNonblocking, loft, makeAbsolute, measureArea, measureBoundingBox, measureVolume, noGhost, offset, op, outline, read, readNonblocking, reify, remesh, replacer, rewrite, rewriteTags, rotateX, rotateY, rotateZ, scale, seam, section, separate, serialize, shell, showOutline, showOverlay, showSkin, showWireframe, simplify, smooth, soup, store, taggedDisplayGeometry, taggedGraph, taggedGroup, taggedItem, taggedLayout, taggedPlan, taggedPoints, taggedPolygons, taggedPolygonsWithHoles, taggedSegments, taggedSketch, taggedTriangles, toConcreteGeometry, toDisplayGeometry, toPoints, toTransformedGeometry, toTriangleArray, transform$1 as transform, transformCoordinate, transformingCoordinates, translate, twist, typeGhost, typeMasked, typeReference, typeVoid, unfold, update, visit, wrap, write, writeNonblocking };
