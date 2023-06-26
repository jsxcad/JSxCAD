import { composeTransforms, computeBoundingBox, fromTranslateToTransform, invertTransform, approximate as approximate$1, disjoint as disjoint$1, deletePendingSurfaceMeshes, bend as bend$1, serialize as serialize$1, cast as cast$1, clip as clip$1, computeCentroid as computeCentroid$1, computeImplicitVolume as computeImplicitVolume$1, computeNormal as computeNormal$1, computeOrientedBoundingBox as computeOrientedBoundingBox$1, computeToolpath as computeToolpath$1, convexHull as convexHull$1, convertPolygonsToMeshes as convertPolygonsToMeshes$1, cut as cut$1, deform as deform$1, demesh as demesh$1, dilateXY as dilateXY$1, fromSegmentToInverseTransform, faceEdges, eachPoint as eachPoint$1, outline as outline$1, eachTriangle as eachTriangle$1, eagerTransform as eagerTransform$1, extrude as extrude$1, fix as fix$1, fromPolygons as fromPolygons$1, fromPolygonSoup as fromPolygonSoup$1, fuse as fuse$1, generateEnvelope, grow as grow$1, involute as involute$1, fill as fill$1, inset as inset$1, join as join$1, link as link$1, loft as loft$1, makeAbsolute as makeAbsolute$1, computeArea, computeVolume, offset as offset$1, remesh as remesh$1, seam as seam$1, section as section$1, shell as shell$1, simplify as simplify$1, smooth as smooth$1, separate as separate$1, identity, twist as twist$1, unfold as unfold$1, wrap as wrap$1, fromRotateXToTransform, fromRotateYToTransform, fromRotateZToTransform, fromScaleToTransform } from './jsxcad-algorithm-cgal.js';
export { fromRotateXToTransform, fromRotateYToTransform, fromRotateZToTransform, fromScaleToTransform, fromTranslateToTransform, identity, withAabbTreeQuery } from './jsxcad-algorithm-cgal.js';
import { emit, computeHash, write as write$1, read as read$1, readNonblocking as readNonblocking$1, ErrorWouldBlock, addPending } from './jsxcad-sys.js';
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

const transform = (matrix, geometry) => {
  const op = (geometry, descend, walk) =>
    descend({
      matrix: geometry.matrix
        ? composeTransforms(matrix, geometry.matrix)
        : matrix,
    });
  return rewrite(geometry, op);
};

const transformCoordinate = ([x = 0, y = 0, z = 0], matrix) => {
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

const transformingCoordinates =
  (matrix, op) =>
  (coordinate, ...args) =>
    op(transformCoordinate(coordinate, matrix), ...args);

const taggedGroup = ({ tags = [], matrix, provenance }, ...content) => {
  if (content.some((value) => !value)) {
    throw Error(`Undefined Group content`);
  }
  if (content.some((value) => value.geometry)) {
    throw Error(`Group content is an Shape`);
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

const And = (geometries) => taggedGroup({}, ...geometries);

const and = (geometry, geometries) =>
  taggedGroup({}, geometry, ...geometries);

const emitNote = (md) => emit({ md, hash: computeHash(md) });

const note = (geometry, md) => {
  if (typeof md !== 'string') {
    throw Error(`note expects a string`);
  }
  emitNote(md);
  return geometry;
};

const render = (abstract, shape) => {
  const graph = [];
  graph.push('```mermaid');
  graph.push('graph LR;');

  let id = 0;
  const nextId = () => id++;

  const identify = ({ type, tags, content }) => {
    if (content) {
      return { type, tags, id: nextId(), content: content.map(identify) };
    } else {
      return { type, tags, id: nextId() };
    }
  };

  const render = ({ id, type, tags = [], content = [] }) => {
    graph.push(`  ${id}[${type}<br>${tags.join('<br>')}]`);
    for (const child of content) {
      graph.push(`  ${id} --> ${child.id};`);
      render(child);
    }
  };

  render(identify(abstract));

  graph.push('```');
  graph.push('');

  emitNote(graph.join('\n'));
};

const abstract = (geometry, types) => {
  const walk = ({ type, tags, plan, content }) => {
    if (type === 'group') {
      return content.flatMap(walk);
    } else if (content) {
      if (types.includes(type)) {
        return [{ type, tags, content: content.flatMap(walk) }];
      } else {
        return content.flatMap(walk);
      }
    } else if (types.includes(type)) {
      return [{ type, tags }];
    } else {
      return [];
    }
  };
  render(walk(geometry));
  return geometry;
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

const filter$G = (geometry) =>
  isNotTypeGhost(geometry) &&
  ((geometry.type === 'graph' && !geometry.graph.isEmpty) ||
    ['polygonsWithHoles', 'segments', 'points'].includes(geometry.type));

const measureBoundingBox = (geometry) =>
  computeBoundingBox(linearize(geometry, filter$G));

const taggedPoints = (
  { tags = [], matrix, provenance },
  points,
  exactPoints
) => {
  return { type: 'points', tags, matrix, provenance, points, exactPoints };
};

const translate = (geometry, vector) =>
  transform(fromTranslateToTransform(...vector), geometry);

const add = ([ax = 0, ay = 0, az = 0], [bx = 0, by = 0, bz = 0]) => [
  ax + bx,
  ay + by,
  az + bz,
];

const scale$1 = (amount, [x = 0, y = 0, z = 0]) => [
  x * amount,
  y * amount,
  z * amount,
];

const X = 0;
const Y = 1;
const Z = 2;

const MIN = 0;
const MAX = 1;

const subtract$1 = ([ax, ay, az], [bx, by, bz]) => [ax - bx, ay - by, az - bz];

// Round to the nearest 0.001 mm

const round = (v) => Math.round(v * 1000) / 1000;

const roundCoordinate = ([x, y, z]) => [round(x), round(y), round(z)];

const computeOffset = (geometry, spec, origin) => {
  const boundingBox = measureBoundingBox(geometry);
  if (boundingBox === undefined) {
    return [0, 0, 0];
  }
  const max = roundCoordinate(boundingBox[MAX]);
  const min = roundCoordinate(boundingBox[MIN]);
  const center = roundCoordinate(scale$1(0.5, add(min, max)));
  const offset = [0, 0, 0];
  let index = 0;
  while (index < spec.length) {
    switch (spec[index++]) {
      case 'x': {
        switch (spec[index]) {
          case '>':
            offset[X] = -min[X];
            index += 1;
            break;
          case '<':
            offset[X] = -max[X];
            index += 1;
            break;
          default:
            offset[X] = -center[X];
        }
        break;
      }
      case 'y': {
        switch (spec[index]) {
          case '>':
            offset[Y] = -min[Y];
            index += 1;
            break;
          case '<':
            offset[Y] = -max[Y];
            index += 1;
            break;
          default:
            offset[Y] = -center[Y];
        }
        break;
      }
      case 'z': {
        switch (spec[index]) {
          case '>':
            offset[Z] = -min[Z];
            index += 1;
            break;
          case '<':
            offset[Z] = -max[Z];
            index += 1;
            break;
          default:
            offset[Z] = -center[Z];
        }
        break;
      }
    }
  }
  if (!offset.every(isFinite)) {
    throw Error(`Non-finite/offset: ${offset}`);
  }
  return offset;
};

const alignment = (geometry, spec = 'xyz', origin = [0, 0, 0]) => {
  const offset = computeOffset(geometry, spec);
  const reference = translate(
    taggedPoints({}, [[0, 0, 0]]),
    subtract$1(offset, origin)
  );
  return reference;
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

const by = (geometry, selections) => {
  const placed = [];
  for (const selection of selections) {
    for (const leaf of getLeafs(selection)) {
      const { global } = getInverseMatrices(leaf);
      // Perform the operation then place the
      // result in the global frame of the reference.
      placed.push(transform(global, geometry));
    }
  }
  return taggedGroup({}, ...placed);
};

const align = (geometry, spec) =>
  by(geometry, [alignment(geometry, spec)]);

const filter$F = (geometry) => ['graph'].includes(geometry.type);

const approximate = (
  geometry,
  {
    iterations,
    relaxationSteps,
    minimumErrorDrop,
    subdivisionRatio,
    relativeToChord,
    withDihedralAngle,
    optimizeAnchorLocation,
    pcaPlane,
    maxNumberOfProxies,
  }
) => {
  const inputs = linearize(geometry, filter$F);
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
  return replacer(inputs, outputs)(geometry);
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

const filter$E = (geometry) =>
  ['graph', 'polygonsWithHoles', 'segments', 'points'].includes(
    geometry.type
  ) &&
  (isNotTypeGhost(geometry) || isTypeVoid(geometry));

const Disjoint = (geometries, { backward, exact }) => {
  const concreteGeometries = geometries.map((geometry) =>
    toConcreteGeometry(geometry)
  );
  const inputs = [];
  for (const concreteGeometry of concreteGeometries) {
    linearize(concreteGeometry, filter$E, inputs);
  }
  // console.log(`QQ/disjoint/inputs: ${JSON.stringify(inputs)}`);
  const outputs = disjoint$1(inputs, backward, exact);
  const disjointGeometries = [];
  const update = replacer(inputs, outputs);
  for (const concreteGeometry of concreteGeometries) {
    disjointGeometries.push(update(concreteGeometry));
  }
  deletePendingSurfaceMeshes();
  return taggedGroup({}, ...disjointGeometries);
};

const fit = (geometry, geometries, modes) =>
  Disjoint([...geometries, geometry], modes);

const fitTo = (geometry, geometries, modes) =>
  Disjoint([geometry, ...geometries], modes);

const disjoint = (geometry, modes) => Disjoint([geometry], modes);

const assemble = (geometries, exact) =>
  disjoint(geometries, undefined);

const at = (geometry, selection, op) => {
  const { local, global } = getInverseMatrices(geometry);
  const { local: selectionLocal, global: selectionGlobal } =
    getInverseMatrices(selection);
  const localGeometry = transform(geometry, local);
  const selectionGlobalGeometry = transform(localGeometry, selectionGlobal);
  // We split this operation to allow the caller to do arbitrary operations in the middle.
  return [
    selectionGlobalGeometry,
    (newSelectionGlobalGeometry) => {
      const newSelectionLocalGeometry = transform(
        newSelectionGlobalGeometry,
        selectionLocal
      );
      const newGlobalGeometry = transform(newSelectionLocalGeometry, global);
      return newGlobalGeometry;
    },
  ];
};

const filter$D = (geometry) => ['graph'].includes(geometry.type);

const bend = (geometry, radius) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter$D, inputs);
  const outputs = bend$1(inputs, radius);
  deletePendingSurfaceMeshes();
  return replacer(inputs, outputs)(concreteGeometry);
};

const filter$C = (geometry) =>
  geometry.type === 'graph' && !geometry.graph.serializedSurfaceMesh;

const serialize = (geometry) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter$C, inputs, /* includeSketches= */ true);
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

const filter$B = (geometry) =>
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
  linearize(concreteGeometry, filter$B, inputs);
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

const filter$A = (noVoid, onlyGraph) => (geometry) =>
  ['graph', 'polygonsWithHoles', 'segments', 'points'].includes(
    geometry.type
  ) &&
  (isNotTypeGhost(geometry) || (!noVoid && isTypeVoid(geometry))) &&
  (!onlyGraph || geometry.type === 'graph');

const clip = (
  geometry,
  geometries,
  { open, exact, noVoid, noGhost, onlyGraph }
) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter$A(noVoid, onlyGraph), inputs);
  const count = inputs.length;
  for (const geometry of geometries) {
    linearize(geometry, filter$A(noVoid), inputs);
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

const clipFrom = (clipBy, clipFrom, modes) =>
  clip(clipFrom, [clipBy], modes);

const commonVolume = (geometry, modes) => {
  const inputs = linearize(
    geometry,
    filter$A(modes.noVoid, { ...modes, onlyGraph: true })
  );
  switch (inputs.length) {
    case 0: {
      return taggedGroup({});
    }
    case 1: {
      return inputs[0];
    }
    default: {
      const [first, ...rest] = inputs;
      return clip(first, rest, modes);
    }
  }
};

const filter$z = (geometry) =>
  ['graph', 'polygonsWithHoles'].includes(geometry.type) &&
  isNotTypeGhost(geometry);

const computeCentroid = (geometry, top, bottom) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter$z, inputs);
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

const filter$y = (geometry) =>
  ['graph', 'polygonsWithHoles'].includes(geometry.type) &&
  isNotTypeGhost(geometry);

const computeNormal = (geometry, top, bottom) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter$y, inputs);
  const outputs = computeNormal$1(inputs, top, bottom);
  deletePendingSurfaceMeshes();
  return taggedGroup({}, ...outputs);
};

const filter$x = (geometry) =>
  isNotTypeGhost(geometry) &&
  ((geometry.type === 'graph' && !geometry.graph.isEmpty) ||
    ['polygonsWithHoles', 'segments', 'points'].includes(geometry.type));

const computeOrientedBoundingBox = (geometry) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter$x, inputs);
  const outputs = computeOrientedBoundingBox$1(inputs);
  deletePendingSurfaceMeshes();
  return outputs[0];
};

const filter$w = (geometry) =>
  ['graph'].includes(geometry.type) && isNotTypeGhost(geometry);

const computeToolpath = (
  geometry,
  material,
  resolution,
  toolSize,
  toolCutDepth,
  annealingMax,
  annealingMin,
  annealingDecay
) => {
  const inputs = [];
  linearize(geometry, filter$w, inputs);
  const materialStart = inputs.length;
  linearize(material, filter$w, inputs);
  const outputs = computeToolpath$1(
    inputs,
    materialStart,
    resolution,
    toolSize,
    toolCutDepth,
    annealingMax,
    annealingMin,
    annealingDecay
  );
  deletePendingSurfaceMeshes();
  return taggedGroup({}, ...outputs);
};

const filter$v = (geometry) =>
  ['graph', 'polygonsWithHoles', 'segments', 'points'].includes(geometry.type);

const convexHull = (geometries) => {
  const inputs = [];
  for (const geometry of geometries) {
    linearize(toConcreteGeometry(geometry), filter$v, inputs);
  }
  const outputs = convexHull$1(inputs);
  deletePendingSurfaceMeshes();
  return taggedGroup({}, ...outputs);
};

const filter$u = () => (geometry) =>
  ['polygonsWithHoles'].includes(geometry.type);

const convertPolygonsToMeshes = (geometry) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter$u(), inputs);
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
  toCut,
  toClips,
  { open = false, exact, noVoid, noGhost }
) => {
  const concreteGeometry = toConcreteGeometry(toCut);
  const inputs = [];
  linearize(concreteGeometry, filterTargets$2(noVoid), inputs);
  const count = inputs.length;
  for (const toClip of toClips) {
    linearize(toClip, filterRemoves(noVoid), inputs);
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

const cutFrom = (toClip, toCut, options) =>
  cut(toCut, [toClip], options);

const cutOut = (cutGeometry, clipGeometry, modes) => [
  cut(cutGeometry, [clipGeometry], { ...modes, noGhost: true }),
  clip(cutGeometry, [clipGeometry], { ...modes, noGhost: true }),
];

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

const filter$t = (geometry) => ['graph'].includes(geometry.type);

const demesh = (geometry) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter$t, inputs);
  const outputs = demesh$1(inputs);
  deletePendingSurfaceMeshes();
  return replacer(inputs, outputs)(concreteGeometry);
};

const filter$s = (geometry, parent) =>
  ['graph'].includes(geometry.type) && isNotTypeGhost(geometry);

const dilateXY = (geometry, amount) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter$s, inputs);
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

const filter$r = (geometry) =>
  ['graph', 'polygonsWithHoles'].includes(geometry.type) &&
  isNotTypeGhost(geometry);

const eachFaceEdges = (geometry, selections, emitFaceEdges) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter$r, inputs);
  const count = inputs.length;
  for (const selection of selections) {
    linearize(toConcreteGeometry(selection), filter$r, inputs);
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

const filter$q = (geometry) =>
  ['graph', 'polygonsWithHoles', 'segments', 'points'].includes(
    geometry.type
  ) && isNotTypeGhost(geometry);

const eachPoint = (geometry, emit) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter$q, inputs);
  eachPoint$1(inputs, emit);
  deletePendingSurfaceMeshes();
};

const filter$p = (geometry) =>
  ['graph', 'polygonsWithHoles'].includes(geometry.type) &&
  isNotTypeGhost(geometry);

const outline = (geometry, selections) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter$p, inputs);
  const count = inputs.length;
  for (const selection of selections) {
    linearize(toConcreteGeometry(selection), filter$p, inputs);
  }
  const outputs = outline$1(inputs, count);
  deletePendingSurfaceMeshes();
  return replacer(inputs, outputs)(concreteGeometry);
};

const filter$o = ({ type }) => type === 'segments';

const eachSegment = (geometry, emit, selections = []) => {
  for (const { matrix, segments, normals, faces } of linearize(
    outline(geometry, selections),
    filter$o
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

const filter$n = (noVoid) => (geometry) =>
  ['graph', 'polygonsWithHoles'].includes(geometry.type) &&
  (isNotTypeGhost(geometry) || (!noVoid && isTypeVoid));

const extrude = (geometry, top, bottom, noVoid) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter$n(noVoid), inputs);
  const count = inputs.length;
  inputs.push(top, bottom);
  const outputs = extrude$1(inputs, count, noVoid);
  deletePendingSurfaceMeshes();
  return replacer(inputs, outputs)(concreteGeometry);
};

const filter$m = (geometry) =>
  ['graph'].includes(geometry.type) && isNotTypeGhost(geometry);

const fix = (geometry, selfIntersection = true) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter$m, inputs);
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
  {
    tags = [],
    close = false,
    tolerance,
    wrapAlways,
    wrapAbsoluteAlpha,
    wrapAbsoluteOffset,
    wrapRelativeAlpha,
    wrapRelativeOffset,
    cornerThreshold,
  } = {}
) => {
  const outputs = fromPolygonSoup$1(
    polygons,
    tolerance,
    wrapAlways,
    wrapRelativeAlpha,
    wrapRelativeOffset,
    wrapAbsoluteAlpha,
    wrapAbsoluteOffset,
    cornerThreshold
  );
  deletePendingSurfaceMeshes();
  return taggedGroup({}, ...outputs.map((output) => ({ ...output, tags })));
};

const filter$l = (geometry) =>
  ['graph', 'polygonsWithHoles', 'segments'].includes(geometry.type) &&
  isNotTypeGhost(geometry);

const Fuse = (geometries, { exact }) => {
  const inputs = [];
  for (const geometry of geometries) {
    linearize(geometry, filter$l, inputs);
  }
  const outputs = fuse$1(inputs, exact);
  deletePendingSurfaceMeshes();
  return taggedGroup({}, ...outputs);
};

const fuse = (geometry, geometries, { exact }) =>
  Fuse([geometry, ...geometries], { exact });

const filter$k = (geometry) =>
  ['graph'].includes(geometry.type) && isNotTypeGhost(geometry);

const generateLowerEnvelope = (geometry) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter$k, inputs);
  const outputs = generateEnvelope(inputs, /* envelopeType= */ 1);
  deletePendingSurfaceMeshes();
  return replacer(inputs, outputs)(concreteGeometry);
};

const filter$j = (geometry) =>
  ['graph'].includes(geometry.type) && isNotTypeGhost(geometry);

const generateUpperEnvelope = (geometry) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter$j, inputs);
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

const filter$i = (geometry, parent) =>
  ['graph'].includes(geometry.type) && isNotTypeGhost(geometry);

const grow = (geometry, offset, selections, options) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter$i, inputs);
  const count = inputs.length;
  inputs.push(offset);
  for (const selection of selections) {
    linearize(toConcreteGeometry(selection), filter$i, inputs);
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

const filter$h = (geometry) =>
  ['graph', 'polygonsWithHoles'].includes(geometry.type);

const involute = (geometry) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter$h, inputs);
  const outputs = involute$1(inputs);
  deletePendingSurfaceMeshes();
  return replacer(inputs, outputs)(concreteGeometry);
};

const filter$g = (geometry) =>
  ['graph', 'polygonsWithHoles', 'segments'].includes(geometry.type) &&
  isNotTypeGhost(geometry);

const fill = (geometry, tags = []) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter$g, inputs);
  const outputs = fill$1(inputs);
  deletePendingSurfaceMeshes();
  return taggedGroup({}, ...outputs.map((output) => ({ ...output, tags })));
};

const filter$f = (geometry) =>
  ['graph', 'polygonsWithHoles'].includes(geometry.type) &&
  isNotTypeGhost(geometry);

const inset = (geometry, ...args) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter$f, inputs);
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

const filter$e = (noVoid) => (geometry) =>
  ['graph', 'polygonsWithHoles', 'segments'].includes(geometry.type) &&
  isNotTypeGhost(geometry);

const filterAdds = (noVoid) => (geometry) =>
  filter$e() && isNotTypeGhost(geometry);

const join = (geometry, geometries, { exact, noVoid }) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter$e(), inputs);
  const count = inputs.length;
  for (const geometry of geometries) {
    linearize(geometry, filterAdds(), inputs);
  }
  const outputs = join$1(inputs, count, exact);
  deletePendingSurfaceMeshes();
  return replacer(inputs, outputs, count)(concreteGeometry);
};

const joinTo = (geometry, other, modes) =>
  join(other, [geometry], modes);

const keep = (tags, geometry) =>
  rewriteTags(['type:void'], [], geometry, tags, 'has not');

const filter$d = (geometry) =>
  ['points', 'segments'].includes(geometry.type) && isNotTypeGhost(geometry);

const Link = (geometries, { close = false, reverse = false }) => {
  const inputs = [];
  for (const geometry of geometries) {
    linearize(toConcreteGeometry(geometry), filter$d, inputs);
  }
  const outputs = link$1(inputs, close, reverse);
  return taggedGroup({}, ...outputs);
};

const link = (geometry, geometries, mode) =>
  Link([geometry, ...geometries], mode);

const loop = (geometry, geometries, mode) =>
  Link([geometry, ...geometries], { ...mode, close: true });

const filter$c = (geometry) =>
  ['graph', 'polygonsWithHoles'].includes(geometry.type) &&
  isNotTypeGhost(geometry);

const Loft = (geometries, { open = false }) => {
  const inputs = [];
  // This is wrong -- we produce a total linearization over geometries,
  // but really it should be partitioned.
  for (const geometry of geometries) {
    linearize(toConcreteGeometry(geometry), filter$c, inputs);
  }
  const outputs = loft$1(inputs, !open);
  deletePendingSurfaceMeshes();
  return taggedGroup({}, ...outputs);
};

const loft = (geometry, geometries, mode) =>
  Loft([geometry, ...geometries], mode);

const filter$b = (geometry) =>
  ['graph', 'polygonsWithHoles', 'segments', 'points'].includes(
    geometry.type
  ) && isNotTypeGhost(geometry);

const makeAbsolute = (geometry, tags = []) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter$b, inputs);
  const outputs = makeAbsolute$1(inputs);
  deletePendingSurfaceMeshes();
  return replacer(inputs, outputs)(concreteGeometry);
};

const filter$a = (geometry) =>
  ['graph', 'polygonsWithHoles'].includes(geometry.type) &&
  hasNotTypeVoid(geometry);

const measureArea = (geometry) => {
  const linear = [];
  linearize(geometry, filter$a, linear);
  return computeArea(linear);
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

const qualifyTag = (tag, namespace = 'user') => {
  if (tag.includes(':')) {
    return tag;
  }
  return `${namespace}:${tag}`;
};

const tagMatcher = (tag, namespace = 'user') => {
  let qualifiedTag = qualifyTag(tag, namespace);
  if (qualifiedTag.endsWith('=*')) {
    const [base] = qualifiedTag.split('=');
    const prefix = `${base}=`;
    return (tag) => tag.startsWith(prefix);
  } else if (qualifiedTag.endsWith(':*')) {
    const [namespace] = qualifiedTag.split(':');
    const prefix = `${namespace}:`;
    return (tag) => tag.startsWith(prefix);
  } else {
    return (tag) => tag === qualifiedTag;
  }
};

const oneOfTagMatcher = (tags, namespace = 'user') => {
  const matchers = tags.map((tag) => tagMatcher(tag, namespace));
  const isMatch = (tag) => {
    for (const matcher of matchers) {
      if (matcher(tag)) {
        return true;
      }
    }
    return false;
  };
  return isMatch;
};

const retag = (geometry, oldTags, newTags) => {
  oldTags = oldTags.map((tag) => qualifyTag(tag));
  newTags = newTags.map((tag) => qualifyTag(tag));

  const isOldTagMatch = oneOfTagMatcher(oldTags, 'user');
  const op = (geometry, descend) => {
    switch (geometry.type) {
      case 'group':
      case 'layout':
        return descend();
      default: {
        const { tags = [] } = geometry;
        const remaining = [];
        for (const tag of tags) {
          if (!isOldTagMatch(tag)) {
            remaining.push(tag);
          }
        }
        for (const newTag of newTags) {
          if (!remaining.includes(newTag)) {
            remaining.push(newTag);
          }
        }
        return descend({ tags: remaining });
      }
    }
  };
  const result = rewrite(geometry, op);
  return result;
};

const untag = (geometry, oldTags) => retag(geometry, oldTags, []);

const tag = (geometry, newTags) => retag(geometry, [], newTags);

const as = (geometry, names) =>
  taggedItem({ tags: names.map((name) => `item:${name}`) }, geometry);

const asPart = (geometry, names) =>
  taggedItem({ tags: names.map((name) => `part:${name}`) }, geometry);

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
  interval = [1 / -2, 1 / 2],
  sizingFallback = 1,
  approxFallback = 0.1,
  { protect = false },
  {
    angle = 30 / 360,
    sizing = sizingFallback,
    approx = approxFallback,
    edgeLength = 1,
  }
) => {
  const [innerOffset = 0, outerOffset = 0] = interval;
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter$5, inputs);
  const outputs = shell$1(
    inputs,
    innerOffset,
    outerOffset,
    protect,
    angle * 360,
    sizing,
    approx,
    edgeLength
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

const simplify = (geometry, cornerThreshold, eps) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter$4, inputs);
  const outputs = simplify$1(inputs, cornerThreshold, eps);
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

const separate = (geometry, { noShapes, noHoles, holesAsShapes }) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter$2, inputs);
  const outputs = separate$1(inputs, !noShapes, !noHoles, holesAsShapes);
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
  transform(fromRotateXToTransform(turn), geometry);
const rotateY = (turn, geometry) =>
  transform(fromRotateYToTransform(turn), geometry);
const rotateZ = (turn, geometry) =>
  transform(fromRotateZToTransform(turn), geometry);
const scale = (vector, geometry) =>
  transform(fromScaleToTransform(...vector), geometry);

export { And, Disjoint, Fuse, abstract, align, alignment, allTags, and, approximate, as, asPart, assemble, at, bend, cached, cast, clip, clipFrom, commonVolume, computeCentroid, computeImplicitVolume, computeNormal, computeOrientedBoundingBox, computeToolpath, convertPolygonsToMeshes, convexHull, cut, cutFrom, cutOut, deform, demesh, dilateXY, disjoint, disorientSegment, drop, eachFaceEdges, eachItem, eachPoint, eachSegment, eachTriangle, eagerTransform, emitNote, extrude, fill, fit, fitTo, fix, fresh, fromPolygonSoup, fromPolygons, fuse, generateLowerEnvelope, generateUpperEnvelope, getAnySurfaces, getGraphs, getInverseMatrices, getItems, getLayouts, getLeafs, getLeafsIn, getPlans, getPoints, getTags, grow, hasMaterial, hasNotShow, hasNotShowOutline, hasNotShowOverlay, hasNotShowSkin, hasNotShowWireframe, hasNotType, hasNotTypeGhost, hasNotTypeMasked, hasNotTypeReference, hasNotTypeVoid, hasShow, hasShowOutline, hasShowOverlay, hasShowSkin, hasShowWireframe, hasType, hasTypeGhost, hasTypeMasked, hasTypeReference, hasTypeVoid, hash, inset, involute, isNotShow, isNotShowOutline, isNotShowOverlay, isNotShowSkin, isNotShowWireframe, isNotType, isNotTypeGhost, isNotTypeMasked, isNotTypeReference, isNotTypeVoid, isShow, isShowOutline, isShowOverlay, isShowSkin, isShowWireframe, isType, isTypeGhost, isTypeMasked, isTypeReference, isTypeVoid, join, joinTo, keep, linearize, link, load, loadNonblocking, loft, loop, makeAbsolute, measureArea, measureBoundingBox, measureVolume, noGhost, note, offset, oneOfTagMatcher, op, outline, read, readNonblocking, reify, remesh, replacer, retag, rewrite, rewriteTags, rotateX, rotateY, rotateZ, scale, seam, section, separate, serialize, shell, showOutline, showOverlay, showSkin, showWireframe, simplify, smooth, soup, store, tag, tagMatcher, taggedDisplayGeometry, taggedGraph, taggedGroup, taggedItem, taggedLayout, taggedPlan, taggedPoints, taggedPolygons, taggedPolygonsWithHoles, taggedSegments, taggedSketch, taggedTriangles, toConcreteGeometry, toDisplayGeometry, toPoints, toTransformedGeometry, toTriangleArray, transform, transformCoordinate, transformingCoordinates, translate, twist, typeGhost, typeMasked, typeReference, typeVoid, unfold, untag, update, visit, wrap, write, writeNonblocking };
