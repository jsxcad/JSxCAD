import { composeTransforms, fromRotateXToTransform, fromRotateYToTransform, fromRotateZToTransform, invertTransform, eagerTransform as eagerTransform$1, involute as involute$1, computeBoundingBox, fromScaleToTransform, link as link$1, fromSegmentToInverseTransform, computeNormal as computeNormal$1, makeAbsolute as makeAbsolute$1, fromTranslateToTransform, extrude as extrude$1, fill as fill$2, fuse as fuse$1, convexHull as convexHull$1, computeSkeleton as computeSkeleton$1, eachPoint, clip as clip$1, cut as cut$1, section as section$1, iron as iron$1, makeUnitSphere, route, approximate as approximate$1, disjoint as disjoint$1, bend as bend$1, serialize as serialize$1, cast as cast$1, computeCentroid as computeCentroid$1, computeImplicitVolume as computeImplicitVolume$1, computeOrientedBoundingBox as computeOrientedBoundingBox$1, computeReliefFromImage as computeReliefFromImage$1, computeToolpath as computeToolpath$1, convertPolygonsToMeshes as convertPolygonsToMeshes$1, deform as deform$1, demesh as demesh$1, dilateXY as dilateXY$1, faceEdges, outline as outline$1, eachTriangle as eachTriangle$1, separate as separate$1, fair as fair$1, fix as fix$1, fromPolygonSoup as fromPolygonSoup$1, generateEnvelope, grow as grow$1, inset as inset$1, join as join$1, loft as loft$1, computeArea, computeVolume, minimizeOverhang as minimizeOverhang$1, offset as offset$1, pack as pack$1, reconstruct as reconstruct$1, refine as refine$1, remesh as remesh$1, raycast, repair as repair$1, withIsExteriorPoint, seam as seam$1, shell as shell$1, simplify as simplify$1, smooth as smooth$1, trim as trim$1, identity, twist as twist$1, unfold as unfold$1, validate as validate$1, wrap as wrap$1 } from './jsxcad-algorithm-cgal.js';
export { fromRotateXToTransform, fromRotateYToTransform, fromRotateZToTransform, fromScaleToTransform, fromTranslateToTransform, identity } from './jsxcad-algorithm-cgal.js';
import { toTagsFromName } from './jsxcad-algorithm-material.js';
import { toTagsFromName as toTagsFromName$1 } from './jsxcad-algorithm-color.js';
import { emit, computeHash, write as write$1, read as read$1, readNonblocking as readNonblocking$1, ErrorWouldBlock, addPending, log as log$1 } from './jsxcad-sys.js';

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
  if (content.some((value) => typeof value === 'function')) {
    throw Error(`Group content is a function`);
  }
  if (content.length === 1) {
    return content[0];
  }
  return { type: 'group', tags, matrix, content, provenance };
};

const Group = (geometries) => taggedGroup({}, ...geometries);

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
  if (from === to) {
    return (geometry) => geometry;
  }
  // We need to consider the case that there are duplicates in from.
  const update = (geometry, descend) => {
    for (let nth = 0; nth < limit; nth++) {
      if (from[nth] === geometry) {
        // Prevent this from being matched twice.
        from[nth] = undefined;
        return to[nth];
      }
    }
    return descend();
  };
  return (geometry) => rewrite(geometry, update);
};

const validateContent = (geometry, content) => {
  if (content && content.some((value) => !value)) {
    for (const v of content) {
      console.log(`QQ/content: ${v}`);
      console.log(`QQ/geometry= ${JSON.stringify(geometry)}`);
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

const transform = (geometry, matrix) => {
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

const rotateX = (geometry, turn) =>
  transform(geometry, fromRotateXToTransform(turn));

const rotateXs = (geometry, turns) =>
  Group(turns.map((turn) => transform(geometry, fromRotateXToTransform(turn))));

const rotateY = (geometry, turn) =>
  transform(geometry, fromRotateYToTransform(turn));

const rotateYs = (geometry, turns) =>
  Group(turns.map((turn) => transform(geometry, fromRotateYToTransform(turn))));

const rotateZ = (geometry, turn) =>
  transform(geometry, fromRotateZToTransform(turn));

const rotateZs = (geometry, turns) =>
  Group(turns.map((turn) => transform(geometry, fromRotateZToTransform(turn))));

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

const turnTransform = (geometry, rotation) => {
  const { local, global } = getInverseMatrices(geometry);
  const localGeometry = transform(geometry, local);
  const turnedGeometry = transform(localGeometry, rotation);
  const globalGeometry = transform(turnedGeometry, global);
  return globalGeometry;
};

const turnX = (geometry, turn) =>
  turnTransform(geometry, fromRotateXToTransform(turn));

const turnXs = (geometry, turns) =>
  Group(
    turns.map((turn) => turnTransform(geometry, fromRotateXToTransform(turn)))
  );

const turnY = (geometry, turn) =>
  turnTransform(geometry, fromRotateYToTransform(turn));

const turnYs = (geometry, turns) =>
  Group(
    turns.map((turn) => turnTransform(geometry, fromRotateYToTransform(turn)))
  );

const turnZ = (geometry, turn) =>
  turnTransform(geometry, fromRotateZToTransform(turn));

const turnZs = (geometry, turns) =>
  Group(
    turns.map((turn) => turnTransform(geometry, fromRotateZToTransform(turn)))
  );

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

const typeLabel = 'type:label';
const hasTypeLabel = hasType(typeLabel);

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
  { includeSketches = false, includeItems = true } = {}
) => {
  const collect = (geometry, descend) => {
    if (filter(geometry)) {
      out.push(geometry);
    }
    if (geometry.type === 'sketch' && !includeSketches) {
      return;
    }
    if (geometry.type === 'item' && !includeItems) {
      return;
    }
    descend();
  };
  visit(geometry, collect);
  return out;
};

const filterTargets$2 = (noVoid) => (geometry) =>
  ['graph', 'polygonsWithHoles', 'segments', 'points'].includes(geometry.type);

// CHECK: We should pass in reference geometry rather than a matrix.
const eagerTransform = (geometry, matrix, { noVoid } = {}) => {
  const inputs = linearize(geometry, filterTargets$2());
  const count = inputs.length;
  inputs.push(hasTypeReference(taggedGroup({ matrix })));
  const outputs = eagerTransform$1(inputs);
  return replacer(inputs, outputs, count)(geometry);
};

const filter$P = (geometry) =>
  ['graph', 'polygonsWithHoles'].includes(geometry.type);

const involute = (geometry) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter$P, inputs);
  const outputs = involute$1(inputs);
  return replacer(inputs, outputs)(concreteGeometry);
};

const filter$O = (geometry) =>
  isNotTypeGhost(geometry) &&
  ((geometry.type === 'graph' && !geometry.graph.isEmpty) ||
    ['polygonsWithHoles', 'segments', 'points'].includes(geometry.type));

const measureBoundingBox = (geometry) =>
  computeBoundingBox(linearize(geometry, filter$O));

const X$9 = 0;
const Y$9 = 1;
const Z$8 = 2;

const scale$1 = (geometry, [x = 1, y = 1, z = 1]) => {
  const negatives = (x < 0) + (y < 0) + (z < 0);
  if (!isFinite(x)) {
    throw Error(`scale received non-finite x: ${x}`);
  }
  if (!isFinite(y)) {
    throw Error(`scale received non-finite y: ${y}`);
  }
  if (!isFinite(z)) {
    throw Error(`scale received non-finite z: ${z}`);
  }
  let scaledGeometry = eagerTransform(geometry, fromScaleToTransform(x, y, z));
  if (negatives % 2) {
    // Compensate for inversion.
    return involute(scaledGeometry);
  } else {
    return scaledGeometry;
  }
};

const scaleLazy = (geometry, [x = 1, y = 1, z = 1]) => {
  const negatives = (x < 0) + (y < 0) + (z < 0);
  if (!isFinite(x)) {
    throw Error(`scale received non-finite x: ${x}`);
  }
  if (!isFinite(y)) {
    throw Error(`scale received non-finite y: ${y}`);
  }
  if (!isFinite(z)) {
    throw Error(`scale received non-finite z: ${z}`);
  }
  let scaledGeometry = transform(geometry, fromScaleToTransform(x, y, z));
  if (negatives % 2) {
    // Compensate for inversion.
    return involute(scaledGeometry);
  } else {
    return scaledGeometry;
  }
};

const scaleUniformly = (geometry, amount) =>
  scale$1(geometry, [amount, amount, amount]);

const scaleToFit = (geometry, [x, y, z]) => {
  const bounds = measureBoundingBox(geometry);
  if (bounds === undefined) {
    return geometry;
  }
  const [min, max] = bounds;
  const length = max[X$9] - min[X$9];
  const width = max[Y$9] - min[Y$9];
  const height = max[Z$8] - min[Z$8];
  if (x === undefined) {
    x = length;
  }
  if (y === undefined) {
    y = width;
  }
  if (z === undefined) {
    z = height;
  }
  const xFactor = x / length;
  const yFactor = y / width;
  const zFactor = z / height;
  // Surfaces may get non-finite factors -- use the unit instead.
  const finite = (factor) => (isFinite(factor) ? factor : 1);
  return scale$1(geometry, [finite(xFactor), finite(yFactor), finite(zFactor)]);
};

const And = (geometries) => taggedGroup({}, ...geometries);

const and = (geometry, geometries) =>
  taggedGroup({}, geometry, ...geometries);

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

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var parseNumber = createCommonjsModule(function (module) {
/**
 * More correct array check
 */
var parser = module.exports = function(str) {
  if (Array.isArray(str)) return NaN;
  return parser.str(str);
};

/**
 * Simple check, assumes non-array inputs
 */
parser.str = function(str) {
  if (str == null || str === "") return NaN;
  return +str;
};
});

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

const tags = (geometry, tag = '*') => {
  const isMatchingTag = tagMatcher(tag, 'user');
  const collected = [];
  for (const { tags } of getLeafs(geometry)) {
    for (const tag of tags) {
      if (isMatchingTag(tag)) {
        collected.push(tag);
      }
    }
  }
  return collected;
};

const As = (names, geometries) =>
  taggedItem({ tags: names.map((name) => `item:${name}`) }, Group(geometries));

const as = (geometry, names, geometries) =>
  taggedItem(
    { tags: names.map((name) => `item:${name}`) },
    Group([geometry, ...geometries])
  );

const AsPart = (names, geometries) =>
  taggedItem({ tags: names.map((name) => `part:${name}`) }, Group(geometries));

const asPart = (geometry, names, geometries) =>
  taggedItem(
    { tags: names.map((name) => `part:${name}`) },
    Group([geometry, ...geometries])
  );

const getValue = (geometry, tags) => {
  const values = [];
  for (const tag of tags) {
    const matches = tags(geometry, `${tag}=*`);
    if (matches.length === 0) {
      values.push(undefined);
      continue;
    }
    const [, value] = matches[0].split('=');
    const number = parseNumber(value);
    if (isFinite(number)) {
      values.push(value);
      continue;
    }
    values.push(value);
  }
  return values;
};

const filter$N = (geometry) =>
  ['points', 'segments'].includes(geometry.type) && isNotTypeGhost(geometry);

const Link = (geometries, { close = false, reverse = false } = {}) => {
  const inputs = [];
  for (const geometry of geometries) {
    linearize(geometry, filter$N, inputs);
  }
  const outputs = link$1(inputs, close, reverse);
  return taggedGroup({}, ...outputs);
};

const link = (geometry, geometries, mode) =>
  Link([geometry, ...geometries], mode);

const loop = (geometry, geometries, mode = {}) =>
  Link([geometry, ...geometries], { ...mode, close: true });

const Loop = (geometries, mode = {}) =>
  Link(geometries, { ...mode, close: true });

const X$8 = 0;
const Y$8 = 1;
const Z$7 = 2;

const buildCorners = (x = 1, y = x, z = 0) => {
  const c1 = [0, 0, 0];
  const c2 = [0, 0, 0];
  if (x instanceof Array) {
    while (x.length < 2) {
      x.push(0);
    }
    if (x[0] < x[1]) {
      c1[X$8] = x[1];
      c2[X$8] = x[0];
    } else {
      c1[X$8] = x[0];
      c2[X$8] = x[1];
    }
  } else {
    c1[X$8] = x / 2;
    c2[X$8] = x / -2;
  }
  if (y instanceof Array) {
    while (y.length < 2) {
      y.push(0);
    }
    if (y[0] < y[1]) {
      c1[Y$8] = y[1];
      c2[Y$8] = y[0];
    } else {
      c1[Y$8] = y[0];
      c2[Y$8] = y[1];
    }
  } else {
    c1[Y$8] = y / 2;
    c2[Y$8] = y / -2;
  }
  if (z instanceof Array) {
    while (z.length < 2) {
      z.push(0);
    }
    if (z[0] < z[1]) {
      c1[Z$7] = z[1];
      c2[Z$7] = z[0];
    } else {
      c1[Z$7] = z[0];
      c2[Z$7] = z[1];
    }
  } else {
    c1[Z$7] = z / 2;
    c2[Z$7] = z / -2;
  }
  return [c1, c2];
};

const computeScale = (
  [ax = 0, ay = 0, az = 0],
  [bx = 0, by = 0, bz = 0]
) => [ax - bx, ay - by, az - bz];

const computeMiddle = (c1, c2) => [
  (c1[X$8] + c2[X$8]) * 0.5,
  (c1[Y$8] + c2[Y$8]) * 0.5,
  (c1[Z$7] + c2[Z$7]) * 0.5,
];

const taggedPoints = (
  { tags = [], matrix, provenance },
  points,
  exactPoints
) => {
  return { type: 'points', tags, matrix, provenance, points, exactPoints };
};

const Point = (x = 0, y = 0, z = 0, coordinate) =>
  taggedPoints({}, [coordinate || [x, y, z]]);

const OrientedPoint = (
  x = 0,
  y = 0,
  z = 0,
  nx = 0,
  ny = 0,
  nz = 1,
  coordinate
) => {
  if (coordinate) {
    [x = 0, y = 0, z = 0, nx = 0, ny = 0, nz = 1] = coordinate;
  }
  // Disorient the point as though the source of a segment.
  const inverse = fromSegmentToInverseTransform(
    [
      [x, y, z],
      [x + nx, y + ny, z + nz],
    ],
    [0, 0, 1]
  );
  const basePoint = transformCoordinate([x, y, z], inverse);
  const matrix = invertTransform(inverse);
  return taggedPoints({ matrix }, [basePoint]);
};

const Points = (coordinates) => taggedPoints({}, coordinates);

const filter$M = (geometry) =>
  ['graph', 'polygonsWithHoles'].includes(geometry.type) &&
  isNotTypeGhost(geometry);

const computeNormal = (geometry) =>
  Group(computeNormal$1(linearize(geometry, filter$M)));

// TODO: Make this more robust.
const computeNormalCoordinate = (geometry) =>
  transformCoordinate([0, 0, 0], computeNormal(geometry).matrix);

const filter$L = (geometry) =>
  ['graph', 'polygonsWithHoles', 'segments', 'points'].includes(
    geometry.type
  ) && isNotTypeGhost(geometry);

const makeAbsolute = (geometry, tags = []) => {
  const inputs = linearize(geometry, filter$L);
  const outputs = makeAbsolute$1(inputs);
  return replacer(inputs, outputs)(geometry);
};

const abs = ([x, y, z]) => [Math.abs(x), Math.abs(y), Math.abs(z)];

const add = ([ax = 0, ay = 0, az = 0], [bx = 0, by = 0, bz = 0]) => [
  ax + bx,
  ay + by,
  az + bz,
];

const squaredLength = ([x = 0, y = 0, z = 0]) => x * x + y * y + z * z;

const length = ([x = 0, y = 0, z = 0]) =>
  Math.sqrt(x * x + y * y + z * z);

const scale = (amount, [x = 0, y = 0, z = 0]) => [
  x * amount,
  y * amount,
  z * amount,
];

const subtract = (
  [ax = 0, ay = 0, az = 0],
  [bx = 0, by = 0, bz = 0]
) => [ax - bx, ay - by, az - bz];

const distance$1 = (a, b) => length(subtract(a, b));

const cross$1 = ([ax = 0, ay = 0, az = 0], [bx = 0, by = 0, bz = 0]) => [
  ay * bz - az * by,
  az * bx - ax * bz,
  ax * by - ay * bx,
];

const normalize$1 = (a) => {
  const [x, y, z] = a;
  const len = x * x + y * y + z * z;
  if (len > 0) {
    // TODO: evaluate use of glm_invsqrt here?
    return scale(1 / Math.sqrt(len), a);
  } else {
    return a;
  }
};

const translate = (geometry, vector) =>
  transform(geometry, fromTranslateToTransform(...vector));

const moveAlong = (geometry, direction, deltas) => {
  const moves = [];
  for (const delta of deltas) {
    moves.push(translate(geometry, scale(delta, direction)));
  }
  return Group(moves);
};

const moveAlongNormal = (geometry, deltas) =>
  moveAlong(geometry, computeNormalCoordinate(geometry), deltas);

const filter$K = (noVoid) => (geometry) =>
  ['graph', 'polygonsWithHoles', 'points', 'segments'].includes(
    geometry.type
  ) &&
  (isNotTypeGhost(geometry) || (!noVoid && isTypeVoid));

const extrude = (geometry, top, bottom, { noVoid } = {}) => {
  const inputs = linearize(geometry, filter$K(noVoid));
  const count = inputs.length;
  inputs.push(top, bottom);
  const outputs = extrude$1(inputs, count, noVoid);
  const result = replacer(inputs, outputs)(geometry);
  return result;
};

// This interface is a bit awkward.
const extrudeAlong = (geometry, vector, intervals, { noVoid } = {}) => {
  const extrusions = [];
  for (const [depth, height] of intervals) {
    if (height === depth) {
      // Return unextruded geometry at this height, instead.
      extrusions.push(moveAlong(geometry, vector, [height]));
      continue;
    }
    extrusions.push(
      extrude(
        geometry,
        moveAlong(Point(0, 0, 0), vector, [height]),
        moveAlong(Point(0, 0, 0), vector, [depth]),
        { noVoid }
      )
    );
  }
  return Group(extrusions);
};

const extrudeAlongNormal = (geometry, intervals, options) => {
  const inputs = [];
  const outputs = [];
  for (const leaf of getLeafs(geometry)) {
    inputs.push(leaf);
    const normal = makeAbsolute(computeNormalCoordinate(leaf));
    outputs.push(extrudeAlong(leaf, normal, intervals, options));
  }
  return replacer(inputs, outputs)(geometry);
};

const extrudeAlongX = (geometry, intervals, options) =>
  extrudeAlong(geometry, [1, 0, 0], intervals, options);

const extrudeAlongY = (geometry, intervals, options) =>
  extrudeAlong(geometry, [0, 1, 0], intervals, options);

const extrudeAlongZ = (geometry, intervals, options) =>
  extrudeAlong(geometry, [0, 0, 1], intervals, options);

// Determines the number of sides required for a circle of diameter such that deviation does not exceed tolerance.
// See: https://math.stackexchange.com/questions/4132060/compute-number-of-regular-polgy-sides-to-approximate-circle-to-defined-precision

// For ellipses, use the major diameter for a convervative result.

const toSidesFromZag = (diameter, tolerance = 1) => {
  const r = diameter / 2;
  const k = tolerance / r;
  const s = Math.ceil(Math.PI / Math.sqrt(k * 2));
  return s;
};

const computeSides = (c1, c2, sides, zag = 0.01) => {
  if (sides) {
    return sides;
  }
  if (zag) {
    const diameter = Math.max(...abs(subtract(c1, c2)));
    return toSidesFromZag(diameter, zag);
  }
  return 32;
};

const filter$J = (geometry) =>
  ['graph', 'polygonsWithHoles', 'segments'].includes(geometry.type) &&
  isNotTypeGhost(geometry);

const fill$1 = (geometry, { holes = false } = {}, tags = []) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter$J, inputs);
  const outputs = fill$2(inputs, holes);
  return taggedGroup({}, ...outputs.map((output) => ({ ...output, tags })));
};

const EPSILON = 1e-5;
const SEQ_KEYS = ['downto', 'from', 'steps', 'to', 'by', 'end', 'upto'];

const seq = (...specs) => {
  const indexes = [];
  for (const spec of specs) {
    let { from = 0, to = 1, by = 1, steps, upto, downto } = spec;

    let consider;

    if (steps !== undefined) {
      if (upto === undefined && downto === undefined) {
        by = (to - from) / steps;
      } else {
        by = ((upto || downto) - from) / (steps - 1);
      }
    }

    if (by > 0) {
      if (upto === undefined) {
        consider = (value) => value < to - EPSILON;
      } else {
        consider = (value) => value <= upto + EPSILON;
      }
    } else if (by < 0) {
      if (downto === undefined) {
        consider = (value) => value > to + EPSILON;
      } else {
        consider = (value) => value >= downto - EPSILON;
      }
    } else {
      throw Error('seq: Expects by != 0');
    }
    const numbers = [];
    for (let number = from, nth = 0; consider(number); number += by, nth++) {
      numbers.push(number);
    }
    indexes.push(numbers);
  }
  const results = [];
  const index = indexes.map(() => 0);
  for (;;) {
    const args = index.map((nth, index) => indexes[index][nth]);
    if (args.some((value) => value === undefined)) {
      break;
    }
    results.push(args);
    let nth;
    for (nth = 0; nth < index.length; nth++) {
      if (++index[nth] < indexes[nth].length) {
        break;
      }
      index[nth] = 0;
    }
    if (nth === index.length) {
      break;
    }
  }

  return results;
};

const isSeqSpec = (value) => {
  if (!(value instanceof Object)) {
    return false;
  }
  let count = 0;
  for (const key of Object.keys(value)) {
    if (!SEQ_KEYS.includes(key)) {
      return false;
    }
    count++;
  }
  if (count === 0) {
    return false;
  }
  return true;
};

const toDiameterFromApothem = (apothem, sides = 32) =>
  apothem / Math.cos(Math.PI / sides);

const X$7 = 0;
const Y$7 = 1;
const Z$6 = 2;

const makeArc =
  (axis = Z$6) =>
  ({ c1, c2, start = 0, end = 1, zag, sides }) => {
    while (start > end) {
      start -= 1;
    }

    const scale = computeScale(c1, c2);
    const middle = computeMiddle(c1, c2);

    const left = c1[X$7];
    const right = c2[X$7];

    const front = c1[Y$7];
    const back = c2[Y$7];

    const bottom = c1[Z$6];
    const top = c2[Z$6];

    const step = 1 / computeSides(c1, c2, sides, zag);
    const steps = Math.ceil((end - start) / step);
    const effectiveStep = (end - start) / steps;

    let spiral = Link(
      seq({
        from: start - 1 / 4,
        upto: end - 1 / 4,
        by: effectiveStep,
      }).map((t) => rotateZ(Point(0.5), t))
    );

    if (
      end - start === 1 ||
      (axis === X$7 && left !== right) ||
      (axis === Y$7 && front !== back) ||
      (axis === Z$6 && top !== bottom)
    ) {
      spiral = fill$1(Loop([spiral]));
    }

    switch (axis) {
      case X$7: {
        scale[X$7] = 1;
        spiral = translate(scale$1(rotateY(spiral, -1 / 4), scale), middle);
        if (left !== right) {
          spiral = extrudeAlongX(spiral, [
            [left - middle[X$7], right - middle[X$7]],
          ]);
        }
        break;
      }
      case Y$7: {
        scale[Y$7] = 1;
        spiral = translate(scale$1(rotateX(spiral, -1 / 4), scale), middle);
        if (front !== back) {
          spiral = extrudeAlongY(spiral, [
            [front - middle[Y$7], back - middle[Y$7]],
          ]);
        }
        break;
      }
      case Z$6: {
        scale[Z$6] = 1;
        spiral = translate(scale$1(spiral, scale), middle);
        if (top !== bottom) {
          spiral = extrudeAlongZ(spiral, [
            [top - middle[Z$6], bottom - middle[Z$6]],
          ]);
        }
        break;
      }
      default: {
        throw Error(`Unhandled Arc axis: ${axis}`);
      }
    }

    return makeAbsolute(spiral);
  };

const makeArcX = makeArc(X$7);
const makeArcY = makeArc(Y$7);
const makeArcZ = makeArc(Z$6);

const ArcOp =
  (type) =>
  ([x, y, z], { apothem, diameter, radius, start, end, sides, zag } = {}) => {
    if (apothem !== undefined) {
      diameter = toDiameterFromApothem(apothem, sides);
    }
    if (radius !== undefined) {
      diameter = radius * 2;
    }
    if (diameter !== undefined) {
      x = diameter;
    }
    let make;
    switch (type) {
      case 'Arc':
      case 'ArcZ':
        if (x === undefined) {
          x = 1;
        }
        if (y === undefined) {
          y = x;
        }
        if (z === undefined) {
          z = 0;
        }
        make = makeArcZ;
        break;
      case 'ArcX':
        if (y === undefined) {
          y = 1;
        }
        if (z === undefined) {
          z = y;
        }
        if (x === undefined) {
          x = 0;
        }
        make = makeArcX;
        break;
      case 'ArcY':
        if (x === undefined) {
          x = 1;
        }
        if (z === undefined) {
          z = x;
        }
        if (y === undefined) {
          y = 0;
        }
        make = makeArcY;
        break;
    }
    const [c1, c2] = buildCorners(x, y, z);
    const result = make({ c1, c2, start, end, sides, zag });
    return result;
  };

const Arc = ArcOp('Arc');
const ArcX = ArcOp('ArcX');
const ArcY = ArcOp('ArcY');
const ArcZ = ArcOp('ArcZ');

const Hexagon = ([x, y, z], options = {}) =>
  Arc([x, y, z], { ...options, sides: 6 });
const Octagon = ([x, y, z], options = {}) =>
  Arc([x, y, z], { ...options, sides: 8 });
const Pentagon = ([x, y, z], options = {}) =>
  Arc([x, y, z], { ...options, sides: 5 });
const Triangle = ([x, y, z], options = {}) =>
  Arc([x, y, z], { ...options, sides: 3 });

const taggedSegments = (
  { tags = [], matrix, provenance, orientation },
  segments
) => {
  return { type: 'segments', tags, matrix, provenance, segments, orientation };
};

const Edge = (s = [0, 0, 0], t = [0, 0, 0], n = [1, 0, 0]) => {
  const inverse = fromSegmentToInverseTransform([s, t], n);
  const baseSegment = [
    transformCoordinate(s, inverse),
    transformCoordinate(t, inverse),
  ];
  const matrix = invertTransform(inverse);
  return taggedSegments({ matrix }, [baseSegment]);
};

const X$6 = 0;
const Y$6 = 1;
const Z$5 = 2;

let fundamentalShapes;

const buildFs = () => {
  if (fundamentalShapes === undefined) {
    const f = fill$1(
      Loop([Point(1, 0, 0), Point(1, 1, 0), Point(0, 1, 0), Point(0, 0, 0)])
    );
    fundamentalShapes = {
      tlfBox: Point(),
      tlBox: Edge([0, 1, 0], [0, 0, 0]),
      tfBox: Edge([0, 0, 0], [1, 0, 0]),
      tBox: f,
      lfBox: Edge([0, 0, 0], [0, 0, 1]),
      lBox: rotateX(rotateZ(rotateY(f, 1 / 4), 1 / 2), -1 / 4),
      fBox: rotateY(rotateZ(rotateX(f, 1 / 4), 1 / 2), -1 / 4),
      box: extrudeAlongZ(f, [[0, 1]]),
    };
  }
  return fundamentalShapes;
};

const makeBox = (corner1, corner2) => {
  const build = () => {
    const fs = buildFs();
    const left = corner2[X$6];
    const right = corner1[X$6];

    const front = corner2[Y$6];
    const back = corner1[Y$6];

    const bottom = corner2[Z$5];
    const top = corner1[Z$5];

    if (top === bottom) {
      if (left === right) {
        if (front === back) {
          // return fs.tlfBox.move(left, front, bottom);
          return translate(fs.tlfBox, [left, front, bottom]);
        } else {
          // return fs.tlBox.sy(back - front).move(left, front, bottom);
          return translate(scale$1(fs.tlBox, [1, back - front, 1]), [
            left,
            front,
            bottom,
          ]);
        }
      } else {
        if (front === back) {
          // return fs.tfBox.sx(right - left).move(left, front, bottom);
          return translate(scale$1(fs.tfBox, [right - left, 1, 1]), [
            left,
            front,
            bottom,
          ]);
        } else {
          /*
          const v1 = fs;
          const v2 = v1.tBox;
          const v3 = v2.sx(right - left);
          const v4 = v3.sy(back - front);
          const v5 = v4.move(left, front, bottom);
          return v5;
          */
          return translate(scale$1(fs.tBox, [right - left, back - front, 1]), [
            left,
            front,
            bottom,
          ]);
        }
      }
    } else {
      if (left === right) {
        if (front === back) {
          // return fs.lfBox.sz(top - bottom).move(left, front, bottom);
          return translate(scale$1(fs.lfBox, [1, 1, top - bottom]), [
            left,
            front,
            bottom,
          ]);
        } else {
          // return fs.lBox.sz(top - bottom).sy(back - front).move(left, front, bottom);
          return translate(scale$1(fs.lBox, [1, back - front, top - bottom]), [
            left,
            front,
            bottom,
          ]);
        }
      } else {
        if (front === back) {
          // return fs.fBox.sz(top - bottom).sx(right - left).move(left, front, bottom);
          return translate(scale$1(fs.fBox, [right - left, 1, top - bottom]), [
            left,
            front,
            bottom,
          ]);
        } else {
          // return fs.box.sz(top - bottom).sx(right - left).sy(back - front).move(left, front, bottom);
          return translate(
            scale$1(fs.box, [right - left, back - front, top - bottom]),
            [left, front, bottom]
          );
        }
      }
    }
  };

  return makeAbsolute(build());
};

const Box = ([x, y, z], options = {}) => {
  const [computedC1, computedC2] = buildCorners(x, y, z);
  const { c1 = computedC1, c2 = computedC2 } = options;
  return makeBox(c1, c2);
};

const filter$I = (geometry) =>
  ['graph', 'polygonsWithHoles', 'segments'].includes(geometry.type) &&
  isNotTypeGhost(geometry);

const Fuse = (geometries, { exact } = {}) => {
  const inputs = [];
  for (const geometry of geometries) {
    linearize(geometry, filter$I, inputs);
  }
  const outputs = fuse$1(inputs, exact);
  return Group(outputs);
};

const fuse = (geometry, geometries, { exact } = {}) =>
  Fuse([geometry, ...geometries], { exact });

const filter$H = (geometry) =>
  ['graph', 'polygonsWithHoles', 'segments', 'points'].includes(geometry.type);

const ConvexHull = (geometries) => {
  const inputs = [];
  for (const geometry of geometries) {
    linearize(geometry, filter$H, inputs);
  }
  const outputs = convexHull$1(inputs);
  return Group(outputs);
};

const convexHull = (geometry, geometries) =>
  ConvexHull([geometry, ...geometries]);

const ChainConvexHull = (geometries, { close = false } = {}) => {
  const chain = [];
  for (let nth = 1; nth < geometries.length; nth++) {
    chain.push(ConvexHull([geometries[nth - 1], geometries[nth]]));
  }
  if (close) {
    chain.push(ConvexHull([geometries[geometries.length - 1], geometries[0]]));
  }
  return Fuse(chain);
};

const chainConvexHull = (geometry, geometries, { close = false } = {}) =>
  ChainConvexHull([geometry, ...geometries], { close });

const filter$G = (geometry) =>
  ['graph', 'polygonsWithHoles'].includes(geometry.type) &&
  isNotTypeGhost(geometry) &&
  isNotTypeVoid(geometry);

const ComputeSkeleton = (geometries) => {
  const inputs = [];
  for (const geometry of geometries) {
    linearize(geometry, filter$G, inputs);
  }
  const outputs = computeSkeleton$1(inputs);
  return Group(outputs);
};

const computeSkeleton = (geometry, geometries) =>
  ComputeSkeleton([geometry, ...geometries]);

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var extendStatics=function(d,b){return extendStatics=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(d,b){d.__proto__=b;}||function(d,b){for(var p in b)b.hasOwnProperty(p)&&(d[p]=b[p]);},extendStatics(d,b)};function __extends(d,b){function __(){this.constructor=d;}extendStatics(d,b),d.prototype=null===b?Object.create(b):(__.prototype=b.prototype,new __);}var __assign=function(){return __assign=Object.assign||function(t){for(var s,i=1,n=arguments.length;i<n;i++)for(var p in s=arguments[i])Object.prototype.hasOwnProperty.call(s,p)&&(t[p]=s[p]);return t},__assign.apply(this,arguments)};function extrapolateControlPoint(u,v){for(var e=new Array(u.length),i=0;i<u.length;i++)e[i]=2*u[i]-v[i];return e}function getControlPoints(idx,points,closed){var p0,p1,p2,p3,maxIndex=points.length-1;if(closed)p0=points[idx-1<0?maxIndex:idx-1],p1=points[idx%points.length],p2=points[(idx+1)%points.length],p3=points[(idx+2)%points.length];else {if(idx===maxIndex)throw Error("There is no spline segment at this index for a closed curve!");p1=points[idx],p2=points[idx+1],p0=idx>0?points[idx-1]:extrapolateControlPoint(p1,p2),p3=idx<maxIndex-1?points[idx+2]:extrapolateControlPoint(p2,p1);}return [p0,p1,p2,p3]}function getSegmentIndexAndT(ct,points,closed){void 0===closed&&(closed=!1);var nPoints=closed?points.length:points.length-1;if(1===ct)return {index:nPoints-1,weight:1};var p=nPoints*ct,index=Math.floor(p);return {index:index,weight:p-index}}function fill(v,val){for(var i=0;i<v.length;i++)v[i]=val;return v}function map(v,func){for(var i=0;i<v.length;i++)v[i]=func(v[i],i);return v}function reduce(v,func,r){void 0===r&&(r=0);for(var i=0;i<v.length;i++)r=func(r,v[i],i);return r}function copyValues(source,target){target=target||new Array(source.length);for(var i=0;i<source.length;i++)target[i]=source[i];return target}function clamp(value,min,max){return void 0===min&&(min=0),void 0===max&&(max=1),value<min?min:value>max?max:value}function binarySearch(targetValue,accumulatedValues){var min=accumulatedValues[0];if(targetValue>=accumulatedValues[accumulatedValues.length-1])return accumulatedValues.length-1;if(targetValue<=min)return 0;for(var left=0,right=accumulatedValues.length-1;left<=right;){var mid=Math.floor((left+right)/2),lMid=accumulatedValues[mid];if(lMid<targetValue)left=mid+1;else {if(!(lMid>targetValue))return mid;right=mid-1;}}return Math.max(0,right)}var EPS=Math.pow(2,-42);function cuberoot(x){var y=Math.pow(Math.abs(x),1/3);return x<0?-y:y}function getQuadRoots(a,b,c){if(Math.abs(a)<EPS)return Math.abs(b)<EPS?[]:[-c/b];var D=b*b-4*a*c;return Math.abs(D)<EPS?[-b/(2*a)]:D>0?[(-b+Math.sqrt(D))/(2*a),(-b-Math.sqrt(D))/(2*a)]:[]}function getCubicRoots(a,b,c,d){if(Math.abs(a)<EPS)return getQuadRoots(b,c,d);var roots,p=(3*a*c-b*b)/(3*a*a),q=(2*b*b*b-9*a*b*c+27*a*a*d)/(27*a*a*a);if(Math.abs(p)<EPS)roots=[cuberoot(-q)];else if(Math.abs(q)<EPS)roots=[0].concat(p<0?[Math.sqrt(-p),-Math.sqrt(-p)]:[]);else {var D=q*q/4+p*p*p/27;if(Math.abs(D)<EPS)roots=[-1.5*q/p,3*q/p];else if(D>0){roots=[(u=cuberoot(-q/2-Math.sqrt(D)))-p/(3*u)];}else {var u=2*Math.sqrt(-p/3),t=Math.acos(3*q/p/u)/3,k=2*Math.PI/3;roots=[u*Math.cos(t),u*Math.cos(t-k),u*Math.cos(t-2*k)];}}for(var i=0;i<roots.length;i++)roots[i]-=b/(3*a);return roots}function dot(v1,v2){if(v1.length!==v2.length)throw Error("Vectors must be of equal length!");for(var p=0,k=0;k<v1.length;k++)p+=v1[k]*v2[k];return p}function cross(v1,v2,target){if(!(v1.length>3)){target=target||new Array(3);var ax=v1[0],ay=v1[1],az=v1[2]||0,bx=v2[0],by=v2[1],bz=v2[2]||0;return target[0]=ay*bz-az*by,target[1]=az*bx-ax*bz,target[2]=ax*by-ay*bx,target}}function sumOfSquares(v1,v2){for(var sumOfSquares=0,i=0;i<v1.length;i++)sumOfSquares+=(v1[i]-v2[i])*(v1[i]-v2[i]);return sumOfSquares}function magnitude(v){for(var sumOfSquares=0,i=0;i<v.length;i++)sumOfSquares+=v[i]*v[i];return Math.sqrt(sumOfSquares)}function distance(p1,p2){var sqrs=sumOfSquares(p1,p2);return 0===sqrs?0:Math.sqrt(sqrs)}function normalize(v,target){var u=target?copyValues(v,target):v,squared=reduce(u,(function(s,c){return s+Math.pow(c,2)})),l=Math.sqrt(squared);return 0===l?fill(u,0):map(u,(function(c){return c/l}))}function rotate3d(vector,axis,angle,target){void 0===axis&&(axis=[0,1,0]),void 0===angle&&(angle=0);var c=Math.cos(angle),s=Math.sin(angle),t=1-c,vx=vector[0],vy=vector[1],vz=vector[2],ax=axis[0],ay=axis[1],az=axis[2],tx=t*ax,ty=t*ay;return (target=target||vector)[0]=(tx*ax+c)*vx+(tx*ay-s*az)*vy+(tx*az+s*ay)*vz,target[1]=(tx*ay+s*az)*vx+(ty*ay+c)*vy+(ty*az-s*ax)*vz,target[2]=(tx*az-s*ay)*vx+(ty*az+s*ax)*vy+(t*az*az+c)*vz,target}function calcKnotSequence(p0,p1,p2,p3,alpha){if(void 0===alpha&&(alpha=0),0===alpha)return [0,1,2,3];var deltaT=function(u,v){return Math.pow(sumOfSquares(u,v),.5*alpha)},t1=deltaT(p1,p0),t2=deltaT(p2,p1)+t1;return [0,t1,t2,deltaT(p3,p2)+t2]}function calculateCoefficients(p0,p1,p2,p3,options){for(var tension=Number.isFinite(options.tension)?options.tension:.5,alpha=Number.isFinite(options.alpha)?options.alpha:null,knotSequence=alpha>0?calcKnotSequence(p0,p1,p2,p3,alpha):null,coefficientsList=new Array(p0.length),k=0;k<p0.length;k++){var u=0,v=0,v0=p0[k],v1=p1[k],v2=p2[k],v3=p3[k];if(knotSequence){var t0=knotSequence[0],t1=knotSequence[1],t2=knotSequence[2],t3=knotSequence[3];t1-t2!=0&&(t0-t1!=0&&t0-t2!=0&&(u=(1-tension)*(t2-t1)*((v0-v1)/(t0-t1)-(v0-v2)/(t0-t2)+(v1-v2)/(t1-t2))),t1-t3!=0&&t2-t3!=0&&(v=(1-tension)*(t2-t1)*((v1-v2)/(t1-t2)-(v1-v3)/(t1-t3)+(v2-v3)/(t2-t3))));}else u=(1-tension)*(v2-v0)*.5,v=(1-tension)*(v3-v1)*.5;var a=2*v1-2*v2+u+v,b=-3*v1+3*v2-2*u-v,c=u,d=v1;coefficientsList[k]=[a,b,c,d];}return coefficientsList}function valueAtT(t,coefficients){var t2=t*t,t3=t*t2;return coefficients[0]*t3+coefficients[1]*t2+coefficients[2]*t+coefficients[3]}function derivativeAtT(t,coefficients){var t2=t*t;return 3*coefficients[0]*t2+2*coefficients[1]*t+coefficients[2]}function secondDerivativeAtT(t,coefficients){return 6*coefficients[0]*t+2*coefficients[1]}function findRootsOfT(lookup,coefficients){var a=coefficients[0],b=coefficients[1],c=coefficients[2],x=coefficients[3]-lookup;return 0===a&&0===b&&0===c&&0===x?[0]:getCubicRoots(a,b,c,x).filter((function(t){return t>-EPS&&t<=1+EPS})).map((function(t){return clamp(t,0,1)}))}function evaluateForT(func,t,coefficients,target){void 0===target&&(target=null),target=target||new Array(coefficients.length);for(var k=0;k<coefficients.length;k++)target[k]=func(t,coefficients[k]);return target}var AbstractCurveMapper=function(){function AbstractCurveMapper(onInvalidateCache){void 0===onInvalidateCache&&(onInvalidateCache=null),this._alpha=0,this._tension=.5,this._closed=!1,this._onInvalidateCache=null,this._onInvalidateCache=onInvalidateCache,this._cache={arcLengths:null,coefficients:null};}return AbstractCurveMapper.prototype._invalidateCache=function(){this.points&&(this._cache={arcLengths:null,coefficients:null},this._onInvalidateCache&&this._onInvalidateCache());},Object.defineProperty(AbstractCurveMapper.prototype,"alpha",{get:function(){return this._alpha},set:function(alpha){Number.isFinite(alpha)&&alpha!==this._alpha&&(this._invalidateCache(),this._alpha=alpha);},enumerable:!1,configurable:!0}),Object.defineProperty(AbstractCurveMapper.prototype,"tension",{get:function(){return this._tension},set:function(tension){Number.isFinite(tension)&&tension!==this._tension&&(this._invalidateCache(),this._tension=tension);},enumerable:!1,configurable:!0}),Object.defineProperty(AbstractCurveMapper.prototype,"points",{get:function(){return this._points},set:function(points){if(!points||points.length<2)throw Error("At least 2 control points are required!");this._points=points,this._invalidateCache();},enumerable:!1,configurable:!0}),Object.defineProperty(AbstractCurveMapper.prototype,"closed",{get:function(){return this._closed},set:function(closed){closed=!!closed,this._closed!==closed&&(this._invalidateCache(),this._closed=closed);},enumerable:!1,configurable:!0}),AbstractCurveMapper.prototype.reset=function(){this._invalidateCache();},AbstractCurveMapper.prototype.evaluateForT=function(func,t,target){var _a=getSegmentIndexAndT(t,this.points,this.closed),index=_a.index;return evaluateForT(func,_a.weight,this.getCoefficients(index),target)},AbstractCurveMapper.prototype.getCoefficients=function(idx){if(this.points){if(this._cache.coefficients||(this._cache.coefficients=new Map),!this._cache.coefficients.has(idx)){var _a=getControlPoints(idx,this.points,this.closed),coefficients=calculateCoefficients(_a[0],_a[1],_a[2],_a[3],{tension:this.tension,alpha:this.alpha});this._cache.coefficients.set(idx,coefficients);}return this._cache.coefficients.get(idx)}},AbstractCurveMapper}(),SegmentedCurveMapper=function(_super){function SegmentedCurveMapper(subDivisions,onInvalidateCache){void 0===subDivisions&&(subDivisions=300),void 0===onInvalidateCache&&(onInvalidateCache=null);var _this=_super.call(this,onInvalidateCache)||this;return _this._subDivisions=subDivisions,_this}return __extends(SegmentedCurveMapper,_super),Object.defineProperty(SegmentedCurveMapper.prototype,"arcLengths",{get:function(){return this._cache.arcLengths||(this._cache.arcLengths=this.computeArcLengths()),this._cache.arcLengths},enumerable:!1,configurable:!0}),SegmentedCurveMapper.prototype._invalidateCache=function(){_super.prototype._invalidateCache.call(this),this._cache.arcLengths=null;},SegmentedCurveMapper.prototype.computeArcLengths=function(){var current,lengths=[],last=this.evaluateForT(valueAtT,0),sum=0;lengths.push(0);for(var p=1;p<=this._subDivisions;p++)sum+=distance(current=this.evaluateForT(valueAtT,p/this._subDivisions),last),lengths.push(sum),last=current;return lengths},SegmentedCurveMapper.prototype.lengthAt=function(u){var arcLengths=this.arcLengths;return u*arcLengths[arcLengths.length-1]},SegmentedCurveMapper.prototype.getT=function(u){var arcLengths=this.arcLengths,il=arcLengths.length,targetArcLength=u*arcLengths[il-1],i=binarySearch(targetArcLength,arcLengths);if(arcLengths[i]===targetArcLength)return i/(il-1);var lengthBefore=arcLengths[i];return (i+(targetArcLength-lengthBefore)/(arcLengths[i+1]-lengthBefore))/(il-1)},SegmentedCurveMapper.prototype.getU=function(t){if(0===t)return 0;if(1===t)return 1;var arcLengths=this.arcLengths,al=arcLengths.length-1,totalLength=arcLengths[al],tIdx=t*al,subIdx=Math.floor(tIdx),l1=arcLengths[subIdx];if(tIdx===subIdx)return l1/totalLength;var t0=subIdx/al;return (l1+distance(this.evaluateForT(valueAtT,t0),this.evaluateForT(valueAtT,t)))/totalLength},SegmentedCurveMapper}(AbstractCurveMapper),lut=[[[-.906179845938664,.23692688505618908],[-.5384693101056831,.47862867049936647],[0,.5688888888888889],[.5384693101056831,.47862867049936647],[.906179845938664,.23692688505618908]],[[-.932469514203152,.17132449237917036],[-.6612093864662645,.3607615730481386],[-.2386191860831969,.46791393457269104],[.2386191860831969,.46791393457269104],[.6612093864662645,.3607615730481386],[.932469514203152,.17132449237917036]],[[-.9491079123427585,.1294849661688697],[-.7415311855993945,.27970539148927664],[-.4058451513773972,.3818300505051189],[0,.4179591836734694],[.4058451513773972,.3818300505051189],[.7415311855993945,.27970539148927664],[.9491079123427585,.1294849661688697]],[[-.9602898564975363,.10122853629037626],[-.7966664774136267,.22238103445337448],[-.525532409916329,.31370664587788727],[-.1834346424956498,.362683783378362],[.1834346424956498,.362683783378362],[.525532409916329,.31370664587788727],[.7966664774136267,.22238103445337448],[.9602898564975363,.10122853629037626]],[[-.9681602395076261,.08127438836157441],[-.8360311073266358,.1806481606948574],[-.6133714327005904,.26061069640293544],[-.3242534234038089,.31234707704000286],[0,.3302393550012598],[.3242534234038089,.31234707704000286],[.6133714327005904,.26061069640293544],[.8360311073266358,.1806481606948574],[.9681602395076261,.08127438836157441]],[[-.9739065285171717,.06667134430868814],[-.8650633666889845,.1494513491505806],[-.6794095682990244,.21908636251598204],[-.4333953941292472,.26926671930999635],[-.14887433898163122,.29552422471475287],[.14887433898163122,.29552422471475287],[.4333953941292472,.26926671930999635],[.6794095682990244,.21908636251598204],[.8650633666889845,.1494513491505806],[.9739065285171717,.06667134430868814]],[[-.978228658146056,.0556685671161736],[-.887062599768095,.125580369464904],[-.730152005574049,.186290210927734],[-.519096129206811,.23319376459199],[-.269543155952344,.262804544510246],[0,.2729250867779],[.269543155952344,.262804544510246],[.519096129206811,.23319376459199],[.730152005574049,.186290210927734],[.887062599768095,.125580369464904],[.978228658146056,.0556685671161736]],[[-.981560634246719,.0471753363865118],[-.904117256370474,.106939325995318],[-.769902674194304,.160078328543346],[-.587317954286617,.203167426723065],[-.36783149899818,.233492536538354],[-.125233408511468,.249147045813402],[.125233408511468,.249147045813402],[.36783149899818,.233492536538354],[.587317954286617,.203167426723065],[.769902674194304,.160078328543346],[.904117256370474,.106939325995318],[.981560634246719,.0471753363865118]],[[-.984183054718588,.0404840047653158],[-.917598399222977,.0921214998377284],[-.801578090733309,.138873510219787],[-.64234933944034,.178145980761945],[-.448492751036446,.207816047536888],[-.230458315955134,.226283180262897],[0,.232551553230873],[.230458315955134,.226283180262897],[.448492751036446,.207816047536888],[.64234933944034,.178145980761945],[.801578090733309,.138873510219787],[.917598399222977,.0921214998377284],[.984183054718588,.0404840047653158]],[[-.986283808696812,.0351194603317518],[-.928434883663573,.0801580871597602],[-.827201315069764,.121518570687903],[-.687292904811685,.157203167158193],[-.515248636358154,.185538397477937],[-.319112368927889,.205198463721295],[-.108054948707343,.215263853463157],[.108054948707343,.215263853463157],[.319112368927889,.205198463721295],[.515248636358154,.185538397477937],[.687292904811685,.157203167158193],[.827201315069764,.121518570687903],[.928434883663573,.0801580871597602],[.986283808696812,.0351194603317518]],[[-.987992518020485,.0307532419961172],[-.937273392400705,.0703660474881081],[-.848206583410427,.107159220467171],[-.72441773136017,.139570677926154],[-.570972172608538,.166269205816993],[-.394151347077563,.186161000015562],[-.201194093997434,.198431485327111],[0,.202578241925561],[.201194093997434,.198431485327111],[.394151347077563,.186161000015562],[.570972172608538,.166269205816993],[.72441773136017,.139570677926154],[.848206583410427,.107159220467171],[.937273392400705,.0703660474881081],[.987992518020485,.0307532419961172]],[[-.989400934991649,.027152459411754],[-.944575023073232,.0622535239386478],[-.865631202387831,.0951585116824927],[-.755404408355003,.124628971255533],[-.617876244402643,.149595988816576],[-.458016777657227,.169156519395002],[-.281603550779258,.182603415044923],[-.0950125098376374,.189450610455068],[.0950125098376374,.189450610455068],[.281603550779258,.182603415044923],[.458016777657227,.169156519395002],[.617876244402643,.149595988816576],[.755404408355003,.124628971255533],[.865631202387831,.0951585116824927],[.944575023073232,.0622535239386478],[.989400934991649,.027152459411754]],[[-.990575475314417,.0241483028685479],[-.950675521768767,.0554595293739872],[-.880239153726985,.0850361483171791],[-.781514003896801,.111883847193403],[-.65767115921669,.135136368468525],[-.512690537086476,.15404576107681],[-.351231763453876,.16800410215645],[-.178484181495847,.176562705366992],[0,.179446470356206],[.178484181495847,.176562705366992],[.351231763453876,.16800410215645],[.512690537086476,.15404576107681],[.65767115921669,.135136368468525],[.781514003896801,.111883847193403],[.880239153726985,.0850361483171791],[.950675521768767,.0554595293739872],[.990575475314417,.0241483028685479]],[[-.99156516842093,.0216160135264833],[-.955823949571397,.0497145488949698],[-.892602466497555,.076425730254889],[-.803704958972523,.100942044106287],[-.691687043060353,.122555206711478],[-.559770831073947,.14064291467065],[-.411751161462842,.154684675126265],[-.251886225691505,.164276483745832],[-.0847750130417353,.169142382963143],[.0847750130417353,.169142382963143],[.251886225691505,.164276483745832],[.411751161462842,.154684675126265],[.559770831073947,.14064291467065],[.691687043060353,.122555206711478],[.803704958972523,.100942044106287],[.892602466497555,.076425730254889],[.955823949571397,.0497145488949697],[.99156516842093,.0216160135264833]],[[-.992406843843584,.0194617882297264],[-.96020815213483,.0448142267656996],[-.903155903614817,.0690445427376412],[-.822714656537142,.0914900216224499],[-.720966177335229,.111566645547333],[-.600545304661681,.128753962539336],[-.46457074137596,.142606702173606],[-.316564099963629,.152766042065859],[-.160358645640225,.158968843393954],[0,.161054449848783],[.160358645640225,.158968843393954],[.316564099963629,.152766042065859],[.46457074137596,.142606702173606],[.600545304661681,.128753962539336],[.720966177335229,.111566645547333],[.822714656537142,.0914900216224499],[.903155903614817,.0690445427376412],[.96020815213483,.0448142267656996],[.992406843843584,.0194617882297264]],[[-.993128599185094,.0176140071391521],[-.963971927277913,.0406014298003869],[-.912234428251325,.062672048334109],[-.839116971822218,.0832767415767047],[-.74633190646015,.10193011981724],[-.636053680726515,.118194531961518],[-.510867001950827,.131688638449176],[-.373706088715419,.142096109318382],[-.227785851141645,.149172986472603],[-.0765265211334973,.152753387130725],[.0765265211334973,.152753387130725],[.227785851141645,.149172986472603],[.373706088715419,.142096109318382],[.510867001950827,.131688638449176],[.636053680726515,.118194531961518],[.74633190646015,.10193011981724],[.839116971822218,.0832767415767047],[.912234428251325,.062672048334109],[.963971927277913,.0406014298003869],[.993128599185094,.0176140071391521]],[[-.993752170620389,.0160172282577743],[-.967226838566306,.0369537897708524],[-.9200993341504,.0571344254268572],[-.853363364583317,.0761001136283793],[-.768439963475677,.0934444234560338],[-.667138804197412,.108797299167148],[-.551618835887219,.121831416053728],[-.424342120207438,.132268938633337],[-.288021316802401,.139887394791073],[-.145561854160895,.14452440398997],[0,.14608113364969],[.145561854160895,.14452440398997],[.288021316802401,.139887394791073],[.424342120207438,.132268938633337],[.551618835887219,.121831416053728],[.667138804197412,.108797299167148],[.768439963475677,.0934444234560338],[.853363364583317,.0761001136283793],[.9200993341504,.0571344254268572],[.967226838566306,.0369537897708524],[.993752170620389,.0160172282577743]],[[-.994294585482399,.0146279952982722],[-.970060497835428,.0337749015848141],[-.926956772187174,.0522933351526832],[-.8658125777203,.0697964684245204],[-.787816805979208,.0859416062170677],[-.694487263186682,.10041414444288],[-.587640403506911,.112932296080539],[-.469355837986757,.123252376810512],[-.341935820892084,.131173504787062],[-.207860426688221,.136541498346015],[-.0697392733197222,.139251872855631],[.0697392733197222,.139251872855631],[.207860426688221,.136541498346015],[.341935820892084,.131173504787062],[.469355837986757,.123252376810512],[.587640403506911,.112932296080539],[.694487263186682,.10041414444288],[.787816805979208,.0859416062170677],[.8658125777203,.0697964684245204],[.926956772187174,.0522933351526832],[.970060497835428,.0337749015848141],[.994294585482399,.0146279952982722]],[[-.994769334997552,.0134118594871417],[-.972542471218115,.0309880058569794],[-.932971086826016,.0480376717310846],[-.876752358270441,.0642324214085258],[-.804888401618839,.0792814117767189],[-.71866136313195,.0929157660600351],[-.619609875763646,.104892091464541],[-.509501477846007,.114996640222411],[-.39030103803029,.123049084306729],[-.264135680970344,.128905722188082],[-.133256824298466,.132462039404696],[0,.133654572186106],[.133256824298466,.132462039404696],[.264135680970344,.128905722188082],[.39030103803029,.123049084306729],[.509501477846007,.114996640222411],[.619609875763646,.104892091464541],[.71866136313195,.0929157660600351],[.804888401618839,.0792814117767189],[.876752358270441,.0642324214085258],[.932971086826016,.0480376717310846],[.972542471218115,.0309880058569794],[.994769334997552,.0134118594871417]],[[-.995187219997021,.0123412297999872],[-.974728555971309,.0285313886289336],[-.938274552002732,.0442774388174198],[-.886415527004401,.0592985849154367],[-.820001985973902,.0733464814110803],[-.740124191578554,.0861901615319532],[-.648093651936975,.0976186521041138],[-.545421471388839,.107444270115965],[-.433793507626045,.115505668053725],[-.315042679696163,.121670472927803],[-.191118867473616,.125837456346828],[-.0640568928626056,.127938195346752],[.0640568928626056,.127938195346752],[.191118867473616,.125837456346828],[.315042679696163,.121670472927803],[.433793507626045,.115505668053725],[.545421471388839,.107444270115965],[.648093651936975,.0976186521041138],[.740124191578554,.0861901615319532],[.820001985973902,.0733464814110803],[.886415527004401,.0592985849154367],[.938274552002732,.0442774388174198],[.974728555971309,.0285313886289336],[.995187219997021,.0123412297999872]],[[-.995556969790498,.0113937985010262],[-.976663921459517,.0263549866150321],[-.942974571228974,.0409391567013063],[-.894991997878275,.0549046959758351],[-.833442628760834,.0680383338123569],[-.759259263037357,.080140700335001],[-.673566368473468,.0910282619829636],[-.577662930241222,.10053594906705],[-.473002731445714,.108519624474263],[-.361172305809387,.114858259145711],[-.243866883720988,.119455763535784],[-.12286469261071,.12224244299031],[0,.123176053726715],[.12286469261071,.12224244299031],[.243866883720988,.119455763535784],[.361172305809387,.114858259145711],[.473002731445714,.108519624474263],[.577662930241222,.10053594906705],[.673566368473468,.0910282619829636],[.759259263037357,.080140700335001],[.833442628760834,.0680383338123569],[.894991997878275,.0549046959758351],[.942974571228974,.0409391567013063],[.976663921459517,.0263549866150321],[.995556969790498,.0113937985010262]],[[-.995885701145616,.010551372617343],[-.97838544595647,.0244178510926319],[-.947159066661714,.0379623832943627],[-.902637861984307,.0509758252971478],[-.845445942788498,.0632740463295748],[-.776385948820678,.0746841497656597],[-.696427260419957,.0850458943134852],[-.606692293017618,.0942138003559141],[-.508440714824505,.102059161094425],[-.403051755123486,.108471840528576],[-.292004839485956,.113361816546319],[-.17685882035689,.116660443485296],[-.0592300934293132,.118321415279262],[.0592300934293132,.118321415279262],[.17685882035689,.116660443485296],[.292004839485956,.113361816546319],[.403051755123486,.108471840528576],[.508440714824505,.102059161094425],[.606692293017618,.0942138003559141],[.696427260419957,.0850458943134852],[.776385948820678,.0746841497656597],[.845445942788498,.0632740463295748],[.902637861984307,.0509758252971478],[.947159066661714,.0379623832943627],[.97838544595647,.0244178510926319],[.995885701145616,.010551372617343]],[[-.996179262888988,.00979899605129436],[-.979923475961501,.0226862315961806],[-.950900557814705,.0352970537574197],[-.909482320677491,.047449412520615],[-.856207908018294,.0589835368598335],[-.791771639070508,.0697488237662455],[-.717013473739423,.0796048677730577],[-.632907971946495,.0884231585437569],[-.540551564579456,.0960887273700285],[-.441148251750026,.102501637817745],[-.335993903638508,.107578285788533],[-.226459365439536,.111252488356845],[-.113972585609529,.113476346108965],[0,.114220867378956],[.113972585609529,.113476346108965],[.226459365439536,.111252488356845],[.335993903638508,.107578285788533],[.441148251750026,.102501637817745],[.540551564579456,.0960887273700285],[.632907971946495,.0884231585437569],[.717013473739423,.0796048677730577],[.791771639070508,.0697488237662455],[.856207908018294,.0589835368598336],[.909482320677491,.047449412520615],[.950900557814705,.0352970537574197],[.979923475961501,.0226862315961806],[.996179262888988,.00979899605129436]],[[-.996442497573954,.00912428259309452],[-.981303165370872,.0211321125927712],[-.954259280628938,.0329014277823043],[-.915633026392132,.0442729347590042],[-.865892522574395,.0551073456757167],[-.805641370917179,.0652729239669995],[-.735610878013631,.0746462142345687],[-.656651094038864,.0831134172289012],[-.569720471811401,.0905717443930328],[-.475874224955118,.0969306579979299],[-.376251516089078,.10211296757806],[-.272061627635178,.106055765922846],[-.16456928213338,.108711192258294],[-.0550792898840342,.110047013016475],[.0550792898840342,.110047013016475],[.16456928213338,.108711192258294],[.272061627635178,.106055765922846],[.376251516089078,.10211296757806],[.475874224955118,.0969306579979299],[.569720471811401,.0905717443930328],[.656651094038864,.0831134172289012],[.735610878013631,.0746462142345687],[.805641370917179,.0652729239669995],[.865892522574395,.0551073456757167],[.915633026392132,.0442729347590042],[.954259280628938,.0329014277823043],[.981303165370872,.0211321125927712],[.996442497573954,.00912428259309452]],[[-.996679442260596,.00851690387874641],[-.982545505261413,.0197320850561227],[-.957285595778087,.0307404922020936],[-.921180232953058,.0414020625186828],[-.874637804920102,.0515948269024979],[-.818185487615252,.0612030906570791],[-.752462851734477,.0701179332550512],[-.678214537602686,.0782383271357637],[-.596281797138227,.0854722573661725],[-.507592955124227,.0917377571392587],[-.413152888174008,.0969638340944086],[-.314031637867639,.101091273759914],[-.211352286166001,.104073310077729],[-.106278230132679,.10587615509732],[0,.106479381718314],[.106278230132679,.10587615509732],[.211352286166001,.104073310077729],[.314031637867639,.101091273759914],[.413152888174008,.0969638340944086],[.507592955124227,.0917377571392587],[.596281797138227,.0854722573661725],[.678214537602686,.0782383271357637],[.752462851734477,.0701179332550512],[.818185487615252,.0612030906570791],[.874637804920102,.0515948269024979],[.921180232953058,.0414020625186828],[.957285595778087,.0307404922020936],[.982545505261413,.0197320850561227],[.996679442260596,.00851690387874641]],[[-.996893484074649,.0079681924961666],[-.983668123279747,.0184664683110909],[-.960021864968307,.0287847078833233],[-.926200047429274,.038799192569627],[-.882560535792052,.048402672830594],[-.829565762382768,.057493156217619],[-.767777432104826,.0659742298821805],[-.697850494793315,.0737559747377052],[-.620526182989242,.0807558952294202],[-.536624148142019,.0868997872010829],[-.447033769538089,.0921225222377861],[-.352704725530878,.0963687371746442],[-.254636926167889,.0995934205867952],[-.153869913608583,.101762389748405],[-.0514718425553176,.102852652893558],[.0514718425553176,.102852652893558],[.153869913608583,.101762389748405],[.254636926167889,.0995934205867952],[.352704725530878,.0963687371746442],[.447033769538089,.0921225222377861],[.536624148142019,.0868997872010829],[.620526182989242,.0807558952294202],[.697850494793315,.0737559747377052],[.767777432104826,.0659742298821805],[.829565762382768,.057493156217619],[.882560535792052,.048402672830594],[.926200047429274,.038799192569627],[.960021864968307,.0287847078833233],[.983668123279747,.0184664683110909],[.996893484074649,.0079681924961666]]],maxOrder=lut.length+5;var NumericalCurveMapper=function(_super){function NumericalCurveMapper(nQuadraturePoints,nInverseSamples,onInvalidateCache){void 0===nQuadraturePoints&&(nQuadraturePoints=24),void 0===nInverseSamples&&(nInverseSamples=21);var _this=_super.call(this,onInvalidateCache)||this;return _this._nSamples=21,_this._gauss=function(order){if(order<5||order>maxOrder)throw Error("Order for Gaussian Quadrature must be in the range of ".concat(5," and ").concat(maxOrder,"."));return lut[order-5]}(nQuadraturePoints),_this._nSamples=nInverseSamples,_this}return __extends(NumericalCurveMapper,_super),NumericalCurveMapper.prototype._invalidateCache=function(){_super.prototype._invalidateCache.call(this),this._cache.arcLengths=null,this._cache.samples=null;},Object.defineProperty(NumericalCurveMapper.prototype,"arcLengths",{get:function(){return this._cache.arcLengths||(this._cache.arcLengths=this.computeArcLengths()),this._cache.arcLengths},enumerable:!1,configurable:!0}),NumericalCurveMapper.prototype.getSamples=function(idx){if(this.points){if(this._cache.samples||(this._cache.samples=new Map),!this._cache.samples.has(idx)){for(var samples=this._nSamples,lengths=[],slopes=[],coefficients=this.getCoefficients(idx),i=0;i<samples;++i){var ti=i/(samples-1);lengths.push(this.computeArcLength(idx,0,ti));var dtln=magnitude(evaluateForT(derivativeAtT,ti,coefficients)),slope=0===dtln?0:1/dtln;this.tension>.95&&(slope=clamp(slope,-1,1)),slopes.push(slope);}var nCoeff=samples-1,dis=[],cis=[],li_prev=lengths[0],tdi_prev=slopes[0],step=1/nCoeff;for(i=0;i<nCoeff;++i){var li=li_prev,lDiff=(li_prev=lengths[i+1])-li,tdi=tdi_prev,tdi_next=slopes[i+1];tdi_prev=tdi_next;var si=step/lDiff,di=(tdi+tdi_next-2*si)/(lDiff*lDiff),ci=(3*si-2*tdi-tdi_next)/lDiff;dis.push(di),cis.push(ci);}this._cache.samples.set(idx,[lengths,slopes,cis,dis]);}return this._cache.samples.get(idx)}},NumericalCurveMapper.prototype.computeArcLength=function(index,t0,t1){if(void 0===t0&&(t0=0),void 0===t1&&(t1=1),t0===t1)return 0;for(var coefficients=this.getCoefficients(index),z=.5*(t1-t0),sum=0,i=0;i<this._gauss.length;i++){var _a=this._gauss[i],T=_a[0];sum+=_a[1]*magnitude(evaluateForT(derivativeAtT,z*T+z+t0,coefficients));}return z*sum},NumericalCurveMapper.prototype.computeArcLengths=function(){if(this.points){var lengths=[];lengths.push(0);for(var nPoints=this.closed?this.points.length:this.points.length-1,tl=0,i=0;i<nPoints;i++){tl+=this.computeArcLength(i),lengths.push(tl);}return lengths}},NumericalCurveMapper.prototype.inverse=function(idx,len){var step=1/(this._nSamples-1),_a=this.getSamples(idx),lengths=_a[0],slopes=_a[1],cis=_a[2],dis=_a[3];if(len>=lengths[lengths.length-1])return 1;if(len<=0)return 0;var i=Math.max(0,binarySearch(len,lengths)),ti=i*step;if(lengths[i]===len)return ti;var tdi=slopes[i],di=dis[i],ci=cis[i],ld=len-lengths[i];return ((di*ld+ci)*ld+tdi)*ld+ti},NumericalCurveMapper.prototype.lengthAt=function(u){return u*this.arcLengths[this.arcLengths.length-1]},NumericalCurveMapper.prototype.getT=function(u){var arcLengths=this.arcLengths,il=arcLengths.length,targetArcLength=u*arcLengths[il-1],i=binarySearch(targetArcLength,arcLengths),ti=i/(il-1);if(arcLengths[i]===targetArcLength)return ti;var len=targetArcLength-arcLengths[i];return (i+this.inverse(i,len))/(il-1)},NumericalCurveMapper.prototype.getU=function(t){if(0===t)return 0;if(1===t)return 1;var arcLengths=this.arcLengths,al=arcLengths.length-1,totalLength=arcLengths[al],tIdx=t*al,subIdx=Math.floor(tIdx),l1=arcLengths[subIdx];if(tIdx===subIdx)return l1/totalLength;var t0=tIdx-subIdx;return (l1+this.computeArcLength(subIdx,0,t0))/totalLength},NumericalCurveMapper}(AbstractCurveMapper),CurveInterpolator=function(){function CurveInterpolator(points,options){void 0===options&&(options={});var _this=this;this._cache=new Map;var curveMapper=(options=__assign({tension:.5,alpha:0,closed:!1},options)).arcDivisions?new SegmentedCurveMapper(options.arcDivisions,(function(){return _this._invalidateCache()})):new NumericalCurveMapper(options.numericalApproximationOrder,options.numericalInverseSamples,(function(){return _this._invalidateCache()}));curveMapper.alpha=options.alpha,curveMapper.tension=options.tension,curveMapper.closed=options.closed,curveMapper.points=points,this._lmargin=options.lmargin||1-curveMapper.tension,this._curveMapper=curveMapper;}return CurveInterpolator.prototype.getTimeFromPosition=function(position,clampInput){return void 0===clampInput&&(clampInput=!1),this._curveMapper.getT(clampInput?clamp(position,0,1):position)},CurveInterpolator.prototype.getPositionFromTime=function(t,clampInput){return void 0===clampInput&&(clampInput=!1),this._curveMapper.getU(clampInput?clamp(t,0,1):t)},CurveInterpolator.prototype.getPositionFromLength=function(length,clampInput){void 0===clampInput&&(clampInput=!1);var l=clampInput?clamp(length,0,this.length):length;return this._curveMapper.getU(l/this.length)},CurveInterpolator.prototype.getLengthAt=function(position,clampInput){return void 0===position&&(position=1),void 0===clampInput&&(clampInput=!1),this._curveMapper.lengthAt(clampInput?clamp(position,0,1):position)},CurveInterpolator.prototype.getTimeAtKnot=function(index){if(index<0||index>this.points.length-1)throw Error("Invalid index!");return 0===index?0:this.closed||index!==this.points.length-1?index/(this.closed?this.points.length:this.points.length-1):1},CurveInterpolator.prototype.getPositionAtKnot=function(index){return this.getPositionFromTime(this.getTimeAtKnot(index))},CurveInterpolator.prototype.getPointAtTime=function(t,target){return 0===(t=clamp(t,0,1))?copyValues(this.points[0],target):1===t?copyValues(this.closed?this.points[0]:this.points[this.points.length-1],target):this._curveMapper.evaluateForT(valueAtT,t,target)},CurveInterpolator.prototype.getPointAt=function(position,target){return this.getPointAtTime(this.getTimeFromPosition(position),target)},CurveInterpolator.prototype.getTangentAt=function(position,target){var t=clamp(this.getTimeFromPosition(position),0,1);return this.getTangentAtTime(t,target)},CurveInterpolator.prototype.getTangentAtTime=function(t,target){return normalize(this._curveMapper.evaluateForT(derivativeAtT,t,target))},CurveInterpolator.prototype.getNormalAt=function(position,target){var t=clamp(this.getTimeFromPosition(position),0,1);return this.getNormalAtTime(t,target)},CurveInterpolator.prototype.getNormalAtTime=function(t,target){var dt=normalize(this._curveMapper.evaluateForT(derivativeAtT,t));if(!(dt.length<2||dt.length>3)){var normal=target||new Array(dt.length);if(2===dt.length)return normal[0]=-dt[1],normal[1]=dt[0],normal;var ddt=normalize(this._curveMapper.evaluateForT(secondDerivativeAtT,t));return normalize(cross(cross(dt,ddt),dt),normal)}},CurveInterpolator.prototype.getFrenetFrames=function(segments,from,to){if(void 0===from&&(from=0),void 0===to&&(to=1),!(from<0||to>1||to<from)){for(var tangents=new Array(segments+1),normals=new Array(segments+1),i=0;i<=segments;i++){var u=0===from&&1===to?i/segments:from+i/segments*(to-from);tangents[i]=this.getTangentAt(u);}if(2===this.dim){for(i=0;i<tangents.length;i++)normals[i]=[-tangents[i][1],tangents[i][0]];return {tangents:tangents,normals:normals}}if(3===this.dim){var binormals=new Array(segments+1),normal=void 0,min=Number.MAX_VALUE,tx=Math.abs(tangents[0][0]),ty=Math.abs(tangents[0][1]);tx<=min&&(min=tx,normal=[1,0,0]),ty<=min&&(min=ty,normal=[0,1,0]),Math.abs(tangents[0][2])<=min&&(normal=[0,0,1]);var vec=normalize(cross(tangents[0],normal));normals[0]=cross(tangents[0],vec),binormals[0]=cross(tangents[0],normals[0]);for(i=1;i<=segments;i++){if(vec=cross(tangents[i-1],tangents[i]),normals[i]=copyValues(normals[i-1]),magnitude(vec)>EPS){normalize(vec);var theta=Math.acos(clamp(dot(tangents[i-1],tangents[i]),-1,1));rotate3d(normals[i-1],vec,theta,normals[i]);}binormals[i]=cross(tangents[i],normals[i]);}if(!0===this.closed){theta=Math.acos(clamp(dot(normals[0],normals[segments]),-1,1))/segments;dot(tangents[0],cross(normals[0],normals[segments]))>0&&(theta=-theta);for(i=1;i<=segments;i++)rotate3d(normals[i],tangents[i],theta*i,normals[i]),binormals[i]=cross(tangents[i],normals[i]);}return {tangents:tangents,normals:normals,binormals:binormals}}}},CurveInterpolator.prototype.getCurvatureAt=function(position){var t=clamp(this.getTimeFromPosition(position),0,1);return this.getCurvatureAtTime(t)},CurveInterpolator.prototype.getCurvatureAtTime=function(t){var dt=this._curveMapper.evaluateForT(derivativeAtT,t),ddt=this._curveMapper.evaluateForT(secondDerivativeAtT,t),tangent=normalize(dt,[]),curvature=0,direction=void 0;if(2===dt.length){if(0!==(denominator=Math.pow(dt[0]*dt[0]+dt[1]*dt[1],1.5))){var signedCurvature=(dt[0]*ddt[1]-dt[1]*ddt[0])/denominator;direction=signedCurvature<0?[tangent[1],-tangent[0]]:[-tangent[1],tangent[0]],curvature=Math.abs(signedCurvature);}}else if(3===dt.length){var a=magnitude(dt),cp=cross(dt,ddt);direction=normalize(cross(cp,dt)),0!==a&&(curvature=magnitude(cp)/Math.pow(a,3));}else {a=magnitude(dt);var b=magnitude(ddt),denominator=Math.pow(a,3),dotProduct=dot(dt,ddt);0!==denominator&&(curvature=Math.sqrt(Math.pow(a,2)*Math.pow(b,2)-Math.pow(dotProduct,2))/denominator);}return {curvature:curvature,radius:0!==curvature?1/curvature:0,tangent:tangent,direction:direction}},CurveInterpolator.prototype.getDerivativeAt=function(position,target){var t=clamp(this.getTimeFromPosition(position),0,1);return this._curveMapper.evaluateForT(derivativeAtT,t,target)},CurveInterpolator.prototype.getSecondDerivativeAt=function(position,target){var t=clamp(this.getTimeFromPosition(position),0,1);return this._curveMapper.evaluateForT(secondDerivativeAtT,t,target)},CurveInterpolator.prototype.getBoundingBox=function(from,to){if(void 0===from&&(from=0),void 0===to&&(to=1),0===from&&1===to&&this._cache.has("bbox"))return this._cache.get("bbox");for(var min=[],max=[],t0=this.getTimeFromPosition(from),t1=this.getTimeFromPosition(to),start=this.getPointAtTime(t0),end=this.getPointAtTime(t1),nPoints=this.closed?this.points.length:this.points.length-1,i0=Math.floor(nPoints*t0),i1=Math.ceil(nPoints*t1),c=0;c<start.length;c++)min[c]=Math.min(start[c],end[c]),max[c]=Math.max(start[c],end[c]);for(var _loop_1=function(i){var p2=getControlPoints(i-1,this_1.points,this_1.closed)[2];if(i<i1)for(var c=0;c<p2.length;c++)p2[c]<min[c]&&(min[c]=p2[c]),p2[c]>max[c]&&(max[c]=p2[c]);if(this_1.tension<1){var w0_1=nPoints*t0-(i-1),w1_1=nPoints*t1-(i-1),valid=function(t){return t>-EPS&&t<=1+EPS&&(i-1!==i0||t>w0_1)&&(i!==i1||t<w1_1)},coefficients_1=this_1._curveMapper.getCoefficients(i-1),_loop_2=function(c){var _b=coefficients_1[c];getQuadRoots(3*_b[0],2*_b[1],_b[2]).filter(valid).forEach((function(t){var v=valueAtT(t,coefficients_1[c]);v<min[c]&&(min[c]=v),v>max[c]&&(max[c]=v);}));};for(c=0;c<coefficients_1.length;c++)_loop_2(c);}},this_1=this,i=i0+1;i<=i1;i++)_loop_1(i);var bbox={min:min,max:max};return 0===from&&1===to&&this._cache.set("bbox",bbox),bbox},CurveInterpolator.prototype.getPoints=function(segments,returnType,from,to){if(void 0===segments&&(segments=100),void 0===from&&(from=0),void 0===to&&(to=1),!segments||segments<=0)throw Error("Invalid arguments passed to getPoints(). You must specify at least 1 sample/segment.");if(!(from<0||to>1||to<from)){for(var pts=[],d=0;d<=segments;d++){var u=0===from&&1===to?d/segments:from+d/segments*(to-from);pts.push(this.getPointAt(u,returnType&&new returnType));}return pts}},CurveInterpolator.prototype.getNearestPosition=function(point,threshold,samples){var _this=this;if(void 0===threshold&&(threshold=1e-5),threshold<=0||!Number.isFinite(threshold))throw Error("Invalid threshold. Must be a number greater than zero!");samples=samples||10*this.points.length-1;var pu=new Array(point.length),minDist=1/0,minU=0,lut=this.createLookupTable((function(u){return _this.getPointAt(u)}),samples,{cacheKey:"lut_nearest_".concat(samples)});Array.from(lut.keys()).forEach((function(key){var c=lut.get(key),dist=distance(point,c);if(dist<minDist)return minDist=dist,minU=key,!0}));for(var minT=this.getTimeFromPosition(minU),bisect=function(t){if(t>=0&&t<=1){_this.getPointAtTime(t,pu);var dist=distance(point,pu);if(dist<minDist)return minDist=dist,minT=t,!0}},step=.005;step>threshold;)bisect(minT-step)||bisect(minT+step)||(step/=2);return {u:minU=this._curveMapper.getU(minT),distance:minDist,point:pu}},CurveInterpolator.prototype.getIntersects=function(v,axis,max,margin){var _this=this;void 0===axis&&(axis=0),void 0===max&&(max=0),void 0===margin&&(margin=this._lmargin);var solutions=this.getIntersectsAsTime(v,axis,max,margin).map((function(t){return _this.getPointAtTime(t)}));return 1===Math.abs(max)?1===solutions.length?solutions[0]:null:solutions},CurveInterpolator.prototype.getIntersectsAsPositions=function(v,axis,max,margin){var _this=this;return void 0===axis&&(axis=0),void 0===max&&(max=0),void 0===margin&&(margin=this._lmargin),this.getIntersectsAsTime(v,axis,max,margin).map((function(t){return _this.getPositionFromTime(t)}))},CurveInterpolator.prototype.getIntersectsAsTime=function(v,axis,max,margin){void 0===axis&&(axis=0),void 0===max&&(max=0),void 0===margin&&(margin=this._lmargin);for(var k=axis,solutions=new Set,nPoints=this.closed?this.points.length:this.points.length-1,i=0;i<nPoints&&(0===max||solutions.size<Math.abs(max));i+=1){var idx=max<0?nPoints-(i+1):i,_a=getControlPoints(idx,this.points,this.closed),p1=_a[1],p2=_a[2],coefficients=this._curveMapper.getCoefficients(idx),vmin=void 0,vmax=void 0;if(p1[k]<p2[k]?(vmin=p1[k],vmax=p2[k]):(vmin=p2[k],vmax=p1[k]),v-margin<=vmax&&v+margin>=vmin){var ts=findRootsOfT(v,coefficients[k]);max<0?ts.sort((function(a,b){return b-a})):max>=0&&ts.sort((function(a,b){return a-b}));for(var j=0;j<ts.length;j++){var nt=(ts[j]+idx)/nPoints;if(solutions.add(nt),0!==max&&solutions.size===Math.abs(max))break}}}return Array.from(solutions)},CurveInterpolator.prototype.createLookupTable=function(func,samples,options){if(!samples||samples<=1)throw Error("Invalid arguments passed to createLookupTable(). You must specify at least 2 samples.");var _a=__assign({from:0,to:1,cacheForceUpdate:!1},options),from=_a.from,to=_a.to,cacheKey=_a.cacheKey,cacheForceUpdate=_a.cacheForceUpdate;if(!(from<0||to>1||to<from)){var lut=null;if(cacheKey&&!cacheForceUpdate&&this._cache.has(cacheKey))cacheKey&&this._cache.has(cacheKey)&&(lut=this._cache.get(cacheKey));else {lut=new Map;for(var d=0;d<samples;d++){var u=0===from&&1===to?d/(samples-1):from+d/(samples-1)*(to-from),value=func(u);lut.set(u,value);}cacheKey&&this._cache.set(cacheKey,lut);}return lut}},CurveInterpolator.prototype.forEach=function(func,samples,from,to){var _this=this;void 0===from&&(from=0),void 0===to&&(to=1);var positions=[];if(Number.isFinite(samples)){var nSamples=samples;if(nSamples<=1)throw Error("Invalid arguments passed to forEach(). You must specify at least 2 samples.");for(var i=0;i<nSamples;i++){var u=0===from&&1===to?i/(nSamples-1):from+i/(nSamples-1)*(to-from);positions.push(u);}}else Array.isArray(samples)&&(positions=samples);var prev=null;positions.forEach((function(u,i){if(!Number.isFinite(u)||u<0||u>1)throw Error("Invalid position (u) for sample in forEach!");var t=_this.getTimeFromPosition(u),current=func({u:u,t:t,i:i,prev:prev});prev={u:u,t:t,i:i,value:current};}));},CurveInterpolator.prototype.map=function(func,samples,from,to){var _this=this;void 0===from&&(from=0),void 0===to&&(to=1);var positions=[];if(Number.isFinite(samples)){var nSamples=samples;if(nSamples<=1)throw Error("Invalid arguments passed to map(). You must specify at least 2 samples.");for(var i=0;i<nSamples;i++){var u=0===from&&1===to?i/(nSamples-1):from+i/(nSamples-1)*(to-from);positions.push(u);}}else Array.isArray(samples)&&(positions=samples);var prev=null;return positions.map((function(u,i){if(!Number.isFinite(u)||u<0||u>1)throw Error("Invalid position (u) for sample in map()!");var t=_this.getTimeFromPosition(u),current=func({u:u,t:t,i:i,prev:prev});return prev={u:u,t:t,i:i,value:current},current}))},CurveInterpolator.prototype.reduce=function(func,initialValue,samples,from,to){var _this=this;void 0===from&&(from=0),void 0===to&&(to=1);var positions=[];if(Number.isFinite(samples)){var nSamples=samples;if(nSamples<=1)throw Error("Invalid arguments passed to map(). You must specify at least 2 samples.");for(var i=0;i<nSamples;i++){var u=0===from&&1===to?i/(nSamples-1):from+i/(nSamples-1)*(to-from);positions.push(u);}}else Array.isArray(samples)&&(positions=samples);return positions.reduce((function(acc,u,i){if(!Number.isFinite(u)||u<0||u>1)throw Error("Invalid position (u) for sample in map()!");var t=_this.getTimeFromPosition(u);return func({acc:acc,u:u,t:t,i:i})}),initialValue)},CurveInterpolator.prototype._invalidateCache=function(){return this._cache=new Map,this},CurveInterpolator.prototype.reset=function(){this._curveMapper.reset();},Object.defineProperty(CurveInterpolator.prototype,"points",{get:function(){return this._curveMapper.points},set:function(pts){this._curveMapper.points=pts;},enumerable:!1,configurable:!0}),Object.defineProperty(CurveInterpolator.prototype,"tension",{get:function(){return this._curveMapper.tension},set:function(t){this._curveMapper.tension=t;},enumerable:!1,configurable:!0}),Object.defineProperty(CurveInterpolator.prototype,"alpha",{get:function(){return this._curveMapper.alpha},set:function(a){this._curveMapper.alpha=a;},enumerable:!1,configurable:!0}),Object.defineProperty(CurveInterpolator.prototype,"closed",{get:function(){return this._curveMapper.closed},set:function(isClosed){this._curveMapper.closed=isClosed;},enumerable:!1,configurable:!0}),Object.defineProperty(CurveInterpolator.prototype,"length",{get:function(){return this._curveMapper.lengthAt(1)},enumerable:!1,configurable:!0}),Object.defineProperty(CurveInterpolator.prototype,"minX",{get:function(){return this.getBoundingBox().min[0]},enumerable:!1,configurable:!0}),Object.defineProperty(CurveInterpolator.prototype,"maxX",{get:function(){return this.getBoundingBox().max[0]},enumerable:!1,configurable:!0}),Object.defineProperty(CurveInterpolator.prototype,"minY",{get:function(){return this.getBoundingBox().min[1]},enumerable:!1,configurable:!0}),Object.defineProperty(CurveInterpolator.prototype,"maxY",{get:function(){return this.getBoundingBox().max[1]},enumerable:!1,configurable:!0}),Object.defineProperty(CurveInterpolator.prototype,"minZ",{get:function(){return this.getBoundingBox().min[2]},enumerable:!1,configurable:!0}),Object.defineProperty(CurveInterpolator.prototype,"maxZ",{get:function(){return this.getBoundingBox().max[2]},enumerable:!1,configurable:!0}),Object.defineProperty(CurveInterpolator.prototype,"dim",{get:function(){var _a;return (null===(_a=this.points[0])||void 0===_a?void 0:_a.length)||void 0},enumerable:!1,configurable:!0}),CurveInterpolator}();

const filter$F = (geometry) =>
  ['graph', 'polygonsWithHoles', 'segments', 'points'].includes(
    geometry.type
  ) && isNotTypeGhost(geometry);

const emitEachCoordinate = (geometry, emit) => {
  const inputs = linearize(geometry, filter$F);
  eachPoint(inputs, emit);
};

const toCoordinates = (geometry) => {
  const coordinates = [];
  emitEachCoordinate(geometry, (coordinate) => coordinates.push(coordinate));
  return coordinates;
};

const toPoints = (geometry) => {
  const points = [];
  emitEachCoordinate(geometry, (coordinate) =>
    points.push(translate(Point(), coordinate))
  );
  return Group(points);
};

const toPointList = (geometry) => {
  const points = [];
  emitEachCoordinate(geometry, (coordinate) =>
    points.push(translate(Point(), coordinate))
  );
  return points;
};

const Curve = (
  coordinates,
  implicitSteps = 20,
  { steps = implicitSteps } = {},
  { closed }
) => {
  const approximateCoordinates = coordinates.map(([x = 0, y = 0, z = 0]) => [
    x,
    y,
    z,
  ]);
  const interpolator = new CurveInterpolator(approximateCoordinates, {
    closed,
    tension: 0.2,
    alpha: 0.5,
  });
  const points = interpolator.getPoints(steps);
  if (closed) {
    return Loop([Points(points)]);
  } else {
    return Link([Points(points)]);
  }
};

const curve = (geometry, coordinates, implicitSteps, options, modes) =>
  Curve(
    [...toCoordinates(geometry), ...coordinates],
    implicitSteps,
    options,
    modes
  );

const Empty = () => Group([]);

const Segments$1 = (segments) => taggedSegments({}, segments);

// Hershey simplex one line font.
// See: http://paulbourke.net/dataformats/hershey/

const hersheyPaths = {
  32: [[null]],
  33: [
    [null, [5, 21, 0], [5, 7, 0]],
    [null, [5, 2, 0], [4, 1, 0], [5, 0, 0], [6, 1, 0], [5, 2, 0]],
    [null],
  ],
  34: [
    [null, [4, 21, 0], [4, 14, 0]],
    [null, [12, 21, 0], [12, 14, 0]],
    [null],
  ],
  35: [
    [null, [11, 25, 0], [4, -7, 0]],
    [null, [17, 25, 0], [10, -7, 0]],
    [null, [4, 12, 0], [18, 12, 0]],
    [null, [3, 6, 0], [17, 6, 0]],
    [null],
  ],
  36: [
    [null, [8, 25, 0], [8, -4, 0]],
    [null, [12, 25, 0], [12, -4, 0]],
    [
      null,
      [17, 18, 0],
      [15, 20, 0],
      [12, 21, 0],
      [8, 21, 0],
      [5, 20, 0],
      [3, 18, 0],
      [3, 16, 0],
      [4, 14, 0],
      [5, 13, 0],
      [7, 12, 0],
      [13, 10, 0],
      [15, 9, 0],
      [16, 8, 0],
      [17, 6, 0],
      [17, 3, 0],
      [15, 1, 0],
      [12, 0, 0],
      [8, 0, 0],
      [5, 1, 0],
      [3, 3, 0],
    ],
    [null],
  ],
  37: [
    [null, [21, 21, 0], [3, 0, 0]],
    [
      null,
      [8, 21, 0],
      [10, 19, 0],
      [10, 17, 0],
      [9, 15, 0],
      [7, 14, 0],
      [5, 14, 0],
      [3, 16, 0],
      [3, 18, 0],
      [4, 20, 0],
      [6, 21, 0],
      [8, 21, 0],
      [10, 20, 0],
      [13, 19, 0],
      [16, 19, 0],
      [19, 20, 0],
      [21, 21, 0],
    ],
    [
      null,
      [17, 7, 0],
      [15, 6, 0],
      [14, 4, 0],
      [14, 2, 0],
      [16, 0, 0],
      [18, 0, 0],
      [20, 1, 0],
      [21, 3, 0],
      [21, 5, 0],
      [19, 7, 0],
      [17, 7, 0],
    ],
    [null],
  ],
  38: [
    [
      null,
      [23, 12, 0],
      [23, 13, 0],
      [22, 14, 0],
      [21, 14, 0],
      [20, 13, 0],
      [19, 11, 0],
      [17, 6, 0],
      [15, 3, 0],
      [13, 1, 0],
      [11, 0, 0],
      [7, 0, 0],
      [5, 1, 0],
      [4, 2, 0],
      [3, 4, 0],
      [3, 6, 0],
      [4, 8, 0],
      [5, 9, 0],
      [12, 13, 0],
      [13, 14, 0],
      [14, 16, 0],
      [14, 18, 0],
      [13, 20, 0],
      [11, 21, 0],
      [9, 20, 0],
      [8, 18, 0],
      [8, 16, 0],
      [9, 13, 0],
      [11, 10, 0],
      [16, 3, 0],
      [18, 1, 0],
      [20, 0, 0],
      [22, 0, 0],
      [23, 1, 0],
      [23, 2, 0],
    ],
    [null],
  ],
  39: [
    [
      null,
      [5, 19, 0],
      [4, 20, 0],
      [5, 21, 0],
      [6, 20, 0],
      [6, 18, 0],
      [5, 16, 0],
      [4, 15, 0],
    ],
    [null],
  ],
  40: [
    [
      null,
      [11, 25, 0],
      [9, 23, 0],
      [7, 20, 0],
      [5, 16, 0],
      [4, 11, 0],
      [4, 7, 0],
      [5, 2, 0],
      [7, -2, 0],
      [9, -5, 0],
      [11, -7, 0],
    ],
    [null],
  ],
  41: [
    [
      null,
      [3, 25, 0],
      [5, 23, 0],
      [7, 20, 0],
      [9, 16, 0],
      [10, 11, 0],
      [10, 7, 0],
      [9, 2, 0],
      [7, -2, 0],
      [5, -5, 0],
      [3, -7, 0],
    ],
    [null],
  ],
  42: [
    [null, [8, 21, 0], [8, 9, 0]],
    [null, [3, 18, 0], [13, 12, 0]],
    [null, [13, 18, 0], [3, 12, 0]],
    [null],
  ],
  43: [[null, [13, 18, 0], [13, 0, 0]], [null, [4, 9, 0], [22, 9, 0]], [null]],
  44: [
    [
      null,
      [6, 1, 0],
      [5, 0, 0],
      [4, 1, 0],
      [5, 2, 0],
      [6, 1, 0],
      [6, -1, 0],
      [5, -3, 0],
      [4, -4, 0],
    ],
    [null],
  ],
  45: [[null, [4, 9, 0], [22, 9, 0]], [null]],
  46: [[null, [5, 2, 0], [4, 1, 0], [5, 0, 0], [6, 1, 0], [5, 2, 0]], [null]],
  47: [[null, [20, 25, 0], [2, -7, 0]], [null]],
  48: [
    [
      null,
      [9, 21, 0],
      [6, 20, 0],
      [4, 17, 0],
      [3, 12, 0],
      [3, 9, 0],
      [4, 4, 0],
      [6, 1, 0],
      [9, 0, 0],
      [11, 0, 0],
      [14, 1, 0],
      [16, 4, 0],
      [17, 9, 0],
      [17, 12, 0],
      [16, 17, 0],
      [14, 20, 0],
      [11, 21, 0],
      [9, 21, 0],
    ],
    [null],
  ],
  49: [[null, [6, 17, 0], [8, 18, 0], [11, 21, 0], [11, 0, 0]], [null]],
  50: [
    [
      null,
      [4, 16, 0],
      [4, 17, 0],
      [5, 19, 0],
      [6, 20, 0],
      [8, 21, 0],
      [12, 21, 0],
      [14, 20, 0],
      [15, 19, 0],
      [16, 17, 0],
      [16, 15, 0],
      [15, 13, 0],
      [13, 10, 0],
      [3, 0, 0],
      [17, 0, 0],
    ],
    [null],
  ],
  51: [
    [
      null,
      [5, 21, 0],
      [16, 21, 0],
      [10, 13, 0],
      [13, 13, 0],
      [15, 12, 0],
      [16, 11, 0],
      [17, 8, 0],
      [17, 6, 0],
      [16, 3, 0],
      [14, 1, 0],
      [11, 0, 0],
      [8, 0, 0],
      [5, 1, 0],
      [4, 2, 0],
      [3, 4, 0],
    ],
    [null],
  ],
  52: [
    [null, [13, 21, 0], [3, 7, 0], [18, 7, 0]],
    [null, [13, 21, 0], [13, 0, 0]],
    [null],
  ],
  53: [
    [
      null,
      [15, 21, 0],
      [5, 21, 0],
      [4, 12, 0],
      [5, 13, 0],
      [8, 14, 0],
      [11, 14, 0],
      [14, 13, 0],
      [16, 11, 0],
      [17, 8, 0],
      [17, 6, 0],
      [16, 3, 0],
      [14, 1, 0],
      [11, 0, 0],
      [8, 0, 0],
      [5, 1, 0],
      [4, 2, 0],
      [3, 4, 0],
    ],
    [null],
  ],
  54: [
    [
      null,
      [16, 18, 0],
      [15, 20, 0],
      [12, 21, 0],
      [10, 21, 0],
      [7, 20, 0],
      [5, 17, 0],
      [4, 12, 0],
      [4, 7, 0],
      [5, 3, 0],
      [7, 1, 0],
      [10, 0, 0],
      [11, 0, 0],
      [14, 1, 0],
      [16, 3, 0],
      [17, 6, 0],
      [17, 7, 0],
      [16, 10, 0],
      [14, 12, 0],
      [11, 13, 0],
      [10, 13, 0],
      [7, 12, 0],
      [5, 10, 0],
      [4, 7, 0],
    ],
    [null],
  ],
  55: [[null, [17, 21, 0], [7, 0, 0]], [null, [3, 21, 0], [17, 21, 0]], [null]],
  56: [
    [
      null,
      [8, 21, 0],
      [5, 20, 0],
      [4, 18, 0],
      [4, 16, 0],
      [5, 14, 0],
      [7, 13, 0],
      [11, 12, 0],
      [14, 11, 0],
      [16, 9, 0],
      [17, 7, 0],
      [17, 4, 0],
      [16, 2, 0],
      [15, 1, 0],
      [12, 0, 0],
      [8, 0, 0],
      [5, 1, 0],
      [4, 2, 0],
      [3, 4, 0],
      [3, 7, 0],
      [4, 9, 0],
      [6, 11, 0],
      [9, 12, 0],
      [13, 13, 0],
      [15, 14, 0],
      [16, 16, 0],
      [16, 18, 0],
      [15, 20, 0],
      [12, 21, 0],
      [8, 21, 0],
    ],
    [null],
  ],
  57: [
    [
      null,
      [16, 14, 0],
      [15, 11, 0],
      [13, 9, 0],
      [10, 8, 0],
      [9, 8, 0],
      [6, 9, 0],
      [4, 11, 0],
      [3, 14, 0],
      [3, 15, 0],
      [4, 18, 0],
      [6, 20, 0],
      [9, 21, 0],
      [10, 21, 0],
      [13, 20, 0],
      [15, 18, 0],
      [16, 14, 0],
      [16, 9, 0],
      [15, 4, 0],
      [13, 1, 0],
      [10, 0, 0],
      [8, 0, 0],
      [5, 1, 0],
      [4, 3, 0],
    ],
    [null],
  ],
  58: [
    [null, [5, 14, 0], [4, 13, 0], [5, 12, 0], [6, 13, 0], [5, 14, 0]],
    [null, [5, 2, 0], [4, 1, 0], [5, 0, 0], [6, 1, 0], [5, 2, 0]],
    [null],
  ],
  59: [
    [null, [5, 14, 0], [4, 13, 0], [5, 12, 0], [6, 13, 0], [5, 14, 0]],
    [
      null,
      [6, 1, 0],
      [5, 0, 0],
      [4, 1, 0],
      [5, 2, 0],
      [6, 1, 0],
      [6, -1, 0],
      [5, -3, 0],
      [4, -4, 0],
    ],
    [null],
  ],
  60: [[null, [20, 18, 0], [4, 9, 0], [20, 0, 0]], [null]],
  61: [[null, [4, 12, 0], [22, 12, 0]], [null, [4, 6, 0], [22, 6, 0]], [null]],
  62: [[null, [4, 18, 0], [20, 9, 0], [4, 0, 0]], [null]],
  63: [
    [
      null,
      [3, 16, 0],
      [3, 17, 0],
      [4, 19, 0],
      [5, 20, 0],
      [7, 21, 0],
      [11, 21, 0],
      [13, 20, 0],
      [14, 19, 0],
      [15, 17, 0],
      [15, 15, 0],
      [14, 13, 0],
      [13, 12, 0],
      [9, 10, 0],
      [9, 7, 0],
    ],
    [null, [9, 2, 0], [8, 1, 0], [9, 0, 0], [10, 1, 0], [9, 2, 0]],
    [null],
  ],
  64: [
    [
      null,
      [18, 13, 0],
      [17, 15, 0],
      [15, 16, 0],
      [12, 16, 0],
      [10, 15, 0],
      [9, 14, 0],
      [8, 11, 0],
      [8, 8, 0],
      [9, 6, 0],
      [11, 5, 0],
      [14, 5, 0],
      [16, 6, 0],
      [17, 8, 0],
    ],
    [
      null,
      [12, 16, 0],
      [10, 14, 0],
      [9, 11, 0],
      [9, 8, 0],
      [10, 6, 0],
      [11, 5, 0],
    ],
    [
      null,
      [18, 16, 0],
      [17, 8, 0],
      [17, 6, 0],
      [19, 5, 0],
      [21, 5, 0],
      [23, 7, 0],
      [24, 10, 0],
      [24, 12, 0],
      [23, 15, 0],
      [22, 17, 0],
      [20, 19, 0],
      [18, 20, 0],
      [15, 21, 0],
      [12, 21, 0],
      [9, 20, 0],
      [7, 19, 0],
      [5, 17, 0],
      [4, 15, 0],
      [3, 12, 0],
      [3, 9, 0],
      [4, 6, 0],
      [5, 4, 0],
      [7, 2, 0],
      [9, 1, 0],
      [12, 0, 0],
      [15, 0, 0],
      [18, 1, 0],
      [20, 2, 0],
      [21, 3, 0],
    ],
    [null, [19, 16, 0], [18, 8, 0], [18, 6, 0], [19, 5, 0]],
  ],
  65: [
    [null, [9, 21, 0], [1, 0, 0]],
    [null, [9, 21, 0], [17, 0, 0]],
    [null, [4, 7, 0], [14, 7, 0]],
    [null],
  ],
  66: [
    [null, [4, 21, 0], [4, 0, 0]],
    [
      null,
      [4, 21, 0],
      [13, 21, 0],
      [16, 20, 0],
      [17, 19, 0],
      [18, 17, 0],
      [18, 15, 0],
      [17, 13, 0],
      [16, 12, 0],
      [13, 11, 0],
    ],
    [
      null,
      [4, 11, 0],
      [13, 11, 0],
      [16, 10, 0],
      [17, 9, 0],
      [18, 7, 0],
      [18, 4, 0],
      [17, 2, 0],
      [16, 1, 0],
      [13, 0, 0],
      [4, 0, 0],
    ],
    [null],
  ],
  67: [
    [
      null,
      [18, 16, 0],
      [17, 18, 0],
      [15, 20, 0],
      [13, 21, 0],
      [9, 21, 0],
      [7, 20, 0],
      [5, 18, 0],
      [4, 16, 0],
      [3, 13, 0],
      [3, 8, 0],
      [4, 5, 0],
      [5, 3, 0],
      [7, 1, 0],
      [9, 0, 0],
      [13, 0, 0],
      [15, 1, 0],
      [17, 3, 0],
      [18, 5, 0],
    ],
    [null],
  ],
  68: [
    [null, [4, 21, 0], [4, 0, 0]],
    [
      null,
      [4, 21, 0],
      [11, 21, 0],
      [14, 20, 0],
      [16, 18, 0],
      [17, 16, 0],
      [18, 13, 0],
      [18, 8, 0],
      [17, 5, 0],
      [16, 3, 0],
      [14, 1, 0],
      [11, 0, 0],
      [4, 0, 0],
    ],
    [null],
  ],
  69: [
    [null, [4, 21, 0], [4, 0, 0]],
    [null, [4, 21, 0], [17, 21, 0]],
    [null, [4, 11, 0], [12, 11, 0]],
    [null, [4, 0, 0], [17, 0, 0]],
    [null],
  ],
  70: [
    [null, [4, 21, 0], [4, 0, 0]],
    [null, [4, 21, 0], [17, 21, 0]],
    [null, [4, 11, 0], [12, 11, 0]],
    [null],
  ],
  71: [
    [
      null,
      [18, 16, 0],
      [17, 18, 0],
      [15, 20, 0],
      [13, 21, 0],
      [9, 21, 0],
      [7, 20, 0],
      [5, 18, 0],
      [4, 16, 0],
      [3, 13, 0],
      [3, 8, 0],
      [4, 5, 0],
      [5, 3, 0],
      [7, 1, 0],
      [9, 0, 0],
      [13, 0, 0],
      [15, 1, 0],
      [17, 3, 0],
      [18, 5, 0],
      [18, 8, 0],
    ],
    [null, [13, 8, 0], [18, 8, 0]],
    [null],
  ],
  72: [
    [null, [4, 21, 0], [4, 0, 0]],
    [null, [18, 21, 0], [18, 0, 0]],
    [null, [4, 11, 0], [18, 11, 0]],
    [null],
  ],
  73: [[null, [4, 21, 0], [4, 0, 0]], [null]],
  74: [
    [
      null,
      [12, 21, 0],
      [12, 5, 0],
      [11, 2, 0],
      [10, 1, 0],
      [8, 0, 0],
      [6, 0, 0],
      [4, 1, 0],
      [3, 2, 0],
      [2, 5, 0],
      [2, 7, 0],
    ],
    [null],
  ],
  75: [
    [null, [4, 21, 0], [4, 0, 0]],
    [null, [18, 21, 0], [4, 7, 0]],
    [null, [9, 12, 0], [18, 0, 0]],
    [null],
  ],
  76: [[null, [4, 21, 0], [4, 0, 0]], [null, [4, 0, 0], [16, 0, 0]], [null]],
  77: [
    [null, [4, 21, 0], [4, 0, 0]],
    [null, [4, 21, 0], [12, 0, 0]],
    [null, [20, 21, 0], [12, 0, 0]],
    [null, [20, 21, 0], [20, 0, 0]],
    [null],
  ],
  78: [
    [null, [4, 21, 0], [4, 0, 0]],
    [null, [4, 21, 0], [18, 0, 0]],
    [null, [18, 21, 0], [18, 0, 0]],
    [null],
  ],
  79: [
    [
      null,
      [9, 21, 0],
      [7, 20, 0],
      [5, 18, 0],
      [4, 16, 0],
      [3, 13, 0],
      [3, 8, 0],
      [4, 5, 0],
      [5, 3, 0],
      [7, 1, 0],
      [9, 0, 0],
      [13, 0, 0],
      [15, 1, 0],
      [17, 3, 0],
      [18, 5, 0],
      [19, 8, 0],
      [19, 13, 0],
      [18, 16, 0],
      [17, 18, 0],
      [15, 20, 0],
      [13, 21, 0],
      [9, 21, 0],
    ],
    [null],
  ],
  80: [
    [null, [4, 21, 0], [4, 0, 0]],
    [
      null,
      [4, 21, 0],
      [13, 21, 0],
      [16, 20, 0],
      [17, 19, 0],
      [18, 17, 0],
      [18, 14, 0],
      [17, 12, 0],
      [16, 11, 0],
      [13, 10, 0],
      [4, 10, 0],
    ],
    [null],
  ],
  81: [
    [
      null,
      [9, 21, 0],
      [7, 20, 0],
      [5, 18, 0],
      [4, 16, 0],
      [3, 13, 0],
      [3, 8, 0],
      [4, 5, 0],
      [5, 3, 0],
      [7, 1, 0],
      [9, 0, 0],
      [13, 0, 0],
      [15, 1, 0],
      [17, 3, 0],
      [18, 5, 0],
      [19, 8, 0],
      [19, 13, 0],
      [18, 16, 0],
      [17, 18, 0],
      [15, 20, 0],
      [13, 21, 0],
      [9, 21, 0],
    ],
    [null, [12, 4, 0], [18, -2, 0]],
    [null],
  ],
  82: [
    [null, [4, 21, 0], [4, 0, 0]],
    [
      null,
      [4, 21, 0],
      [13, 21, 0],
      [16, 20, 0],
      [17, 19, 0],
      [18, 17, 0],
      [18, 15, 0],
      [17, 13, 0],
      [16, 12, 0],
      [13, 11, 0],
      [4, 11, 0],
    ],
    [null, [11, 11, 0], [18, 0, 0]],
    [null],
  ],
  83: [
    [
      null,
      [17, 18, 0],
      [15, 20, 0],
      [12, 21, 0],
      [8, 21, 0],
      [5, 20, 0],
      [3, 18, 0],
      [3, 16, 0],
      [4, 14, 0],
      [5, 13, 0],
      [7, 12, 0],
      [13, 10, 0],
      [15, 9, 0],
      [16, 8, 0],
      [17, 6, 0],
      [17, 3, 0],
      [15, 1, 0],
      [12, 0, 0],
      [8, 0, 0],
      [5, 1, 0],
      [3, 3, 0],
    ],
    [null],
  ],
  84: [[null, [8, 21, 0], [8, 0, 0]], [null, [1, 21, 0], [15, 21, 0]], [null]],
  85: [
    [
      null,
      [4, 21, 0],
      [4, 6, 0],
      [5, 3, 0],
      [7, 1, 0],
      [10, 0, 0],
      [12, 0, 0],
      [15, 1, 0],
      [17, 3, 0],
      [18, 6, 0],
      [18, 21, 0],
    ],
    [null],
  ],
  86: [[null, [1, 21, 0], [9, 0, 0]], [null, [17, 21, 0], [9, 0, 0]], [null]],
  87: [
    [null, [2, 21, 0], [7, 0, 0]],
    [null, [12, 21, 0], [7, 0, 0]],
    [null, [12, 21, 0], [17, 0, 0]],
    [null, [22, 21, 0], [17, 0, 0]],
    [null],
  ],
  88: [[null, [3, 21, 0], [17, 0, 0]], [null, [17, 21, 0], [3, 0, 0]], [null]],
  89: [
    [null, [1, 21, 0], [9, 11, 0], [9, 0, 0]],
    [null, [17, 21, 0], [9, 11, 0]],
    [null],
  ],
  90: [
    [null, [17, 21, 0], [3, 0, 0]],
    [null, [3, 21, 0], [17, 21, 0]],
    [null, [3, 0, 0], [17, 0, 0]],
    [null],
  ],
  91: [
    [null, [4, 25, 0], [4, -7, 0]],
    [null, [5, 25, 0], [5, -7, 0]],
    [null, [4, 25, 0], [11, 25, 0]],
    [null, [4, -7, 0], [11, -7, 0]],
    [null],
  ],
  92: [[null, [0, 21, 0], [14, -3, 0]], [null]],
  93: [
    [null, [9, 25, 0], [9, -7, 0]],
    [null, [10, 25, 0], [10, -7, 0]],
    [null, [3, 25, 0], [10, 25, 0]],
    [null, [3, -7, 0], [10, -7, 0]],
    [null],
  ],
  94: [
    [null, [6, 15, 0], [8, 18, 0], [10, 15, 0]],
    [null, [3, 12, 0], [8, 17, 0], [13, 12, 0]],
    [null, [8, 17, 0], [8, 0, 0]],
    [null],
  ],
  95: [[null, [0, -2, 0], [16, -2, 0]], [null]],
  96: [
    [
      null,
      [6, 21, 0],
      [5, 20, 0],
      [4, 18, 0],
      [4, 16, 0],
      [5, 15, 0],
      [6, 16, 0],
      [5, 17, 0],
    ],
    [null],
  ],
  97: [
    [null, [15, 14, 0], [15, 0, 0]],
    [
      null,
      [15, 11, 0],
      [13, 13, 0],
      [11, 14, 0],
      [8, 14, 0],
      [6, 13, 0],
      [4, 11, 0],
      [3, 8, 0],
      [3, 6, 0],
      [4, 3, 0],
      [6, 1, 0],
      [8, 0, 0],
      [11, 0, 0],
      [13, 1, 0],
      [15, 3, 0],
    ],
    [null],
  ],
  98: [
    [null, [4, 21, 0], [4, 0, 0]],
    [
      null,
      [4, 11, 0],
      [6, 13, 0],
      [8, 14, 0],
      [11, 14, 0],
      [13, 13, 0],
      [15, 11, 0],
      [16, 8, 0],
      [16, 6, 0],
      [15, 3, 0],
      [13, 1, 0],
      [11, 0, 0],
      [8, 0, 0],
      [6, 1, 0],
      [4, 3, 0],
    ],
    [null],
  ],
  99: [
    [
      null,
      [15, 11, 0],
      [13, 13, 0],
      [11, 14, 0],
      [8, 14, 0],
      [6, 13, 0],
      [4, 11, 0],
      [3, 8, 0],
      [3, 6, 0],
      [4, 3, 0],
      [6, 1, 0],
      [8, 0, 0],
      [11, 0, 0],
      [13, 1, 0],
      [15, 3, 0],
    ],
    [null],
  ],
  100: [
    [null, [15, 21, 0], [15, 0, 0]],
    [
      null,
      [15, 11, 0],
      [13, 13, 0],
      [11, 14, 0],
      [8, 14, 0],
      [6, 13, 0],
      [4, 11, 0],
      [3, 8, 0],
      [3, 6, 0],
      [4, 3, 0],
      [6, 1, 0],
      [8, 0, 0],
      [11, 0, 0],
      [13, 1, 0],
      [15, 3, 0],
    ],
    [null],
  ],
  101: [
    [
      null,
      [3, 8, 0],
      [15, 8, 0],
      [15, 10, 0],
      [14, 12, 0],
      [13, 13, 0],
      [11, 14, 0],
      [8, 14, 0],
      [6, 13, 0],
      [4, 11, 0],
      [3, 8, 0],
      [3, 6, 0],
      [4, 3, 0],
      [6, 1, 0],
      [8, 0, 0],
      [11, 0, 0],
      [13, 1, 0],
      [15, 3, 0],
    ],
    [null],
  ],
  102: [
    [null, [10, 21, 0], [8, 21, 0], [6, 20, 0], [5, 17, 0], [5, 0, 0]],
    [null, [2, 14, 0], [9, 14, 0]],
    [null],
  ],
  103: [
    [
      null,
      [15, 14, 0],
      [15, -2, 0],
      [14, -5, 0],
      [13, -6, 0],
      [11, -7, 0],
      [8, -7, 0],
      [6, -6, 0],
    ],
    [
      null,
      [15, 11, 0],
      [13, 13, 0],
      [11, 14, 0],
      [8, 14, 0],
      [6, 13, 0],
      [4, 11, 0],
      [3, 8, 0],
      [3, 6, 0],
      [4, 3, 0],
      [6, 1, 0],
      [8, 0, 0],
      [11, 0, 0],
      [13, 1, 0],
      [15, 3, 0],
    ],
    [null],
  ],
  104: [
    [null, [4, 21, 0], [4, 0, 0]],
    [
      null,
      [4, 10, 0],
      [7, 13, 0],
      [9, 14, 0],
      [12, 14, 0],
      [14, 13, 0],
      [15, 10, 0],
      [15, 0, 0],
    ],
    [null],
  ],
  105: [
    [null, [3, 21, 0], [4, 20, 0], [5, 21, 0], [4, 22, 0], [3, 21, 0]],
    [null, [4, 14, 0], [4, 0, 0]],
    [null],
  ],
  106: [
    [null, [5, 21, 0], [6, 20, 0], [7, 21, 0], [6, 22, 0], [5, 21, 0]],
    [null, [6, 14, 0], [6, -3, 0], [5, -6, 0], [3, -7, 0], [1, -7, 0]],
    [null],
  ],
  107: [
    [null, [4, 21, 0], [4, 0, 0]],
    [null, [14, 14, 0], [4, 4, 0]],
    [null, [8, 8, 0], [15, 0, 0]],
    [null],
  ],
  108: [[null, [4, 21, 0], [4, 0, 0]], [null]],
  109: [
    [null, [4, 14, 0], [4, 0, 0]],
    [
      null,
      [4, 10, 0],
      [7, 13, 0],
      [9, 14, 0],
      [12, 14, 0],
      [14, 13, 0],
      [15, 10, 0],
      [15, 0, 0],
    ],
    [
      null,
      [15, 10, 0],
      [18, 13, 0],
      [20, 14, 0],
      [23, 14, 0],
      [25, 13, 0],
      [26, 10, 0],
      [26, 0, 0],
    ],
    [null],
  ],
  110: [
    [null, [4, 14, 0], [4, 0, 0]],
    [
      null,
      [4, 10, 0],
      [7, 13, 0],
      [9, 14, 0],
      [12, 14, 0],
      [14, 13, 0],
      [15, 10, 0],
      [15, 0, 0],
    ],
    [null],
  ],
  111: [
    [
      null,
      [8, 14, 0],
      [6, 13, 0],
      [4, 11, 0],
      [3, 8, 0],
      [3, 6, 0],
      [4, 3, 0],
      [6, 1, 0],
      [8, 0, 0],
      [11, 0, 0],
      [13, 1, 0],
      [15, 3, 0],
      [16, 6, 0],
      [16, 8, 0],
      [15, 11, 0],
      [13, 13, 0],
      [11, 14, 0],
      [8, 14, 0],
    ],
    [null],
  ],
  112: [
    [null, [4, 14, 0], [4, -7, 0]],
    [
      null,
      [4, 11, 0],
      [6, 13, 0],
      [8, 14, 0],
      [11, 14, 0],
      [13, 13, 0],
      [15, 11, 0],
      [16, 8, 0],
      [16, 6, 0],
      [15, 3, 0],
      [13, 1, 0],
      [11, 0, 0],
      [8, 0, 0],
      [6, 1, 0],
      [4, 3, 0],
    ],
    [null],
  ],
  113: [
    [null, [15, 14, 0], [15, -7, 0]],
    [
      null,
      [15, 11, 0],
      [13, 13, 0],
      [11, 14, 0],
      [8, 14, 0],
      [6, 13, 0],
      [4, 11, 0],
      [3, 8, 0],
      [3, 6, 0],
      [4, 3, 0],
      [6, 1, 0],
      [8, 0, 0],
      [11, 0, 0],
      [13, 1, 0],
      [15, 3, 0],
    ],
    [null],
  ],
  114: [
    [null, [4, 14, 0], [4, 0, 0]],
    [null, [4, 8, 0], [5, 11, 0], [7, 13, 0], [9, 14, 0], [12, 14, 0]],
    [null],
  ],
  115: [
    [
      null,
      [14, 11, 0],
      [13, 13, 0],
      [10, 14, 0],
      [7, 14, 0],
      [4, 13, 0],
      [3, 11, 0],
      [4, 9, 0],
      [6, 8, 0],
      [11, 7, 0],
      [13, 6, 0],
      [14, 4, 0],
      [14, 3, 0],
      [13, 1, 0],
      [10, 0, 0],
      [7, 0, 0],
      [4, 1, 0],
      [3, 3, 0],
    ],
    [null],
  ],
  116: [
    [null, [5, 21, 0], [5, 4, 0], [6, 1, 0], [8, 0, 0], [10, 0, 0]],
    [null, [2, 14, 0], [9, 14, 0]],
    [null],
  ],
  117: [
    [
      null,
      [4, 14, 0],
      [4, 4, 0],
      [5, 1, 0],
      [7, 0, 0],
      [10, 0, 0],
      [12, 1, 0],
      [15, 4, 0],
    ],
    [null, [15, 14, 0], [15, 0, 0]],
    [null],
  ],
  118: [[null, [2, 14, 0], [8, 0, 0]], [null, [14, 14, 0], [8, 0, 0]], [null]],
  119: [
    [null, [3, 14, 0], [7, 0, 0]],
    [null, [11, 14, 0], [7, 0, 0]],
    [null, [11, 14, 0], [15, 0, 0]],
    [null, [19, 14, 0], [15, 0, 0]],
    [null],
  ],
  120: [[null, [3, 14, 0], [14, 0, 0]], [null, [14, 14, 0], [3, 0, 0]], [null]],
  121: [
    [null, [2, 14, 0], [8, 0, 0]],
    [
      null,
      [14, 14, 0],
      [8, 0, 0],
      [6, -4, 0],
      [4, -6, 0],
      [2, -7, 0],
      [1, -7, 0],
    ],
    [null],
  ],
  122: [
    [null, [14, 14, 0], [3, 0, 0]],
    [null, [3, 14, 0], [14, 14, 0]],
    [null, [3, 0, 0], [14, 0, 0]],
    [null],
  ],
  123: [
    [
      null,
      [9, 25, 0],
      [7, 24, 0],
      [6, 23, 0],
      [5, 21, 0],
      [5, 19, 0],
      [6, 17, 0],
      [7, 16, 0],
      [8, 14, 0],
      [8, 12, 0],
      [6, 10, 0],
    ],
    [
      null,
      [7, 24, 0],
      [6, 22, 0],
      [6, 20, 0],
      [7, 18, 0],
      [8, 17, 0],
      [9, 15, 0],
      [9, 13, 0],
      [8, 11, 0],
      [4, 9, 0],
      [8, 7, 0],
      [9, 5, 0],
      [9, 3, 0],
      [8, 1, 0],
      [7, 0, 0],
      [6, -2, 0],
      [6, -4, 0],
      [7, -6, 0],
    ],
    [
      null,
      [6, 8, 0],
      [8, 6, 0],
      [8, 4, 0],
      [7, 2, 0],
      [6, 1, 0],
      [5, -1, 0],
      [5, -3, 0],
      [6, -5, 0],
      [7, -6, 0],
      [9, -7, 0],
    ],
    [null],
  ],
  124: [[null, [4, 25, 0], [4, -7, 0]], [null]],
  125: [
    [
      null,
      [5, 25, 0],
      [7, 24, 0],
      [8, 23, 0],
      [9, 21, 0],
      [9, 19, 0],
      [8, 17, 0],
      [7, 16, 0],
      [6, 14, 0],
      [6, 12, 0],
      [8, 10, 0],
    ],
    [
      null,
      [7, 24, 0],
      [8, 22, 0],
      [8, 20, 0],
      [7, 18, 0],
      [6, 17, 0],
      [5, 15, 0],
      [5, 13, 0],
      [6, 11, 0],
      [10, 9, 0],
      [6, 7, 0],
      [5, 5, 0],
      [5, 3, 0],
      [6, 1, 0],
      [7, 0, 0],
      [8, -2, 0],
      [8, -4, 0],
      [7, -6, 0],
    ],
    [
      null,
      [8, 8, 0],
      [6, 6, 0],
      [6, 4, 0],
      [7, 2, 0],
      [8, 1, 0],
      [9, -1, 0],
      [9, -3, 0],
      [8, -5, 0],
      [7, -6, 0],
      [5, -7, 0],
    ],
    [null],
  ],
  126: [
    [
      null,
      [3, 6, 0],
      [3, 8, 0],
      [4, 11, 0],
      [6, 12, 0],
      [8, 12, 0],
      [10, 11, 0],
      [14, 8, 0],
      [16, 7, 0],
      [18, 7, 0],
      [20, 8, 0],
      [21, 10, 0],
    ],
    [
      null,
      [3, 8, 0],
      [4, 10, 0],
      [6, 11, 0],
      [8, 11, 0],
      [10, 10, 0],
      [14, 7, 0],
      [16, 6, 0],
      [18, 6, 0],
      [20, 7, 0],
      [21, 10, 0],
      [21, 12, 0],
    ],
    [null],
  ],
};

const hersheyWidth = {
  32: 16,
  33: 10,
  34: 16,
  35: 21,
  36: 20,
  37: 24,
  38: 26,
  39: 10,
  40: 14,
  41: 14,
  42: 16,
  43: 26,
  44: 10,
  45: 26,
  46: 10,
  47: 22,
  48: 20,
  49: 20,
  50: 20,
  51: 20,
  52: 20,
  53: 20,
  54: 20,
  55: 20,
  56: 20,
  57: 20,
  58: 10,
  59: 10,
  60: 24,
  61: 26,
  62: 24,
  63: 18,
  64: 27,
  65: 18,
  66: 21,
  67: 21,
  68: 21,
  69: 19,
  70: 18,
  71: 21,
  72: 22,
  73: 8,
  74: 16,
  75: 21,
  76: 17,
  77: 24,
  78: 22,
  79: 22,
  80: 21,
  81: 22,
  82: 21,
  83: 20,
  84: 16,
  85: 22,
  86: 18,
  87: 24,
  88: 20,
  89: 18,
  90: 20,
  91: 14,
  92: 14,
  93: 14,
  94: 16,
  95: 16,
  96: 10,
  97: 19,
  98: 19,
  99: 18,
  100: 19,
  101: 18,
  102: 12,
  103: 19,
  104: 19,
  105: 8,
  106: 10,
  107: 17,
  108: 8,
  109: 30,
  110: 19,
  111: 19,
  112: 19,
  113: 19,
  114: 13,
  115: 17,
  116: 12,
  117: 19,
  118: 16,
  119: 22,
  120: 17,
  121: 16,
  122: 17,
  123: 14,
  124: 8,
  125: 14,
  126: 24,
};

const hersheySegments = [];

for (const key of Object.keys(hersheyPaths)) {
  const segments = [];
  hersheySegments[key] = segments;
  for (const path of hersheyPaths[key]) {
    let last;
    for (const point of path) {
      if (point === null) {
        continue;
      }
      if (last) {
        segments.push([last, point]);
      }
      last = point;
    }
  }
}

const toSegments$1 = (letters) => {
  let xOffset = 0;
  const rendered = [];
  for (const letter of letters) {
    const code = letter.charCodeAt(0);
    const segments = hersheySegments[code];
    if (segments) {
      rendered.push(translate(Segments$1(segments), [xOffset, 0, 0]));
    }
    xOffset += hersheyWidth[code] || 0;
  }
  return scaleUniformly(Group(rendered), 1 / 28);
};

const Hershey = (text, size) => scaleUniformly(toSegments$1(text), size);

const Segment = (segment) => taggedSegments({}, [segment]);

const Segments = (segments) => taggedSegments({}, segments);

const X$5 = 0;
const Y$5 = 1;
const Z$4 = 2;

const MIN = 0;
const MAX = 1;

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
  const center = roundCoordinate(scale(0.5, add(min, max)));
  const offset = [0, 0, 0];
  let index = 0;
  while (index < spec.length) {
    switch (spec[index++]) {
      case 'x': {
        switch (spec[index]) {
          case '>':
            offset[X$5] = -min[X$5];
            index += 1;
            break;
          case '<':
            offset[X$5] = -max[X$5];
            index += 1;
            break;
          default:
            offset[X$5] = -center[X$5];
        }
        break;
      }
      case 'y': {
        switch (spec[index]) {
          case '>':
            offset[Y$5] = -min[Y$5];
            index += 1;
            break;
          case '<':
            offset[Y$5] = -max[Y$5];
            index += 1;
            break;
          default:
            offset[Y$5] = -center[Y$5];
        }
        break;
      }
      case 'z': {
        switch (spec[index]) {
          case '>':
            offset[Z$4] = -min[Z$4];
            index += 1;
            break;
          case '<':
            offset[Z$4] = -max[Z$4];
            index += 1;
            break;
          default:
            offset[Z$4] = -center[Z$4];
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
    subtract(offset, origin)
  );
  return reference;
};

const by = (geometry, selections) => {
  const placed = [];
  for (const selection of selections) {
    for (const leaf of getLeafs(selection)) {
      const { global } = getInverseMatrices(leaf);
      // Perform the operation then place the
      // result in the global frame of the reference.
      placed.push(transform(geometry, global));
    }
  }
  return Group(placed);
};

const align = (geometry, spec, origin) =>
  by(geometry, [alignment(geometry, spec, origin)]);

const bb = (
  geometry,
  xOffset = 1,
  yOffset = xOffset,
  zOffset = yOffset,
  { flat = false } = {}
) => {
  const bounds = measureBoundingBox(geometry);
  if (bounds === undefined) {
    return Empty();
  } else if (flat) {
    const [min, max] = bounds;
    return Box([], {
      c2: add(min, [-xOffset, -yOffset, 0]),
      c1: add(max, [xOffset, yOffset, 0]),
    });
  } else {
    const [min, max] = bounds;
    return Box([], {
      c2: add(min, [-xOffset, -yOffset, -zOffset]),
      c1: add(max, [xOffset, yOffset, zOffset]),
    });
  }
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

const filter$E = (noVoid, onlyGraph) => (geometry) =>
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
  linearize(concreteGeometry, filter$E(noVoid, onlyGraph), inputs);
  const count = inputs.length;
  for (const geometry of geometries) {
    linearize(geometry, filter$E(noVoid), inputs);
  }
  const outputs = clip$1(inputs, count, open, exact);
  const ghosts = [];
  if (!noGhost) {
    for (let nth = 0; nth < inputs.length; nth++) {
      ghosts.push(hasMaterial(hasTypeGhost(inputs[nth]), 'ghost'));
    }
  }
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
    filter$E(modes.noVoid, { ...modes, onlyGraph: true })
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

const filterTargets$1 = (noVoid) => (geometry) =>
  ['graph', 'polygonsWithHoles', 'segments', 'points'].includes(
    geometry.type
  ) &&
  (isNotTypeGhost(geometry) || (!noVoid && isTypeVoid(geometry)));

const filterRemoves = (noVoid) => (geometry) =>
  filterTargets$1(noVoid)(geometry) && isNotTypeMasked(geometry);

const cut = (
  toCut,
  toClips,
  { open = false, exact, noVoid, noGhost }
) => {
  const inputs = linearize(toCut, filterTargets$1(noVoid));
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
  return Group([replacer(inputs, outputs, count)(toCut), ...ghosts]);
};

const cutFrom = (toClip, toCut, options) =>
  cut(toCut, [toClip], options);

const cutOut = (cutGeometry, clipGeometry, modes) => [
  cut(cutGeometry, [clipGeometry], { ...modes, noGhost: true }),
  clip(cutGeometry, [clipGeometry], { ...modes, noGhost: true }),
];

const ghost = (geometry) => hasTypeGhost(geometry);

const hasColor = (geometry, name) =>
  rewriteTags(toTagsFromName$1(name), [], geometry);

const Ref = (name, nx = 0, ny = 0, nz = 1, coordinate) => {
  let x = 0;
  let y = 0;
  let z = 0;
  if (coordinate) {
    [x = 0, y = 0, z = 0, nx = 0, ny = 0, nz = 1] = coordinate;
  }
  // Disorient the point as though the source of a segment.
  const inverse = fromSegmentToInverseTransform(
    [
      [x, y, z],
      [x + nx, y + ny, z + nz],
    ],
    [0, 0, 1]
  );
  const matrix = invertTransform(inverse);
  const point = Point(0, 0, 0);
  const content = name ? as(point, [name]) : point;
  return hasTypeReference(transform(content, matrix));
};

const ref = (geometry, name) => transform(Ref(name), geometry.matrix);

const orZero = (v) => {
  const r = v.length === 0 ? [0] : v;
  try {
    r.map((x) => x);
  } catch (e) {
    console.log(e.stack);
  }
  return r;
};

const X$4 = (xs) =>
  Group(
    orZero(xs).map((x) =>
      ref(translate(rotateY(Point(0, 0, 0), -1 / 4), [x, 0, 0]))
    )
  );
const Y$4 = (ys) =>
  Group(
    orZero(ys).map((y) =>
      ref(translate(rotateX(Point(0, 0, 0), -1 / 4), [0, y, 0]))
    )
  );
const Z$3 = (zs) =>
  Group(orZero(zs).map((z) => ref(translate(Point(0, 0, 0), [0, 0, z]))));

const YZ = (xs) =>
  Group(
    orZero(xs).map((x) =>
      ref(translate(rotateY(Point(0, 0, 0), -1 / 4), [x, 0, 0]))
    )
  );
const XZ = (ys) =>
  Group(
    orZero(ys).map((y) =>
      ref(translate(rotateX(Point(0, 0, 0), -1 / 4), [0, y, 0]))
    )
  );
const XY = (zs) =>
  Group(orZero(zs).map((z) => ref(translate(Point(0, 0, 0), [0, 0, z]))));

const ZY = (xs) =>
  Group(
    orZero(xs).map((x) =>
      ref(translate(rotateY(Point(0, 0, 0), 1 / 4), [-x, 0, 0]))
    )
  );
const ZX = (ys) =>
  Group(
    orZero(ys).map((y) =>
      ref(translate(rotateX(Point(0, 0, 0), 1 / 4), [0, -y, 0]))
    )
  );
const YX = (zs) =>
  Group(
    orZero(zs).map((z) =>
      ref(translate(rotateX(Point(0, 0, 0), 1 / 2), [0, 0, -z]))
    )
  );

const RX = (ts) =>
  Group(orZero(ts).map((t) => ref(rotateX(Point(0, 0, 0), t))));
const RY = (ts) =>
  Group(orZero(ts).map((t) => ref(rotateY(Point(0, 0, 0), t))));
const RZ = (ts) =>
  Group(orZero(ts).map((t) => ref(rotateZ(Point(0, 0, 0), t))));

const filterInputs$1 = (geometry) =>
  ['graph', 'polygonsWithHoles', 'segments', 'points'].includes(
    geometry.type
  ) && isNotTypeGhost(geometry);

const filterReferences$1 = (geometry) =>
  ['graph', 'polygonsWithHoles', 'segments', 'points', 'empty'].includes(
    geometry.type
  );

const section = (geometry, referenceGeometries = []) => {
  const inputs = linearize(geometry, filterInputs$1);
  const count = inputs.length;
  if (referenceGeometries.length === 0) {
    // Default to the Z(0) plane.
    inputs.push(Ref());
  } else {
    for (const referenceGeometry of referenceGeometries) {
      linearize(referenceGeometry, filterReferences$1, inputs);
    }
  }
  const outputs = section$1(inputs, count);
  return replacer(inputs, outputs, count)(geometry);
};

const X$3 = 0;
const Y$3 = 1;

const Gauge = (
  geometry,
  refs,
  offset = 5,
  length = 0,
  color = 'green'
) => {
  const gauges = [];
  for (const ref of refs) {
    const { local, global } = getInverseMatrices(ref);
    const bounds = measureBoundingBox(section(transform(geometry, local)));
    if (bounds === undefined) {
      continue;
    }
    const [min, max] = bounds;
    const left = min[X$3];
    const right = max[X$3];
    const back = max[Y$3];
    const width = right - left;
    const base = back - length;
    const offsetBase = back + offset;
    const lines = Segments([
      [
        [left, base, 0],
        [left, offsetBase, 0],
      ],
      [
        [right, base, 0],
        [right, offsetBase, 0],
      ],
      [
        [left, offsetBase, 0],
        [right, offsetBase, 0],
      ],
    ]);
    const text = translate(
      align(
        Hershey(`${width.toFixed(1).replace(/\.0+$/, '')}`, width * 0.05),
        'xy'
      ),
      [(left + right) / 2, back + offset, 0]
    );
    const box = bb(text, offset);
    gauges.push(
      transform(Group([text, cut(lines, [box], { noGhost: true })]), global)
    );
  }
  return ghost(hasColor(Group(gauges), color));
};

const gauge = (geometry, refs, offset, length, color) =>
  Group([geometry, Gauge(geometry, refs, offset, length, color)]);

// Unit icosahedron vertices.
const points = Points([
  [0.850651, 0.0, -0.525731],
  [0.850651, -0.0, 0.525731],
  [-0.850651, -0.0, 0.525731],
  [-0.850651, 0.0, -0.525731],
  [0.0, -0.525731, 0.850651],
  [0.0, 0.525731, 0.850651],
  [0.0, 0.525731, -0.850651],
  [0.0, -0.525731, -0.850651],
  [-0.525731, -0.850651, -0.0],
  [0.525731, -0.850651, -0.0],
  [0.525731, 0.850651, 0.0],
  [-0.525731, 0.850651, 0.0],
]);

const Icosahedron = ([x = 1, y = x, z = x]) => {
  const [c1, c2] = buildCorners(x, y, z);
  const scale = computeScale(c1, c2);
  const middle = computeMiddle(c1, c2);
  return translate(scale$1(ConvexHull([points]), scale), middle);
};

const filter$D = (geometry) =>
  ['graph', 'polygonsWithHoles'].includes(geometry.type) &&
  isNotTypeGhost(geometry) &&
  isNotTypeVoid(geometry);

const ironImpl = (geometry, turn = 1) => {
  const inputs = [];
  linearize(geometry, filter$D, inputs);
  const outputs = iron$1(inputs, turn);
  return replacer(inputs, outputs)(geometry);
};

const iron = (geometry, turn = 1, geometries) =>
  ironImpl(Group([geometry, ...geometries]), turn);

const Iron = (geometries, turn = 1) => ironImpl(Group(geometries), turn);

const Label = (text, distance) =>
  hasTypeLabel(
    ghost(
      Group([
        Edge([0, 0, 0], [distance, 0, 0]),
        translate(Hershey(text, 10), [distance, 0, 0]),
      ])
    )
  );

// 1mm seems reasonable for spheres.
const DEFAULT_ORB_ZAG = 1;

const Orb = ([x = 1, y = x, z = x], { zag = DEFAULT_ORB_ZAG } = {}) => {
  const [c1, c2] = buildCorners(x, y, z);
  const scale$2 = scale(0.5, computeScale(c1, c2));
  const middle = computeMiddle(c1, c2);
  const radius = Math.max(...scale$2);
  const tolerance = zag / radius;
  const unitSphere = makeUnitSphere(
    /* angularBound= */ 30,
    tolerance,
    tolerance
  );
  return makeAbsolute(translate(scale$1(unitSphere, scale$2), middle));
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

const ensurePages = (geometry, depth = 0) => {
  const sheets = [];
  eachItem(geometry, (item) => {
    if (item.type === 'item' && item.tags.includes('pack:sheet')) {
      sheets.push(item);
    }
  });
  if (sheets.length === 0) {
    // If there are no packed sheets, assume the geometry is one big sheet.
    sheets.push(geometry);
  }
  return sheets;
};

const toolFilter = (geometry) =>
  ['graph', 'polygonsWithHoles'].includes(geometry.type) &&
  isNotTypeGhost(geometry) &&
  isNotTypeVoid(geometry);

const segmentsFilter = (geometry) =>
  ['segments', 'polygonsWithHoles'].includes(geometry.type) &&
  isNotTypeGhost(geometry) &&
  isNotTypeVoid(geometry);

const Route = (tool, geometries) => {
  const inputs = [];
  linearize(tool, toolFilter, inputs);
  const toolCount = inputs.length;
  for (const geometry of geometries) {
    linearize(geometry, segmentsFilter, inputs);
  }
  const outputs = route(inputs, toolCount);
  return Group(outputs);
};

const emitNote = (md) => emit({ md, hash: computeHash(md) });

const note = (geometry, md) => {
  if (typeof md !== 'string') {
    throw Error(`note expects a string`);
  }
  emitNote(md);
  return geometry;
};

const render$1 = (abstract, shape) => {
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
  render$1(walk(geometry));
  return geometry;
};

const filter$C = (geometry) => ['graph'].includes(geometry.type);

const approximate = (geometry, faceCount, minErrorDrop) => {
  const inputs = linearize(geometry, filter$C);
  const outputs = approximate$1(inputs, faceCount, minErrorDrop);
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

const filter$B = (geometry) =>
  ['graph', 'polygonsWithHoles', 'segments', 'points'].includes(
    geometry.type
  ) &&
  (isNotTypeGhost(geometry) || isTypeVoid(geometry));

const Disjoint = (geometries, { exact } = {}) => {
  const inputs = [];
  for (const geometry of geometries) {
    linearize(geometry, filter$B, inputs);
  }
  const outputs = disjoint$1(inputs, exact);
  const disjointGeometries = [];
  const update = replacer(inputs, outputs);
  for (const geometry of geometries) {
    disjointGeometries.push(update(geometry));
  }
  return Group(disjointGeometries);
};

const fit = (geometry, geometries, modes) =>
  Disjoint([...geometries, geometry], modes);

const fitTo = (geometry, geometries, modes) =>
  Disjoint([geometry, ...geometries], modes);

const disjoint = (geometry, modes) => Disjoint([geometry], modes);

const assemble = (geometries, exact) =>
  disjoint(geometries, undefined);

const at = (geometry, selection) => {
  const { local, global } = getInverseMatrices(geometry);
  const { local: selectionLocal, global: selectionGlobal } =
    getInverseMatrices(selection);
  const localGeometry = transform(geometry, local);
  const selectionLocalGeometry = transform(localGeometry, selectionLocal);
  // We split this operation to allow the caller to do arbitrary operations in the middle.
  return [
    selectionLocalGeometry,
    (newSelectionLocalGeometry) => {
      const newSelectionGlobalGeometry = transform(
        newSelectionLocalGeometry,
        selectionGlobal
      );
      const newGlobalGeometry = transform(newSelectionGlobalGeometry, global);
      return newGlobalGeometry;
    },
  ];
};

const base = (geometry) => {
  const { local } = getInverseMatrices(geometry);
  return transform(geometry, local);
};

const filter$A = (geometry) =>
  ['graph', 'points', 'segments', 'polygonsWithHoles'].includes(
    geometry.type
  ) && isNotTypeGhost(geometry);

const bend = (geometry, radius = 100, edgeLength = 1) => {
  const inputs = linearize(geometry, filter$A);
  const outputs = bend$1(inputs, radius, edgeLength);
  return replacer(inputs, outputs)(geometry);
};

const filter$z = (geometry) =>
  geometry.type === 'graph' && !geometry.graph.serializedSurfaceMesh;

const serialize = (geometry) => {
  const inputs = [];
  linearize(geometry, filter$z, inputs, /* includeSketches= */ true);
  if (inputs.length === 0) {
    return geometry;
  }
  serialize$1(inputs);
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

const filterGeometry = (geometry) =>
  ['graph', 'polygonsWithHoles', 'segments', 'points'].includes(
    geometry.type
  ) && isNotTypeGhost(geometry);

const filterReferences = (geometry) =>
  ['graph', 'polygonsWithHoles', 'segments', 'points', 'empty'].includes(
    geometry.type
  );

const cast = (
  planeReference = XY([0]),
  sourceReference = XY([1]),
  geometry
) => {
  const inputs = [];
  linearize(planeReference, filterReferences, inputs);
  inputs.length = 1;
  linearize(sourceReference, filterReferences, inputs);
  inputs.length = 2;
  linearize(geometry, filterGeometry, inputs, { includeItems: true });
  const outputs = cast$1(inputs);
  return replacer(inputs, outputs)(geometry);
};

const filter$y = (geometry) =>
  ['graph', 'polygonsWithHoles'].includes(geometry.type) &&
  isNotTypeGhost(geometry);

const computeCentroid = (geometry, top, bottom) =>
  Group(computeCentroid$1(linearize(geometry, filter$y)));

const computeGeneralizedDiameter = (geometry) => {
  const coordinates = toCoordinates(geometry);
  let maximumDiameter = 0;
  for (let a of coordinates) {
    for (let b of coordinates) {
      const diameter = distance$1(a, b);
      if (diameter > maximumDiameter) {
        maximumDiameter = diameter;
      }
    }
  }
  return maximumDiameter;
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
  return taggedGroup({}, ...outputs);
};

const filter$x = (geometry) =>
  isNotTypeGhost(geometry) &&
  ((geometry.type === 'graph' && !geometry.graph.isEmpty) ||
    ['polygonsWithHoles', 'segments', 'points'].includes(geometry.type));

const computeOrientedBoundingBox = (
  geometry,
  { segments = true, mesh = false } = {}
) =>
  Group(
    computeOrientedBoundingBox$1(
      linearize(geometry, filter$x),
      segments,
      mesh
    )
  );

const obb = (geometry) =>
  computeOrientedBoundingBox(geometry, { mesh: true });

const computeReliefFromImage = (
  x,
  y,
  z,
  data,
  angularBound,
  radiusBound,
  distanceBound,
  errorBound,
  extrusion,
  doClose
) => {
  const outputs = computeReliefFromImage$1(
    x,
    y,
    z,
    data,
    angularBound,
    radiusBound,
    distanceBound,
    errorBound,
    extrusion,
    doClose
  );
  return taggedGroup({}, ...outputs);
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
  annealingDecay,
  { simple = false } = {}
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
    annealingDecay,
    simple
  );
  return taggedGroup({}, ...outputs);
};

const copy = (geometry, count) => {
  const copies = [];
  for (let nth = 0; nth < count; nth++) {
    copies.push(geometry);
  }
  return Group(copies);
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
    return replacer(inputs, outputs)(concreteGeometry);
  } catch (e) {
    console.log(e.stack);
    throw e;
  }
};

const filterShape = (geometry) =>
  ['graph', 'polygonsWithHoles'].includes(geometry.type) &&
  isNotTypeGhost(geometry);

const filterSelection = (geometry) =>
  ['graph', 'polygonsWithHoles', 'points', 'segments'].includes(
    geometry.type
  ) && isNotTypeGhost(geometry);

const deform = (
  geometry,
  selections,
  { iterations, tolerance, alpha } = {}
) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filterShape, inputs);
  const length = inputs.length;
  for (const selection of selections) {
    linearize(toConcreteGeometry(selection), filterSelection, inputs);
  }
  const outputs = deform$1(inputs, length, iterations, tolerance, alpha);
  return replacer(inputs, outputs, length)(concreteGeometry);
};

const filter$u = (geometry) => ['graph'].includes(geometry.type);

const demesh = (geometry) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter$u, inputs);
  const outputs = demesh$1(inputs);
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
  return taggedGroup(
    {},
    replacer(inputs, outputs)(concreteGeometry),
    ...ghosts
  );
};

const SOURCE$1 = 0;
const TARGET$1 = 1;

const disorientSegment = (segment, matrix, normal) => {
  const absoluteSegment = [
    transformCoordinate(segment[SOURCE$1], matrix),
    transformCoordinate(segment[TARGET$1], matrix),
  ];
  const absoluteOppositeSegment = [
    transformCoordinate(segment[TARGET$1], matrix),
    transformCoordinate(segment[SOURCE$1], matrix),
  ];
  const absoluteNormal = normal
    ? subtract(transformCoordinate(normal, matrix), absoluteSegment[SOURCE$1])
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
    transformCoordinate(absoluteSegment[SOURCE$1], inverse),
    transformCoordinate(absoluteSegment[TARGET$1], inverse),
  ];
  const oppositeSegment = [
    transformCoordinate(absoluteSegment[TARGET$1], oppositeInverse),
    transformCoordinate(absoluteSegment[SOURCE$1], oppositeInverse),
  ];
  const inverseMatrix = invertTransform(inverse);
  const oppositeInverseMatrix = invertTransform(oppositeInverse);

  return [
    taggedSegments({ matrix: inverseMatrix }, [baseSegment]),
    taggedSegments({ matrix: oppositeInverseMatrix }, [oppositeSegment]),
  ];
};

// We split on into two phases to allow arbitrary operations to occur inbetween.

const onPre = (geometry, selection) => {
  const results = [];
  for (const inputLeaf of getLeafs(selection)) {
    const global = inputLeaf.matrix;
    const local = invertTransform(global);
    // Switch to the local coordinate space, perform the operation, and come back to the global coordinate space.
    const localInputLeaf = transform(inputLeaf, local);
    results.push({ inputLeaf, localInputLeaf, global });
  }
  return results;
};

const onPost = (geometry, results) => {
  const inputLeafs = [];
  const outputLeafs = [];
  for (const { inputLeaf, localOutputLeaf, global } of results) {
    inputLeafs.push(inputLeaf);
    outputLeafs.push(transform(localOutputLeaf, global));
  }
  return replacer(inputLeafs, outputLeafs)(geometry);
};

const on = (geometry, selection, op = (g) => g) => {
  const results = [];
  for (const { inputLeaf, localInputLeaf, global } of onPre(
    geometry,
    selection
  )) {
    const localOutputLeaf = op(localInputLeaf);
    results.push({ inputLeaf, localOutputLeaf, global });
  }
  return onPost(geometry, results);
};

const drop = (geometry, selector) => on(geometry, selector, ghost);

const each = (geometry) => getLeafs(geometry);

const filter$s = (geometry) =>
  ['graph', 'polygonsWithHoles'].includes(geometry.type) &&
  isNotTypeGhost(geometry);

const eachFaceEdges = (
  geometry,
  { select = [] } = {},
  emitFaceEdges
) => {
  if (!(select instanceof Array)) {
    select = [select];
  }
  const inputs = linearize(geometry, filter$s);
  const count = inputs.length;
  for (const selection of select) {
    linearize(selection, filter$s, inputs);
  }
  const outputs = faceEdges(inputs, count).filter(({ type }) =>
    ['polygonsWithHoles', 'segments'].includes(type)
  );
  for (let nth = 0; nth < outputs.length; nth += 2) {
    const face = outputs[nth + 0];
    const edges = outputs[nth + 1];
    emitFaceEdges(face, edges);
  }
};

const toFaceEdgesList = (geometry, options) => {
  const faceEdges = [];
  eachFaceEdges(geometry, options, (face, edges) =>
    faceEdges.push({ face, edges })
  );
  return faceEdges;
};

// TODO: Add an option to include a virtual segment at the target of the last
// edge.

const SOURCE = 0;
const TARGET = 1;

// TODO: Fix up option destructuring to handle geometry, etc.
const toOrientedFaceEdgesList = (
  geometry,
  _edgeOp,
  _faceOp,
  _groupOp,
  { select = [geometry] } = {}
) => {
  const faces = [];
  const faceEdgesList = toFaceEdgesList(geometry, { select });
  for (const { face, edges } of faceEdgesList) {
    const edgeResults = [];
    const { matrix, segments, normals } = edges;
    if (segments) {
      for (let nth = 0; nth < segments.length; nth++) {
        const baseSegment = segments[nth];
        const [forward, backward] = disorientSegment(
          baseSegment,
          matrix,
          normals ? normals[nth] : undefined
        );
        edgeResults.push({
          segment: forward,
          length: distance$1(baseSegment[SOURCE], baseSegment[TARGET]),
          backward,
        });
      }
    }
    faces.push({ face, edges: edgeResults });
  }
  return faces;
};

const filter$r = (geometry) =>
  ['graph', 'polygonsWithHoles'].includes(geometry.type) &&
  isNotTypeGhost(geometry);

const outline = (geometry, selections = []) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter$r, inputs);
  const count = inputs.length;
  for (const selection of selections) {
    linearize(toConcreteGeometry(selection), filter$r, inputs);
  }
  const outputs = outline$1(inputs, count);
  return replacer(inputs, outputs)(concreteGeometry);
};

const filter$q = ({ type }) => type === 'segments';

const eachSegment = (geometry, emit, selections = []) => {
  if (!(selections instanceof Array)) {
    selections = [selections];
  }
  for (const { matrix, segments, normals, faces } of linearize(
    outline(geometry, selections),
    filter$q
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

const toSegments = (geometry, selections = []) => {
  const segments = [];
  eachSegment(geometry, (segment) => segments.push(segment), selections);
  return Segments(segments);
};

const toSegmentList = (geometry, selections = []) => {
  const segments = [];
  eachSegment(
    geometry,
    (segment) => segments.push(Segment(segment)),
    selections
  );
  return segments;
};

const filterTargets = (geometry) =>
  ['graph'].includes(geometry.type) && isNotTypeGhost(geometry);

const eachTriangle = (geometry, emitTriangle) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filterTargets, inputs);
  eachTriangle$1(inputs, emitTriangle);
};

const filter$p = (geometry) =>
  ['graph', 'polygonsWithHoles'].includes(geometry.type) &&
  isNotTypeGhost(geometry);

const separate = (geometry, { noShapes, noHoles, holesAsShapes }) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter$p, inputs);
  const outputs = separate$1(inputs, !noShapes, !noHoles, holesAsShapes);
  return taggedGroup({}, ...outputs);
};

const exterior = (geometry) =>
  Fuse([separate(geometry, { noHoles: true })]);

const filter$o = (geometry) =>
  ['graph'].includes(geometry.type) && isNotTypeGhost(geometry);

const fair = (
  geometry,
  selections,
  {
    numberOfIterations,
    remeshIterations,
    remeshRelaxationSteps,
    resolution,
  } = {}
) => {
  const inputs = [];
  linearize(geometry, filter$o, inputs);
  const count = inputs.length;
  for (const selection of selections) {
    linearize(selection, filter$o, inputs);
  }
  const outputs = fair$1(
    inputs,
    count,
    resolution,
    numberOfIterations,
    remeshIterations,
    remeshRelaxationSteps
  );
  const ghosts = [];
  for (let nth = count; nth < inputs.length; nth++) {
    ghosts.push(hasMaterial(hasTypeGhost(inputs[nth]), 'ghost'));
  }
  return taggedGroup({}, replacer(inputs, outputs, count)(geometry), ...ghosts);
};

const filter$n = (geometry) =>
  ['graph'].includes(geometry.type) && isNotTypeGhost(geometry);

const fix = (geometry, selfIntersection = true) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter$n, inputs);
  const outputs = fix$1(inputs, selfIntersection);
  return replacer(inputs, outputs)(concreteGeometry);
};

const origin = (geometry) => {
  const { local } = getInverseMatrices(geometry);
  return transform(Point(), local);
};

// FIX: This really needs a better name.
const flat = (geometry, reference = geometry) =>
  by(geometry, [origin(reference)]);

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

const fromPolygonSoup = (
  polygons,
  {
    tags = [],
    close = false,
    tolerance,
    faceCountLimit,
    minErrorDrop,
    strategies = [],
  } = {}
) => {
  const outputs = fromPolygonSoup$1(
    polygons,
    tolerance,
    faceCountLimit,
    minErrorDrop,
    strategies
  );
  return taggedGroup({}, ...outputs.map((output) => ({ ...output, tags })));
};

const gap = (geometry) => hasTypeGhost(hasTypeVoid(geometry));

const filter$m = (geometry) =>
  ['graph'].includes(geometry.type) && isNotTypeGhost(geometry);

const generateLowerEnvelope = (geometry, modes) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter$m, inputs);
  const outputs = generateEnvelope(inputs, /* envelopeType= */ 1, modes);
  return replacer(inputs, outputs)(concreteGeometry);
};

const filter$l = (geometry) =>
  ['graph'].includes(geometry.type) && isNotTypeGhost(geometry);

const generateUpperEnvelope = (geometry, modes) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter$l, inputs);
  const outputs = generateEnvelope(inputs, /* envelopeType= */ 0, modes);
  return replacer(inputs, outputs)(concreteGeometry);
};

const getSimpleList = (
  geometry,
  tags,
  { inItem = false, not = false } = {}
) => {
  const isMatch = oneOfTagMatcher(tags, 'item');
  const picks = [];
  const walk = (geometry, descend) => {
    const { tags, type } = geometry;
    if (type === 'group') {
      return descend();
    }
    let matched = false;
    if (isMatch(`type:${geometry.type}`)) {
      matched = true;
    } else {
      for (const tag of tags) {
        if (isMatch(tag)) {
          matched = true;
          break;
        }
      }
    }
    if (not) {
      if (!matched) {
        picks.push(geometry);
      }
    } else {
      if (matched) {
        picks.push(geometry);
      }
    }
    if (inItem || type !== 'item') {
      return descend();
    }
  };
  visit(geometry, walk);
  return picks;
};

const getList = (geometry, tags, options) => {
  const simple = [];
  const complex = [];
  for (const tag of tags) {
    if (tag.includes('/')) {
      complex.push(tag);
    } else {
      simple.push(tag);
    }
  }
  const picks =
    simple.length > 0 ? getSimpleList(geometry, simple, options) : [];
  if (complex.length === 0) {
    return picks;
  }
  for (const tag of complex) {
    const parts = tag.split('/');
    let last = [geometry];
    while (parts.length > 1) {
      const next = [];
      const part = parts.shift();
      for (const geometry of last) {
        for (const item of getSimpleList(geometry, [part], options)) {
          if (item.type !== 'item') {
            continue;
          }
          next.push(item.content[0]);
        }
      }
      last = next;
    }
    // parts now contains just the final part.
    for (const geometry of last) {
      for (const value of getSimpleList(geometry, parts, options)) {
        picks.push(value);
      }
    }
  }
  if (picks.length === 0 && !options.pass) {
    throw Error(`getList found no matches for ${tags.join(', ')}`);
  }
  return picks;
};

const get = (geometry, tags, options) =>
  Group(getList(geometry, tags, options));

const getAll = (geometry, tags) => get(geometry, tags, { inItem: true });

const getAllList = (geometry, tags) =>
  getList(geometry, tags, { inItem: true });

const getNot = (geometry, tags) => get(geometry, tags, { not: true });

const getNotList = (geometry, tags) =>
  getList(geometry, tags, { not: true });

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
    if (item.type === 'item' && item.tags.includes('pack:sheet')) {
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

const filter$k = (geometry, parent) =>
  ['graph', 'points', 'segments', 'polygonsWithHoles'].includes(
    geometry.type
  ) && isNotTypeGhost(geometry);

const grow = (geometry, tool) => {
  const inputs = linearize(geometry, filter$k);
  const count = inputs.length;
  linearize(tool, filter$k, inputs);
  const outputs = grow$1(inputs, count);
  return replacer(inputs, outputs)(geometry);
};

const hold = (geometry, geometries) => {
  if (geometry.type === 'item') {
    // FIX: Should use a better abstraction.
    return {
      ...geometry,
      content: [Group([geometry.content[0], ...geometries])],
    };
  } else {
    return Group([geometry, ...geometries]);
  }
};

const inItem = (geometry) => {
  if (geometry.type === 'item') {
    return geometry.content[0];
  }
  throw Error(`inItem: Not an item`);
};

const filter$j = (geometry) =>
  ['graph', 'polygonsWithHoles'].includes(geometry.type) &&
  isNotTypeGhost(geometry);

const inset = (
  geometry,
  initial = 1,
  { segments = 16, step, limit } = {}
) => {
  const inputs = linearize(geometry, filter$j);
  const outputs = inset$1(inputs, initial, step, limit, segments);
  // Inner insets should come first.
  return Group(outputs);
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

const filter$i = (noVoid) => (geometry) =>
  ['graph', 'polygonsWithHoles', 'segments'].includes(geometry.type) &&
  isNotTypeGhost(geometry);

const filterAdds = (noVoid) => (geometry) =>
  filter$i() && isNotTypeGhost(geometry);

const join = (geometry, geometries, { exact, noVoid }) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter$i(), inputs);
  const count = inputs.length;
  for (const geometry of geometries) {
    linearize(geometry, filterAdds(), inputs);
  }
  const outputs = join$1(inputs, count, exact);
  return replacer(inputs, outputs, count)(concreteGeometry);
};

const joinTo = (geometry, other, modes) =>
  join(other, [geometry], modes);

const keep = (tags, geometry) =>
  rewriteTags(['type:void'], [], geometry, tags, 'has not');

const filter$h = (geometry) =>
  ['graph', 'polygonsWithHoles'].includes(geometry.type) &&
  isNotTypeGhost(geometry);

const Loft = (geometries, { open = false }) => {
  const inputs = [];
  // This is wrong -- we produce a total linearization over geometries,
  // but really it should be partitioned.
  for (const geometry of geometries) {
    linearize(geometry, filter$h, inputs);
  }
  const outputs = loft$1(inputs, !open);
  return Group(outputs);
};

const loft = (geometry, geometries, mode) =>
  Loft([geometry, ...geometries], mode);

const log = (geometry, prefix = '') => {
  const text = prefix + JSON.stringify(geometry);
  const level = 'serious';
  const log = { text, level };
  const hash = computeHash(log);
  emit({ log, hash });
  log$1({ op: 'text', text });
  console.log(text);
  return geometry;
};

const maskedBy = (geometry, masks) => {
  const gaps = [];
  for (const mask of masks) {
    gaps.push(gap(mask));
  }
  return Group([...gaps, hasTypeMasked(geometry)]);
};

const masking = (mask, masked) =>
  Group([gap(mask), hasTypeMasked(masked)]);

const filter$g = (geometry) =>
  ['graph', 'polygonsWithHoles'].includes(geometry.type) &&
  isNotTypeVoid(geometry);

const measureArea = (geometry) => {
  const linear = [];
  linearize(geometry, filter$g, linear);
  return computeArea(linear);
};

const filter$f = (geometry) =>
  geometry.type === 'graph' && hasNotTypeVoid(geometry);

const measureVolume = (geometry) => {
  const linear = [];
  linearize(geometry, filter$f, linear);
  return computeVolume(linear);
};

const filter$e = (geometry) =>
  ['graph', 'polygonsWithHoles'].includes(geometry.type) &&
  isNotTypeGhost(geometry) &&
  isNotTypeVoid(geometry);

const minimizeOverhang = (
  geometry,
  threshold = 130,
  { split = false } = {}
) => {
  const inputs = linearize(geometry, filter$e);
  const count = inputs.length;
  const outputs = minimizeOverhang$1(inputs, threshold, split);
  const ghosts = [];
  for (let nth = 0; nth < inputs.length; nth++) {
    ghosts.push(hasMaterial(hasTypeGhost(inputs[nth]), 'ghost'));
  }
  return Group([replacer(inputs, outputs, count)(geometry), ...ghosts]);
};

const removeIfGhost = (geometry) =>
  isTypeGhost(geometry) && !isTypeVoid(geometry) ? taggedGroup({}) : geometry;

const noGhost = (geometry) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = linearize(concreteGeometry, isTypeGhost);
  const outputs = inputs.map(removeIfGhost);
  return replacer(inputs, outputs)(concreteGeometry);
};

const nth = (geometry, nths) => {
  const candidates = each(geometry);
  const group = [];
  for (let nth of nths) {
    if (nth < 0) {
      nth = candidates.length + nth;
    }
    let candidate = candidates[nth];
    if (candidate === undefined) {
      candidate = Empty();
    }
    group.push(candidate);
  }
  return Group(group);
};

const filter$d = (geometry) =>
  ['graph', 'polygonsWithHoles'].includes(geometry.type) &&
  isNotTypeGhost(geometry);

const offset = (
  geometry,
  initial = 1,
  { segments = 16, step, limit } = {}
) => {
  const inputs = linearize(geometry, filter$d);
  const outputs = offset$1(inputs, initial, step, limit, segments);
  return Group(outputs);
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

const X$2 = 0;
const Y$2 = 1;
const Z$2 = 2;

// These are all absolute positions in the world.
// at is where the object's origin should move to.
// to is where the object's axis should point at.
// up rotates around the axis to point a dorsal position toward.

const orient = (
  geometry,
  [at = [0, 0, 0], to = [0, 0, 1], up = [1, 0, 0]]
) => {
  const { local } = getInverseMatrices(geometry);
  // Algorithm from threejs Matrix4
  let u = subtract(up, at);
  if (squaredLength(u) === 0) {
    u[Z$2] = 1;
  }
  u = normalize$1(u);
  let z = subtract(to, at);
  if (squaredLength(z) === 0) {
    z[Z$2] = 1;
  }
  z = normalize$1(z);
  let x = cross$1(u, z);
  if (squaredLength(x) === 0) {
    // u and z are parallel
    if (Math.abs(u[Z$2]) === 1) {
      z[X$2] += 0.0001;
    } else {
      z[Z$2] += 0.0001;
    }
    z = normalize$1(z);
    x = cross$1(u, z);
  }
  x = normalize$1(x);
  let y = cross$1(z, x);
  const lookAt = [
    x[X$2],
    x[Y$2],
    x[Z$2],
    0,
    y[X$2],
    y[Y$2],
    y[Z$2],
    0,
    z[X$2],
    z[Y$2],
    z[Z$2],
    0,
    0,
    0,
    0,
    1,
  ];
  // FIX: Move this to CGAL.
  lookAt.blessed = true;
  const a = transform(geometry, local);
  const b = transform(a, lookAt);
  const c = translate(b, at);
  return c;
};

const filterSilhouettes = (geometry) =>
  geometry.type === 'polygonsWithHoles' && isNotTypeGhost(geometry);

const filterCast = (geometry) =>
  ['graph', 'polygonsWithHoles', 'item'].includes(geometry.type) &&
  isNotTypeGhost(geometry) &&
  isNotTypeVoid(geometry);

const filterSheet = (geometry) =>
  ['graph', 'polygonsWithHoles'].includes(geometry.type) &&
  isNotTypeGhost(geometry) &&
  isNotTypeVoid(geometry);

const pack = (
  geometry,
  sheets = [],
  orientations = [],
  options = {},
  strategy = 'bb'
) => {
  // Convert all of the geometry into silhouettes.
  const inputs = linearize(geometry, filterCast, [], { includeItems: false });
  const silhouettes = [];
  switch (strategy) {
    case 'bb':
      // silhouettes are bounding boxes.
      for (const input of inputs) {
        const silhouette = cast(
          undefined,
          undefined,
          bb(input, 0, 0, 0, { flat: true })
        );
        linearize(silhouette, filterSilhouettes, silhouettes);
      }
      break;
    case 'hull':
      // silhouettes are convex hulls.
      for (const input of inputs) {
        const silhouette = cast(undefined, undefined, ConvexHull([input]));
        linearize(silhouette, filterSilhouettes, silhouettes);
      }
      break;
    case 'outline':
      // silhouettes are the actual shape outlines.
      for (const input of inputs) {
        const silhouette = cast(undefined, undefined, input);
        linearize(silhouette, filterSilhouettes, silhouettes);
      }
      break;
  }
  const count = silhouettes.length;
  for (const sheet of sheets) {
    linearize(sheet, filterSheet, silhouettes);
  }
  const sheetByInput = [];
  const packed = pack$1(
    silhouettes,
    count,
    orientations,
    options,
    sheetByInput
  );
  const outputs = [];
  // This places the parts and their silhouettes.
  for (let nth = 0; nth < count; nth++) {
    outputs[nth] = transform(inputs[nth], packed[nth].matrix);
    silhouettes[nth] = transform(silhouettes[nth], packed[nth].matrix);
  }
  // Now construct items with the sheet and the content.
  const pages = [];
  for (let nth = 0; nth < sheetByInput.length; nth++) {
    const sheet = sheetByInput[nth] - count;
    if (pages[sheet] === undefined) {
      pages[sheet] = taggedItem({ tags: ['pack:sheet'] }, Group([]));
      if (sheets[sheet] !== undefined) {
        // Need to distinguish the sheet somehow.
        // Put the sheet 0.01 mm below the surface.
        pages[sheet].content[0].content.push(
          translate(sheets[sheet], [0, 0, -0.01])
        );
      }
    }
    pages[sheet].content[0].content.push(outputs[nth]);
    pages[sheet].content[0].content.push(hasTypeGhost(silhouettes[nth]));
  }
  return Group(pages.filter((page) => page !== undefined));
};

const filter$c = () => (geometry) =>
  ['graph'].includes(geometry.type) &&
  isNotTypeGhost(geometry) &&
  isNotTypeVoid(geometry);

const reconstruct = (geometry, { offset } = {}) => {
  const inputs = linearize(geometry, filter$c());
  const outputs = reconstruct$1(inputs, offset);
  return replacer(inputs, outputs)(geometry);
};

const filter$b = (geometry) =>
  ['graph'].includes(geometry.type) && isNotTypeGhost(geometry);

const refine = (geometry, selections, { density } = {}) => {
  const inputs = [];
  linearize(geometry, filter$b, inputs);
  const count = inputs.length;
  for (const selection of selections) {
    linearize(selection, filter$b, inputs);
  }
  const outputs = refine$1(inputs, count, density);
  const ghosts = [];
  for (let nth = count; nth < inputs.length; nth++) {
    ghosts.push(hasMaterial(hasTypeGhost(inputs[nth]), 'ghost'));
  }
  return taggedGroup({}, replacer(inputs, outputs, count)(geometry), ...ghosts);
};

const filter$a = (geometry) =>
  ['graph'].includes(geometry.type) &&
  isNotTypeGhost(geometry) &&
  isNotTypeVoid(geometry);

const remesh = (
  geometry,
  resolution = 1,
  selections,
  { iterations = 1, relaxationSteps = 1, targetEdgeLength = resolution }
) => {
  const inputs = [];
  linearize(geometry, filter$a, inputs);
  const count = inputs.length;
  for (const selection of selections) {
    linearize(selection, filter$a, inputs);
  }
  const outputs = remesh$1(
    inputs,
    count,
    iterations,
    relaxationSteps,
    targetEdgeLength
  );
  return replacer(inputs, outputs)(geometry);
};

const filter$9 = (geometry) =>
  ['graph'].includes(geometry.type) &&
  isNotTypeGhost(geometry) &&
  isNotTypeVoid(geometry);

const render = (
  geometry,
  { length = 10, width = length, height = 10, resolution = 1 }
) => {
  const inputs = linearize(geometry, filter$9);
  const points = [];
  const xStart = length / -2;
  const xStride = resolution;
  const xSteps = Math.ceil(length / resolution);
  const yStart = width / -2;
  const yStride = resolution;
  const ySteps = Math.ceil(width / resolution);
  const z = height;
  raycast(inputs, {
    xStart,
    xStride,
    xSteps,
    yStart,
    yStride,
    ySteps,
    z,
    points,
  });
  return { xSteps, ySteps, points };
};

const filter$8 = (geometry) =>
  ['graph'].includes(geometry.type) && isNotTypeGhost(geometry);

const repair = (geometry, strategies) => {
  const inputs = linearize(geometry, filter$8);
  const outputs = repair$1(inputs, strategies);
  return replacer(inputs, outputs)(geometry);
};

const X$1 = 0;
const Y$1 = 1;
const Z$1 = 2;

const floor = (value, resolution) =>
  Math.floor(value / resolution) * resolution;
const ceil = (value, resolution) => Math.ceil(value / resolution) * resolution;

const floorPoint = ([x, y, z], resolution) => [
  floor(x, resolution),
  floor(y, resolution),
  floor(z, resolution),
];
const ceilPoint = ([x, y, z], resolution) => [
  ceil(x, resolution),
  ceil(y, resolution),
  ceil(z, resolution),
];

const toVoxelsFromGeometry = (geometry, resolution = 1) => {
  const offset = resolution / 2;
  const [boxMin, boxMax] = measureBoundingBox(geometry);
  const min = floorPoint(boxMin, resolution);
  const max = ceilPoint(boxMax, resolution);
  const polygons = [];
  withIsExteriorPoint(
    linearize(geometry, ({ type }) =>
      ['graph', 'polygonsWithHoles'].includes(type)
    ),
    (isExteriorPoint) => {
      const isInteriorPoint = (x, y, z) => !isExteriorPoint(x, y, z);
      for (let x = min[X$1] - offset; x <= max[X$1] + offset; x += resolution) {
        for (let y = min[Y$1] - offset; y <= max[Y$1] + offset; y += resolution) {
          for (let z = min[Z$1] - offset; z <= max[Z$1] + offset; z += resolution) {
            const state = isInteriorPoint(x, y, z);
            if (state !== isInteriorPoint(x + resolution, y, z)) {
              const face = [
                [x + offset, y - offset, z - offset],
                [x + offset, y + offset, z - offset],
                [x + offset, y + offset, z + offset],
                [x + offset, y - offset, z + offset],
              ];
              polygons.push({ points: state ? face : face.reverse() });
            }
            if (state !== isInteriorPoint(x, y + resolution, z)) {
              const face = [
                [x - offset, y + offset, z - offset],
                [x + offset, y + offset, z - offset],
                [x + offset, y + offset, z + offset],
                [x - offset, y + offset, z + offset],
              ];
              polygons.push({ points: state ? face.reverse() : face });
            }
            if (state !== isInteriorPoint(x, y, z + resolution)) {
              const face = [
                [x - offset, y - offset, z + offset],
                [x + offset, y - offset, z + offset],
                [x + offset, y + offset, z + offset],
                [x - offset, y + offset, z + offset],
              ];
              polygons.push({ points: state ? face : face.reverse() });
            }
          }
        }
      }
    }
  );
  return fromPolygonSoup(polygons);
};

const toVoxelsFromCoordinates = (coordinates) => {
  const offset = 0.5;
  const index = new Set();
  const key = (x, y, z) => `${x},${y},${z}`;
  let max = [-Infinity, -Infinity, -Infinity];
  let min = [Infinity, Infinity, Infinity];
  for (const [x, y, z] of coordinates) {
    index.add(key(x, y, z));
    max[X$1] = Math.max(x + 1, max[X$1]);
    max[Y$1] = Math.max(y + 1, max[Y$1]);
    max[Z$1] = Math.max(z + 1, max[Z$1]);
    min[X$1] = Math.min(x - 1, min[X$1]);
    min[Y$1] = Math.min(y - 1, min[Y$1]);
    min[Z$1] = Math.min(z - 1, min[Z$1]);
  }
  const isInteriorPoint = (x, y, z) => index.has(key(x, y, z));
  const polygons = [];
  for (let x = min[X$1]; x <= max[X$1]; x++) {
    for (let y = min[Y$1]; y <= max[Y$1]; y++) {
      for (let z = min[Z$1]; z <= max[Z$1]; z++) {
        const state = isInteriorPoint(x, y, z);
        if (state !== isInteriorPoint(x + 1, y, z)) {
          const face = [
            [x + offset, y - offset, z - offset],
            [x + offset, y + offset, z - offset],
            [x + offset, y + offset, z + offset],
            [x + offset, y - offset, z + offset],
          ];
          polygons.push({ points: state ? face : face.reverse() });
        }
        if (state !== isInteriorPoint(x, y + 1, z)) {
          const face = [
            [x - offset, y + offset, z - offset],
            [x + offset, y + offset, z - offset],
            [x + offset, y + offset, z + offset],
            [x - offset, y + offset, z + offset],
          ];
          polygons.push({ points: state ? face.reverse() : face });
        }
        if (state !== isInteriorPoint(x, y, z + 1)) {
          const face = [
            [x - offset, y - offset, z + offset],
            [x + offset, y - offset, z + offset],
            [x + offset, y + offset, z + offset],
            [x - offset, y + offset, z + offset],
          ];
          polygons.push({ points: state ? face : face.reverse() });
        }
      }
    }
  }
  return fromPolygonSoup(polygons);
};

const X = 0;
const Y = 1;
const Z = 2;

const samplePointCloud = (geometries, resolution = 1) => {
  const offset = resolution / 2;
  const inputs = [];
  for (const geometry of geometries) {
    linearize(
      geometry,
      (geometry) =>
        ['graph', 'polygonsWithHoles'].includes(geometry.type) &&
        isNotTypeGhost(geometry),
      inputs
    );
  }
  const [boxMin, boxMax] = measureBoundingBox(Group(inputs));
  const min = floorPoint(boxMin, resolution);
  const max = ceilPoint(boxMax, resolution);
  const points = [];
  withIsExteriorPoint(inputs, (isExteriorPoint) => {
    const isInteriorPoint = (x, y, z) => !isExteriorPoint(x, y, z);
    for (let x = min[X] - offset; x <= max[X] + offset; x += resolution) {
      for (let y = min[Y] - offset; y <= max[Y] + offset; y += resolution) {
        for (let z = min[Z] - offset; z <= max[Z] + offset; z += resolution) {
          if (isInteriorPoint(x, y, z)) {
            points.push([x, y, z]);
          }
        }
      }
    }
  });
  return Points(points);
};

const filter$7 = (geometry, parent) =>
  ['graph'].includes(geometry.type) && isNotTypeGhost(geometry);

const seam = (geometry, selections) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter$7, inputs);
  const count = inputs.length;
  for (const selection of selections) {
    linearize(toConcreteGeometry(selection), filter$7, inputs);
  }
  const outputs = seam$1(inputs, count);
  return replacer(inputs, outputs)(concreteGeometry);
};

const filter$6 = (geometry, parent) =>
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
  linearize(concreteGeometry, filter$6, inputs);
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
  return taggedGroup(
    {},
    replacer(inputs, outputs)(concreteGeometry),
    ...ghosts
  );
};

const filter$5 = (geometry) =>
  ['graph', 'polygonsWithHoles'].includes(geometry.type) &&
  isNotTypeGhost(geometry);

const simplify = (geometry, faceCount, sharpEdgeThreshold) => {
  const inputs = linearize(geometry, filter$5);
  const outputs = simplify$1(inputs, faceCount, sharpEdgeThreshold);
  return replacer(inputs, outputs)(geometry);
};

const filter$4 = (geometry) =>
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
  const inputs = [];
  linearize(geometry, filter$4, inputs);
  const count = inputs.length;
  for (const selection of selections) {
    linearize(selection, filter$4, inputs);
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
  return taggedGroup({}, replacer(inputs, outputs, count)(geometry), ...ghosts);
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

const filter$3 = (geometry, parent) =>
  ['graph', 'points', 'segments', 'polygonsWithHoles'].includes(
    geometry.type
  ) && isNotTypeGhost(geometry);

const trim = (geometry, tool) => {
  const inputs = linearize(geometry, filter$3);
  const count = inputs.length;
  linearize(tool, filter$3, inputs);
  const outputs = trim$1(inputs, count);
  const ghosts = [];
  for (let nth = count; nth < inputs.length; nth++) {
    ghosts.push(hasMaterial(hasTypeGhost(inputs[nth]), 'ghost'));
  }
  return Group([replacer(inputs, outputs)(geometry), ...ghosts]);
};

const to = (geometry, target, connector = geometry) => {
  const oriented = by(geometry, [origin(connector)]);
  return by(oriented, [target]);
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

const filter$2 = (geometry) => ['graph'].includes(geometry.type);

const twist = (geometry, radius) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter$2, inputs);
  const outputs = twist$1(inputs, radius);
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
  return taggedGroup({}, ...outputs, ...ghosts);
};

const filter$1 = (geometry) =>
  ['graph'].includes(geometry.type) && isNotTypeGhost(geometry);

const validate = (geometry, strategies) => {
  const inputs = linearize(geometry, filter$1);
  const outputs = validate$1(inputs, strategies);
  return replacer(inputs, outputs)(geometry);
};

const filter = (geometry) =>
  ['graph', 'polygonsWithHoles', 'segments', 'points'].includes(
    geometry.type
  ) && isNotTypeGhost(geometry);

// These defaults need some rethinking.
const Wrap = (
  geometries,
  offset = 1,
  alpha = 0.1,
  faceCount = 0,
  minErrorDrop = 0.01
) => {
  const inputs = [];
  for (const geometry of geometries) {
    linearize(geometry, filter, inputs);
  }
  const outputs = wrap$1(inputs, offset, alpha, faceCount, minErrorDrop);
  return Group(outputs);
};

const wrap = (
  geometry,
  geometries,
  offset,
  alpha,
  faceCount,
  minErrorDrop
) =>
  tag(
    Wrap([geometry, ...geometries], offset, alpha, faceCount, minErrorDrop),
    tags(geometry)
  );

export { And, Arc, ArcX, ArcY, ArcZ, As, AsPart, Box, ChainConvexHull, ComputeSkeleton, ConvexHull, Curve, Disjoint, Edge, Empty, Fuse, Gauge, Group, Hershey, Hexagon, Icosahedron, Iron, Label, Link, Loop, Octagon, Orb, OrientedPoint, Pentagon, Point, Points, RX, RY, RZ, Ref, Route, Segments$1 as Segments, Triangle, Wrap, X$4 as X, XY, XZ, Y$4 as Y, YX, YZ, Z$3 as Z, ZX, ZY, abstract, align, alignment, allTags, and, approximate, as, asPart, assemble, at, base, bb, bend, by, cached, cast, chainConvexHull, clip, clipFrom, commonVolume, computeCentroid, computeGeneralizedDiameter, computeImplicitVolume, computeNormal, computeOrientedBoundingBox, computeReliefFromImage, computeSkeleton, computeToolpath, convertPolygonsToMeshes, convexHull, copy, curve, cut, cutFrom, cutOut, deform, demesh, dilateXY, disjoint, disorientSegment, distance$1 as distance, drop, each, eachFaceEdges, eachItem, eachSegment, eachTriangle, eagerTransform, emitNote, ensurePages, exterior, extrude, extrudeAlong, extrudeAlongNormal, extrudeAlongX, extrudeAlongY, extrudeAlongZ, fair, fill$1 as fill, fit, fitTo, fix, flat, fresh, fromPolygonSoup, fuse, gap, gauge, generateLowerEnvelope, generateUpperEnvelope, get, getAll, getAllList, getAnySurfaces, getGraphs, getInverseMatrices, getItems, getLayouts, getLeafs, getLeafsIn, getList, getNot, getNotList, getPlans, getPoints, getTags, getValue, ghost, grow, hasColor, hasMaterial, hasNotShow, hasNotShowOutline, hasNotShowOverlay, hasNotShowSkin, hasNotShowWireframe, hasNotType, hasNotTypeGhost, hasNotTypeMasked, hasNotTypeReference, hasNotTypeVoid, hasShow, hasShowOutline, hasShowOverlay, hasShowSkin, hasShowWireframe, hasType, hasTypeGhost, hasTypeMasked, hasTypeReference, hasTypeVoid, hash, hold, inItem, inset, involute, iron, isNotShow, isNotShowOutline, isNotShowOverlay, isNotShowSkin, isNotShowWireframe, isNotType, isNotTypeGhost, isNotTypeMasked, isNotTypeReference, isNotTypeVoid, isSeqSpec, isShow, isShowOutline, isShowOverlay, isShowSkin, isShowWireframe, isType, isTypeGhost, isTypeMasked, isTypeReference, isTypeVoid, join, joinTo, keep, linearize, link, load, loadNonblocking, loft, log, loop, makeAbsolute, maskedBy, masking, measureArea, measureBoundingBox, measureVolume, minimizeOverhang, moveAlong, moveAlongNormal, noGhost, note, nth, obb, offset, on, onPost, onPre, oneOfTagMatcher, op, orient, origin, outline, pack, read, readNonblocking, reconstruct, ref, refine, reify, remesh, render, repair, replacer, retag, rewrite, rewriteTags, rotateX, rotateXs, rotateY, rotateYs, rotateZ, rotateZs, samplePointCloud, scale$1 as scale, scaleLazy, scaleToFit, seam, section, separate, seq, serialize, shell, showOutline, showOverlay, showSkin, showWireframe, simplify, smooth, soup, store, tag, tagMatcher, taggedDisplayGeometry, taggedGraph, taggedGroup, taggedItem, taggedLayout, taggedPlan, taggedPoints, taggedPolygons, taggedPolygonsWithHoles, taggedSegments, taggedSketch, taggedTriangles, tags, to, toConcreteGeometry, toCoordinates, toDisplayGeometry, toFaceEdgesList, toOrientedFaceEdgesList, toPointList, toPoints, toSegmentList, toSegments, toTransformedGeometry, toTriangleArray, toVoxelsFromCoordinates, toVoxelsFromGeometry, transform, transformCoordinate, transformingCoordinates, translate, trim, turnX, turnXs, turnY, turnYs, turnZ, turnZs, twist, typeGhost, typeMasked, typeReference, typeVoid, unfold, untag, update, validate, visit, wrap, write, writeNonblocking };
