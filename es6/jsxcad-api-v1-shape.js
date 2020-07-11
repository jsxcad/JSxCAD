import { close, concatenate, open } from './jsxcad-geometry-path.js';
import { taggedAssembly, eachPoint, flip, toDisjointGeometry as toDisjointGeometry$1, toPoints, transform, reconcile, isWatertight, makeWatertight, fromPathToSurface, fromPathToZ0Surface, fromPathsToSurface, fromPathsToZ0Surface, rewriteTags, union as union$1, intersection as intersection$1, difference as difference$1, assemble as assemble$1, getSolids, rewrite, measureBoundingBox as measureBoundingBox$1, taggedLayers, isVoid, taggedSketch, getPaths, allTags, getAnyNonVoidSurfaces, taggedSolid, getNonVoidSolids, getNonVoidSurfaces, getNonVoidZ0Surfaces, canonicalize as canonicalize$1, measureArea } from './jsxcad-geometry-tagged.js';
import { addReadDecoder, log as log$1, readFile, addPending, writeFile, emit } from './jsxcad-sys.js';
import { fromPolygons, findOpenEdges, fromSurface } from './jsxcad-geometry-solid.js';
import { outline } from './jsxcad-geometry-surface.js';
import { createNormalize3 } from './jsxcad-algorithm-quantize.js';
import { junctionSelector } from './jsxcad-geometry-halfedge.js';
import { scale as scale$1, add, negate, normalize, subtract, dot, cross, distance } from './jsxcad-math-vec3.js';
import { segment } from './jsxcad-geometry-paths.js';
import { toTagFromName } from './jsxcad-algorithm-color.js';
import { fromTranslation, fromRotation, fromXRotation, fromYRotation, fromZRotation, fromScaling } from './jsxcad-math-mat4.js';

class Shape {
  close() {
    const geometry = this.toDisjointGeometry();
    if (!isSingleOpenPath(geometry.content[0])) {
      throw Error('Close requires a single open path.');
    }
    return Shape.fromClosedPath(close(geometry.content[0].paths[0]));
  }

  concat(...shapes) {
    const paths = [];
    for (const shape of [this, ...shapes]) {
      const geometry = shape.toDisjointGeometry();
      if (!isSingleOpenPath(geometry.content[0])) {
        throw Error(
          `Concatenation requires single open paths: ${JSON.stringify(
            geometry
          )}`
        );
      }
      paths.push(geometry.content[0].paths[0]);
    }
    return Shape.fromOpenPath(concatenate(...paths));
  }

  constructor(geometry = taggedAssembly({}), context) {
    if (geometry.geometry) {
      throw Error('die: { geometry: ... } is not valid geometry.');
    }
    this.geometry = geometry;
    this.context = context;
  }

  eachPoint(operation) {
    eachPoint(operation, this.toDisjointGeometry());
  }

  flip() {
    return fromGeometry(flip(toDisjointGeometry(this)), this.context);
  }

  setTags(tags) {
    return fromGeometry({ ...toGeometry(this), tags }, this.context);
  }

  toKeptGeometry(options = {}) {
    return this.toDisjointGeometry();
  }

  toDisjointGeometry(options = {}) {
    return toDisjointGeometry$1(toGeometry(this));
  }

  getContext(symbol) {
    return this.context[symbol];
  }

  toGeometry() {
    return this.geometry;
  }

  toPoints() {
    return toPoints(this.toDisjointGeometry()).points;
  }

  transform(matrix) {
    if (matrix.some((item) => typeof item !== 'number' || isNaN(item))) {
      throw Error('die: matrix is malformed');
    }
    return fromGeometry(transform(matrix, this.toGeometry()), this.context);
  }

  reconcile() {
    return fromGeometry(reconcile(this.toDisjointGeometry()));
  }

  assertWatertight() {
    if (!this.isWatertight()) {
      throw Error('not watertight');
    }
    return this;
  }

  isWatertight() {
    return isWatertight(this.toDisjointGeometry());
  }

  makeWatertight(threshold) {
    return fromGeometry(
      makeWatertight(this.toDisjointGeometry(), undefined, undefined, threshold)
    );
  }
}

const isSingleOpenPath = ({ paths }) =>
  paths !== undefined && paths.length === 1 && paths[0][0] === null;

Shape.fromClosedPath = (path, context) =>
  fromGeometry({ type: 'paths', paths: [close(path)] }, context);
Shape.fromGeometry = (geometry, context) => new Shape(geometry, context);
Shape.fromOpenPath = (path, context) =>
  fromGeometry({ type: 'paths', paths: [open(path)] }, context);
Shape.fromPath = (path, context) =>
  fromGeometry({ type: 'paths', paths: [path] }, context);
Shape.fromPaths = (paths, context) =>
  fromGeometry({ type: 'paths', paths: paths }, context);
Shape.fromPathToSurface = (path, context) =>
  fromGeometry(fromPathToSurface(path), context);
Shape.fromPathToZ0Surface = (path, context) =>
  fromGeometry(fromPathToZ0Surface(path), context);
Shape.fromPathsToSurface = (paths, context) =>
  fromGeometry(fromPathsToSurface(paths), context);
Shape.fromPathsToZ0Surface = (paths, context) =>
  fromGeometry(fromPathsToZ0Surface(paths), context);
Shape.fromPoint = (point, context) =>
  fromGeometry({ type: 'points', points: [point] }, context);
Shape.fromPoints = (points, context) =>
  fromGeometry({ type: 'points', points: points }, context);
Shape.fromPolygonsToSolid = (polygons, context) =>
  fromGeometry(
    { type: 'solid', solid: fromPolygons({}, polygons) },
    context
  );
Shape.fromPolygonsToZ0Surface = (polygons, context) =>
  fromGeometry({ type: 'z0Surface', z0Surface: polygons }, context);
Shape.fromSurfaces = (surfaces, context) =>
  fromGeometry({ type: 'solid', solid: surfaces }, context);
Shape.fromSolid = (solid, context) =>
  fromGeometry({ type: 'solid', solid }, context);

const fromGeometry = Shape.fromGeometry;
const toGeometry = (shape) => shape.toGeometry();
const toDisjointGeometry = (shape) => shape.toDisjointGeometry();
const toKeptGeometry = (shape) => shape.toDisjointGeometry();

addReadDecoder(
  (data) => data && data.geometry !== undefined,
  (data) => Shape.fromGeometry(data.geometry)
);

/**
 *
 * # As
 *
 * Produces a version of a shape with user defined tags.
 *
 * ::: illustration
 * ```
 * Circle(10).as('A')
 * ```
 * :::
 *
 **/

const as = (shape, tags) =>
  Shape.fromGeometry(
    rewriteTags(
      tags.map((tag) => `user/${tag}`),
      [],
      shape.toGeometry()
    )
  );

const notAs = (shape, tags) =>
  Shape.fromGeometry(
    rewriteTags(
      [],
      tags.map((tag) => `user/${tag}`),
      shape.toGeometry()
    )
  );

const asMethod = function (...tags) {
  return as(this, tags);
};
const notAsMethod = function (...tags) {
  return notAs(this, tags);
};

Shape.prototype.as = asMethod;
Shape.prototype.notAs = notAsMethod;

asMethod.signature = 'Shape -> as(...tags:string) -> Shape';
notAsMethod.signature = 'Shape -> as(...tags:string) -> Shape';

/**
 *
 * # Union
 *
 * Union produces a version of the first shape extended to cover the remaining shapes, as applicable.
 * Different kinds of shapes do not interact. e.g., you cannot union a surface and a solid.
 *
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * union(Sphere(5).left(),
 *       Sphere(5),
 *       Sphere(5).right())
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * union(Sphere(5).left(),
 *       Sphere(5),
 *       Sphere(5).right())
 *   .section()
 *   .outline()
 * ```
 * :::
 * ::: illustration { "view": { "position": [0, 0, 5] } }
 * ```
 * union(Triangle(),
 *       Triangle().rotateZ(180))
 * ```
 * :::
 * ::: illustration { "view": { "position": [0, 0, 5] } }
 * ```
 * union(Triangle(),
 *       Triangle().rotateZ(180))
 *   .outline()
 * ```
 * :::
 * ::: illustration { "view": { "position": [5, 5, 5] } }
 * ```
 * union(assemble(Cube().left(),
 *                Cube().right()),
 *       Cube().front())
 *   .section()
 *   .outline()
 * ```
 * :::
 *
 **/

// NOTE: Perhaps we should make union(a, b, c) equivalent to emptyGeometry.union(a, b, c);
// This would restore commutation.

const union = (...shapes) => {
  switch (shapes.length) {
    case 0: {
      return fromGeometry(taggedAssembly({}));
    }
    case 1: {
      return shapes[0];
    }
    default: {
      return fromGeometry(union$1(...shapes.map(toKeptGeometry)));
    }
  }
};

const unionMethod = function (...shapes) {
  return union(this, ...shapes);
};
Shape.prototype.union = unionMethod;

union.signature = 'union(shape:Shape, ...shapes:Shape) -> Shape';
unionMethod.signature = 'Shape -> union(...shapes:Shape) -> Shape';

/**
 *
 * # shape.add(...shapes)
 *
 * Produces a version of shape with the regions overlapped by shapes added.
 *
 * shape.add(...shapes) is equivalent to union(shape, ...shapes).
 *
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * Cube(10).below().add(Cube(5).moveX(5).below())
 * ```
 * :::
 *
 **/

const addMethod = function (...shapes) {
  return union(this, ...shapes);
};
Shape.prototype.add = addMethod;

addMethod.signature = 'Shape -> (...Shapes) -> Shape';

// x.addTo(y) === y.add(x)

const addToMethod = function (shape) {
  return union(shape, this);
};
Shape.prototype.addTo = addToMethod;

addToMethod.signature = 'Shape -> (...Shapes) -> Shape';

/**
 *
 * # Intersection
 *
 * Intersection produces a version of the first shape retaining only the parts included in the remaining shapes.
 *
 * Different kinds of shapes do not interact. e.g., you cannot intersect a surface and a solid.
 *
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * intersection(Cube(12),
 *              Sphere(8))
 * ```
 * :::
 * ::: illustration
 * ```
 * intersection(Circle(10).move(-5),
 *              Circle(10).move(5))
 * ```
 * :::
 * ::: illustration { "view": { "position": [5, 5, 5] } }
 * ```
 * intersection(assemble(Cube().below(),
 *                       Cube().above()),
 *              Sphere(1))
 * ```
 * :::
 * ::: illustration
 * ```
 * assemble(difference(Square(10),
 *                     Square(7))
 *            .translate(-2, -2),
 *          difference(Square(10),
 *                     Square(7))
 *            .move(2, 2));
 * ```
 * :::
 * ::: illustration
 * ```
 * intersection(difference(Square(10),
 *                         Square(7))
 *                .translate(-2, -2),
 *              difference(Square(10),
 *                         Square(7))
 *                .move(2, 2));
 * ```
 * :::
 **/

const intersection = (...shapes) => {
  switch (shapes.length) {
    case 0: {
      return fromGeometry(taggedAssembly({}));
    }
    case 1: {
      // We still want to produce a simple shape.
      return fromGeometry(toKeptGeometry(shapes[0]));
    }
    default: {
      return fromGeometry(intersection$1(...shapes.map(toKeptGeometry)));
    }
  }
};

const clipMethod = function (...shapes) {
  return intersection(this, ...shapes);
};
Shape.prototype.clip = clipMethod;

clipMethod.signature = 'Shape -> clip(...to:Shape) -> Shape';

const clipFromMethod = function (shape) {
  return intersection(shape, this);
};
Shape.prototype.clipFrom = clipFromMethod;

clipFromMethod.signature = 'Shape -> clipFrom(...to:Shape) -> Shape';

/**
 *
 * # Difference
 *
 * Difference produces a version of the first shape with the remaining shapes removed, where applicable.
 * Different kinds of shapes do not interact. e.g., you cannot subtract a surface from a solid.
 *
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * difference(Cube(10).below(),
 *            Cube(5).below())
 * ```
 * :::
 * ::: illustration
 * ```
 * difference(Circle(10),
 *            Circle(2.5))
 * ```
 * :::
 * ::: illustration { "view": { "position": [5, 5, 5] } }
 * ```
 * difference(assemble(Cube().below(),
 *                     Cube().above()),
 *            Cube().right())
 * ```
 * :::
 *
 **/

const difference = (...shapes) => {
  switch (shapes.length) {
    case 0: {
      return fromGeometry(taggedAssembly({}));
    }
    case 1: {
      // We still want to produce a simple shape.
      return fromGeometry(toKeptGeometry(shapes[0]));
    }
    default: {
      return fromGeometry(difference$1(...shapes.map(toKeptGeometry)));
    }
  }
};

/**
 *
 * # shape.cut(...shapes)
 *
 * Produces a version of shape with the regions overlapped by shapes removed.
 *
 * shape.cut(...shapes) is equivalent to difference(shape, ...shapes).
 *
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * Cube(10).below().cut(Cube(5).below())
 * ```
 * :::
 *
 **/

const cutMethod = function (...shapes) {
  return difference(this, ...shapes);
};
Shape.prototype.cut = cutMethod;

cutMethod.signature = 'Shape -> cut(...shapes:Shape) -> Shape';

// a.cut(b) === b.cutFrom(a)

const cutFromMethod = function (shape) {
  return difference(shape, this);
};
Shape.prototype.cutFrom = cutFromMethod;

cutFromMethod.signature = 'Shape -> cutFrom(...shapes:Shape) -> Shape';

/**
 *
 * # Assemble
 *
 * Produces an assembly of shapes that can be manipulated as a single shape.
 * assemble(a, b) is equivalent to a.with(b).
 *
 * ::: illustration { "view": { "position": [80, 80, 80] } }
 * ```
 * assemble(Circle(20).moveZ(-12),
 *          Square(40).moveZ(16).outline(),
 *          Cylinder(10, 20));
 * ```
 * :::
 *
 * Components of the assembly can be extracted by tag filtering.
 *
 * Components later in the assembly project holes into components earlier in the
 * assembly so that the geometries are disjoint.
 *
 * ::: illustration { "view": { "position": [100, 100, 100] } }
 * ```
 * assemble(Cube(30).above().as('cube'),
 *          Cylinder(10, 40).above().as('cylinder'))
 * ```
 * :::
 * ::: illustration { "view": { "position": [100, 100, 100] } }
 * ```
 * assemble(Cube(30).above().as('cube'),
 *          Cylinder(10, 40).above().as('cylinder'))
 *   .keep('cube')
 * ```
 * :::
 * ::: illustration { "view": { "position": [100, 100, 100] } }
 * ```
 * assemble(Cube(30).above().as('cube'),
 *          assemble(Circle(40),
 *                   Circle(50).outline()).as('circles'))
 *   .keep('circles')
 * ```
 * :::
 * ::: illustration { "view": { "position": [100, 100, 100] } }
 * ```
 * assemble(Cube(30).above().as('cube'),
 *          assemble(Circle(40).as('circle'),
 *                   Circle(50).outline().as('outline')))
 *   .drop('outline')
 * ```
 * :::
 *
 **/

const assemble = (...shapes) => {
  shapes = shapes.filter((shape) => shape !== undefined);
  switch (shapes.length) {
    case 0: {
      return Shape.fromGeometry(taggedAssembly({}));
    }
    case 1: {
      return shapes[0];
    }
    default: {
      return fromGeometry(assemble$1(...shapes.map(toGeometry)));
    }
  }
};

const faces = (shape, op = (x) => x) => {
  const faces = [];
  for (const { solid } of getSolids(shape.toKeptGeometry())) {
    for (const surface of solid) {
      faces.push(
        op(Shape.fromGeometry({ paths: outline(surface) }), faces.length)
      );
    }
  }
  return assemble(...faces);
};

const facesMethod = function (...args) {
  return faces(this, ...args);
};
Shape.prototype.faces = facesMethod;

const inSolids = (shape, op = (_) => _) => {
  let nth = 0;
  const rewritten = rewrite(shape.toKeptGeometry(), (geometry, descend) => {
    if (geometry.solid) {
      // Operate on the solid.
      const solid = op(Shape.fromGeometry(geometry), nth++);
      // Replace the solid with the result (which might not be a solid).
      return solid.toGeometry();
    } else {
      return descend();
    }
  });
  return Shape.fromGeometry(rewritten);
};

const inSolidsMethod = function (...args) {
  return inSolids(this, ...args);
};
Shape.prototype.inSolids = inSolidsMethod;

inSolids.signature = 'inSolids(shape:Shape, op:function) -> Shapes';
inSolidsMethod.signature = 'Shape -> inSolids(op:function) -> Shapes';

const junctions = (shape, mode = (n) => n) => {
  const junctions = [];
  const points = [];
  for (const { solid } of getSolids(shape.toKeptGeometry())) {
    const normalize = createNormalize3();
    const select = junctionSelector(solid, normalize);
    for (const surface of solid) {
      for (const path of surface) {
        for (const point of path) {
          points.push(normalize(point));
        }
      }
    }
    for (const point of points) {
      if (mode(select(point))) {
        junctions.push(point);
      }
    }
  }
  return Shape.fromGeometry({ points: junctions });
};

const nonJunctions = (shape) => junctions(shape, (n) => !n);

const junctionsMethod = function () {
  return junctions(this);
};
Shape.prototype.junctions = junctionsMethod;

const nonJunctionsMethod = function () {
  return nonJunctions(this);
};
Shape.prototype.nonJunctions = nonJunctionsMethod;

/**
 *
 * # Measure Bounding Box
 *
 * Provides the corners of the smallest orthogonal box containing the shape.
 *
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * Sphere(7)
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * const [corner1, corner2] = Sphere(7).measureBoundingBox();
 * Cube.fromCorners(corner1, corner2)
 * ```
 * :::
 **/

const measureBoundingBox = (shape) =>
  measureBoundingBox$1(shape.toGeometry());

const measureBoundingBoxMethod = function () {
  return measureBoundingBox(this);
};
Shape.prototype.measureBoundingBox = measureBoundingBoxMethod;

measureBoundingBox.signature = 'measureBoundingBox(shape:Shape) -> BoundingBox';
measureBoundingBoxMethod.signature =
  'Shape -> measureBoundingBox() -> BoundingBox';

/**
 *
 * # Measure Center
 *
 * Provides the center of the smallest orthogonal box containing the shape.
 *
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * Sphere(7)
 * ```
 * :::
 **/

const measureCenter = (shape) => {
  // FIX: Produce a clearer definition of center.
  const geometry = shape.toKeptGeometry();
  if (geometry.plan && geometry.plan.connector) {
    // Return the center of the connector.
    return geometry.marks[0];
  }
  const [high, low] = measureBoundingBox(shape);
  return scale$1(0.5, add(high, low));
};

const measureCenterMethod = function () {
  return measureCenter(this);
};
Shape.prototype.measureCenter = measureCenterMethod;

measureCenter.signature = 'measureCenter(shape:Shape) -> vector';
measureCenterMethod.signature = 'Shape -> measureCenter() -> vector';

const noPlan = (shape, tags, select) => {
  const op = (geometry, descend) => {
    if (geometry.plan) {
      return taggedLayers({});
    } else {
      return descend();
    }
  };

  const rewritten = rewrite(shape.toKeptGeometry(), op);
  return Shape.fromGeometry(rewritten);
};

const noPlanMethod = function (...tags) {
  return noPlan(this);
};
Shape.prototype.noPlan = noPlanMethod;

const noVoid = (shape, tags, select) => {
  const op = (geometry, descend) => {
    if (isVoid(geometry)) {
      return taggedLayers({});
    } else {
      return descend();
    }
  };

  const rewritten = rewrite(shape.toKeptGeometry(), op);
  return Shape.fromGeometry(rewritten);
};

const noVoidMethod = function (...tags) {
  return noVoid(this);
};
Shape.prototype.noVoid = noVoidMethod;

const opMethod = function (op, ...args) {
  return op(this, ...args);
};
const withOpMethod = function (op, ...args) {
  return assemble(this, op(this, ...args));
};

Shape.prototype.op = opMethod;
Shape.prototype.withOp = withOpMethod;

const openEdges = (shape, { isOpen = true } = {}) => {
  const r = (v) => v;
  const paths = [];
  for (const { solid } of getSolids(shape.toKeptGeometry())) {
    paths.push(...findOpenEdges(solid, isOpen));
  }
  return Shape.fromGeometry({
    type: 'paths',
    paths: paths.map((path) => path.map(([x, y, z]) => [r(x), r(y), r(z)])),
  });
};

const openEdgesMethod = function (...args) {
  return openEdges(this, ...args);
};
Shape.prototype.openEdges = openEdgesMethod;

const withOpenEdgesMethod = function (...args) {
  return assemble(this, openEdges(this, ...args));
};
Shape.prototype.withOpenEdges = withOpenEdgesMethod;

const solids = (shape, xform = (_) => _) => {
  const solids = [];
  for (const solid of getSolids(shape.toKeptGeometry())) {
    solids.push(xform(Shape.fromGeometry(solid)));
  }
  return solids;
};

const solidsMethod = function (...args) {
  return solids(this, ...args);
};
Shape.prototype.solids = solidsMethod;

const sketch = (shape) =>
  Shape.fromGeometry(taggedSketch({}, shape.toGeometry()));

Shape.prototype.sketch = function () {
  return sketch(this);
};

Shape.prototype.withSketch = function () {
  return assemble(this, sketch(this));
};

const trace = (shape, length = 1) => {
  const tracePaths = [];
  for (const { paths } of getPaths(shape.toKeptGeometry())) {
    for (let start = 0; ; start += length) {
      const segments = segment(paths, start, start + length);
      if (segments.length === 0) {
        break;
      }
      tracePaths.push(...segments);
    }
  }
  return Shape.fromGeometry({
    type: 'paths',
    paths: tracePaths,
    tags: ['display/trace'],
  });
};

const traceMethod = function (length = 1) {
  return trace(this, length);
};
Shape.prototype.trace = traceMethod;

const tags = (shape) =>
  [...allTags(shape.toGeometry())]
    .filter((tag) => tag.startsWith('user/'))
    .map((tag) => tag.substring(5));

const method = function () {
  return tags(this);
};

Shape.prototype.tags = method;

// FIX: Debugging only -- remove this method.
const wall = (shape) => {
  const normalize = createNormalize3();
  const solids = [];
  for (const { surface, z0Surface, tags } of getAnyNonVoidSurfaces(
    shape.toDisjointGeometry()
  )) {
    solids.push(
      taggedSolid({ tags }, fromSurface(surface || z0Surface, normalize))
    );
  }
  return Shape.fromGeometry(taggedAssembly({}, ...solids));
};

const wallMethod = function () {
  return wall(this);
};
Shape.prototype.wall = wallMethod;

const toWireframeFromSolid = (solid) => {
  const paths = [];
  for (const surface of solid) {
    paths.push(...surface);
  }
  return Shape.fromPaths(paths);
};

const toWireframeFromSurface = (surface) => {
  return Shape.fromPaths(surface);
};

const wireframe = (options = {}, shape) => {
  const pieces = [];
  for (const { solid } of getNonVoidSolids(shape.toKeptGeometry())) {
    pieces.push(toWireframeFromSolid(solid));
  }
  for (const { surface } of getNonVoidSurfaces(shape.toKeptGeometry())) {
    pieces.push(toWireframeFromSurface(surface));
  }
  for (const { z0Surface } of getNonVoidZ0Surfaces(shape.toKeptGeometry())) {
    pieces.push(toWireframeFromSurface(z0Surface));
  }
  return assemble(...pieces);
};

const method$1 = function (options) {
  return wireframe(options, this);
};

Shape.prototype.wireframe = method$1;
Shape.prototype.withWireframe = function (options) {
  return assemble(this, wireframe(options, this));
};

const wireframeFaces = (shape, op = (x) => x) => {
  const faces = [];
  for (const { solid } of getSolids(shape.toKeptGeometry())) {
    for (const surface of solid) {
      for (const path of surface) {
        faces.push(
          op(Shape.fromGeometry({ type: 'paths', paths: [path] }), faces.length)
        );
      }
    }
  }
  return assemble(...faces);
};

const wireframeFacesMethod = function (...args) {
  return wireframeFaces(this, ...args);
};
Shape.prototype.wireframeFaces = wireframeFacesMethod;

/**
 *
 * # With
 *
 * Assembles the current shape with those provided.
 *
 * The below example is equivalent to
 * ```
 * assemble(Circle(20), Square(40).moveX(10))
 * ```
 *
 * ::: illustration { "view": { "position": [80, 80, 80] } }
 * ```
 * Circle(20).with(Square(40).moveX(10))
 * ```
 * :::
 *
 **/

const withMethod = function (...shapes) {
  return assemble(this, ...shapes);
};
Shape.prototype.with = withMethod;

/**
 *
 * # Keep in assembly
 *
 * Generates an assembly from components in an assembly with a tag.
 *
 * ::: illustration
 * ```
 * assemble(Circle(10).as('A'),
 *          Square(10).as('B'))
 * ```
 * :::
 * ::: illustration
 * ```
 * assemble(Circle(10).as('A'),
 *          Square(10).as('B'))
 *   .keep('A')
 * ```
 * :::
 * ::: illustration
 * ```
 * assemble(Circle(10).as('A'),
 *          Square(10).as('B'))
 *   .keep('B')
 * ```
 * :::
 * ::: illustration
 * ```
 * assemble(Circle(10).as('A'),
 *          Square(10).as('B'))
 *   .keep('A', 'B')
 * ```
 * :::
 *
 **/

const selectToKeep = (matchTags, geometryTags) => {
  if (geometryTags === undefined) {
    return false;
  }
  for (const geometryTag of geometryTags) {
    if (matchTags.includes(geometryTag)) {
      return true;
    }
  }
  return false;
};

const selectToDrop = (matchTags, geometryTags) =>
  !selectToKeep(matchTags, geometryTags);

const keepOrDrop = (shape, tags, select) => {
  const matchTags = tags.map((tag) => `user/${tag}`);

  const op = (geometry, descend) => {
    // FIX: Need a more reliable way to detect leaf structure.
    if (
      geometry.solid ||
      geometry.surface ||
      geometry.z0Surface ||
      geometry.points ||
      geometry.paths ||
      geometry.item
    ) {
      if (select(matchTags, geometry.tags)) {
        return descend();
      } else {
        // Operate on the shape.
        const shape = Shape.fromGeometry(geometry);
        // Note that this transform does not violate geometry disjunction.
        const dropped = shape.Void().layer(shape.sketch()).toGeometry();
        return dropped;
      }
    } else {
      return descend();
    }
  };

  const rewritten = rewrite(shape.toKeptGeometry(), op);
  return Shape.fromGeometry(rewritten);
};

const keep = (shape, tags) => {
  if (tags === undefined) {
    // Dropping no tags is an unconditional keep.
    return keepOrDrop(shape, [], selectToDrop);
  } else {
    return keepOrDrop(shape, tags, selectToKeep);
  }
};

const drop = (shape, tags) => {
  if (tags === undefined) {
    // Keeping no tags is an unconditional drop.
    return keepOrDrop(shape, [], selectToKeep);
  } else {
    return keepOrDrop(shape, tags, selectToDrop);
  }
};

const keepMethod = function (...tags) {
  return keep(this, tags);
};
Shape.prototype.keep = keepMethod;

const dropMethod = function (...tags) {
  return drop(this, tags);
};
Shape.prototype.drop = dropMethod;

const canonicalize = (shape) =>
  Shape.fromGeometry(canonicalize$1(shape.toGeometry()));

const canonicalizeMethod = function () {
  return canonicalize(this);
};
Shape.prototype.canonicalize = canonicalizeMethod;

/**
 *
 * # Center
 *
 * Moves the shape so that its bounding box is centered on the origin.
 *
 * ::: illustration { "view": { "position": [60, -60, 60], "target": [0, 0, 0] } }
 * ```
 * Circle(20).with(Cube(10).center())
 * ```
 * :::
 **/

const X = 0;
const Y = 1;
const Z = 2;

const center = (
  shape,
  { centerX = true, centerY = true, centerZ = true } = {}
) => {
  const [minPoint, maxPoint] = measureBoundingBox(shape);
  const center = scale$1(0.5, add(minPoint, maxPoint));
  if (!centerX) {
    center[X] = 0;
  }
  if (!centerY) {
    center[Y] = 0;
  }
  if (!centerZ) {
    center[Z] = 0;
  }
  // FIX: Find a more principled way to handle centering empty shapes.
  if (isNaN(center[X]) || isNaN(center[Y]) || isNaN(center[Z])) {
    return shape;
  }
  const moved = shape.move(...negate(center));
  return moved;
};

const centerMethod = function (...params) {
  return center(this, ...params);
};
Shape.prototype.center = centerMethod;

/**
 *
 * # Color
 *
 * Produces a version of a shape the given color.
 * FIX: Support color in convert/threejs/toSvg.
 *
 * ::: illustration
 * ```
 * Circle(10).color('blue')
 * ```
 * :::
 * ::: illustration
 * ```
 * Triangle(10).color('chartreuse')
 * ```
 * :::
 *
 **/

const fromName = (shape, name) =>
  Shape.fromGeometry(
    rewriteTags([toTagFromName(name)], [], shape.toGeometry())
  );

const color = (...args) => fromName(...args);

const colorMethod = function (...args) {
  return color(this, ...args);
};
Shape.prototype.color = colorMethod;

color.signature = 'color(shape:Shape, color:string) -> Shape';
colorMethod.signature = 'Shape -> color(color:string) -> Shape';

const colors = (shape) =>
  [...allTags(shape.toGeometry())]
    .filter((tag) => tag.startsWith('color/'))
    .map((tag) => tag.substring(6));

const colorsMethod = function () {
  return colors(this);
};
Shape.prototype.colors = colorsMethod;

colors.signature = 'colors(shape:Shape) -> strings';
colorsMethod.signature = 'Shape -> colors() -> strings';

/**
 *
 * # Kept
 *
 * Kept produces a geometry without dropped elements.
 *
 **/

const kept = (shape) => Shape.fromGeometry(toKeptGeometry(shape));

const keptMethod = function () {
  return kept(this);
};
Shape.prototype.kept = keptMethod;

kept.signature = 'kept(shape:Shape) -> Shape';
keptMethod.signature = 'Shape -> kept() -> Shape';

const layer = (...shapes) =>
  Shape.fromGeometry(
    taggedLayers({}, ...shapes.map((shape) => shape.toGeometry()))
  );

const layerMethod = function (...shapes) {
  return layer(this, ...shapes);
};
Shape.prototype.layer = layerMethod;
Shape.prototype.and = layerMethod;

/**
 *
 * # Log
 *
 * Writes a string to the console.
 *
 * ```
 * log("Hello, World")
 * ```
 *
 **/

const log = (text, level) =>
  log$1({ op: 'text', text: String(text), level });

const logOp = (shape, op) =>
  log$1({ op: 'text', text: String(op(shape)) });

const logMethod = function (
  op = (shape) => JSON.stringify(shape.toKeptGeometry())
) {
  logOp(this, op);
  return this;
};
Shape.prototype.log = logMethod;

log.signature = 'log(op:function)';

const readShape = async (path, { src } = {}) => {
  let data = await readFile({ doSerialize: false }, `source/${path}`);
  if (data === undefined && src) {
    data = await readFile({ sources: [src] }, `cache/${path}`);
  }
  return Shape.fromGeometry(await JSON.parse(data));
};

const make = (path, builder) => readShape(path, builder);

/**
 *
 * # Material
 *
 * Produces a version of a shape with a given material.
 *
 * Materials supported include 'paper', 'metal', 'glass', etc.
 *
 * ::: illustration
 * ```
 * Cylinder(5, 10).material('copper')
 * ```
 * :::
 *
 **/

const material = (shape, ...tags) =>
  Shape.fromGeometry(
    rewriteTags(
      tags.map((tag) => `material/${tag}`),
      [],
      shape.toGeometry()
    )
  );

const materialMethod = function (...tags) {
  return material(this, ...tags);
};
Shape.prototype.material = materialMethod;

material.signature = 'material(shape:Shape) -> Shape';
materialMethod.signature = 'Shape -> material() -> Shape';

/**
 *
 * # Translate
 *
 * Translation moves a shape.
 *
 * ::: illustration { "view": { "position": [10, 0, 10] } }
 * ```
 * assemble(Circle(),
 *          Sphere().above())
 * ```
 * :::
 * ::: illustration { "view": { "position": [10, 0, 10] } }
 * ```
 * assemble(Circle(),
 *          Sphere().above()
 *                  .translate(0, 0, 1))
 * ```
 * :::
 * ::: illustration { "view": { "position": [10, 0, 10] } }
 * ```
 * assemble(Circle(),
 *          Sphere().above()
 *                  .translate(0, 1, 0))
 * ```
 * :::
 * ::: illustration { "view": { "position": [10, 0, 10] } }
 * ```
 * assemble(Circle(),
 *          Sphere().above()
 *                  .translate([-1, -1, 1]))
 * ```
 * :::
 *
 **/

const translate = (shape, x = 0, y = 0, z = 0) =>
  shape.transform(fromTranslation([x, y, z]));

const method$2 = function (...args) {
  return translate(this, ...args);
};
Shape.prototype.translate = method$2;

/**
 *
 * # Move
 *
 * A shorter way to write translate.
 *
 */

const move = (...args) => translate(...args);

const moveMethod = function (...params) {
  return translate(this, ...params);
};
Shape.prototype.move = moveMethod;

move.signature =
  'move(shape:Shape, x:number = 0, y:number = 0, z:number = 0) -> Shape';
moveMethod.signature =
  'Shape -> move(x:number = 0, y:number = 0, z:number = 0) -> Shape';

/**
 *
 * # MoveX
 *
 * Move along the X axis.
 *
 */

const moveX = (shape, x = 0) => move(shape, x);

const moveXMethod = function (x) {
  return moveX(this, x);
};
Shape.prototype.moveX = moveXMethod;

moveX.signature = 'moveX(shape:Shape, x:number = 0) -> Shape';
moveXMethod.signature = 'Shape -> moveX(x:number = 0) -> Shape';

/**
 *
 * # MoveY
 *
 * Move along the Y axis.
 *
 */

const moveY = (shape, y = 0) => move(shape, 0, y);

const moveYMethod = function (y) {
  return moveY(this, y);
};
Shape.prototype.moveY = moveYMethod;

moveY.signature = 'moveY(shape:Shape, y:number = 0) -> Shape';
moveYMethod.signature = 'Shape -> moveY(y:number = 0) -> Shape';

/**
 *
 * # MoveZ
 *
 * Move along the Z axis.
 *
 */

const moveZ = (shape, z = 0) => move(shape, 0, 0, z);

const moveZMethod = function (z) {
  return moveZ(this, z);
};
Shape.prototype.moveZ = moveZMethod;

moveZ.signature = 'moveZ(shape:Shape, z:number = 0) -> Shape';
moveZMethod.signature = 'Shape -> moveZ(z:number = 0) -> Shape';

/**
 *
 * # Orient
 *
 * Orients a shape so that it moves from 'center' to 'from' and faces toward 'at', rather than 'facing'.
 *
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * Square(10)
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * Square(10).orient({ from: [3, 3, 3], at: [1, 1, 1] });
 * ```
 * :::
 **/

const orient = (
  shape,
  { center = [0, 0, 0], facing = [0, 0, 1], at = [0, 0, 0], from = [0, 0, 0] }
) => {
  const normalizedFacing = normalize(facing);
  const normalizedAt = normalize(subtract(at, from));

  const angle =
    (Math.acos(dot(normalizedFacing, normalizedAt)) * 180) / Math.PI;
  const axis = normalize(cross(normalizedFacing, normalizedAt));

  return shape.move(negate(center)).rotate(angle, axis).move(from);
};

const orientMethod = function (...args) {
  return orient(this, ...args);
};
Shape.prototype.orient = orientMethod;

orient.signature =
  'orient(Shape:shape, { center:Point, facing:Vector, at:Point, from:Point }) -> Shape';
orientMethod.signature =
  'Shape -> orient({ center:Point, facing:Vector, at:Point, from:Point }) -> Shape';

/**
 *
 * # Rotate
 *
 * ```
 * rotate(shape, axis, angle)
 * shape.rotate(axis, angle)
 * ```
 *
 * Rotates the shape around the provided axis.
 *
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * Square(10)
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * Square(10).rotate([1, 1, 1], 90)
 * ```
 * :::
 **/

const rotate = (shape, angle = 0, axis = [0, 0, 1]) =>
  shape.transform(fromRotation(angle * 0.017453292519943295, axis));

const rotateMethod = function (...args) {
  return rotate(this, ...args);
};
Shape.prototype.rotate = rotateMethod;

/**
 *
 * # Rotate X
 *
 * Rotates the shape around the X axis.
 *
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * Square(10)
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * Square(10).rotateX(90)
 * ```
 * :::
 **/

const rotateX = (shape, angle) =>
  shape.transform(fromXRotation(angle * 0.017453292519943295));

const rotateXMethod = function (angle) {
  return rotateX(this, angle);
};
Shape.prototype.rotateX = rotateXMethod;

/**
 *
 * # Rotate Y
 *
 * Rotates the shape around the Y axis.
 *
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * Square(10)
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * Square(10).rotateY(90)
 * ```
 * :::
 **/

const rotateY = (shape, angle) =>
  shape.transform(fromYRotation(angle * 0.017453292519943295));

const rotateYMethod = function (angle) {
  return rotateY(this, angle);
};
Shape.prototype.rotateY = rotateYMethod;

/**
 *
 * # Rotate Z
 *
 * Rotates the shape around the Z axis.
 *
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * Square(10)
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * Square(10).rotateZ(45)
 * ```
 * :::
 **/

const rotateZ = (shape, angle) =>
  shape.transform(fromZRotation(angle * 0.017453292519943295));

const rotateZMethod = function (angle) {
  return rotateZ(this, angle);
};
Shape.prototype.rotateZ = rotateZMethod;

/**
 *
 * # Scale
 *
 * Scales an object uniformly or per axis.
 *
 * ::: illustration { "view": { "position": [10, 10, 10] } }
 * ```
 * Cube()
 * ```
 * :::
 * ::: illustration { "view": { "position": [10, 10, 10] } }
 * ```
 * Cube().scale(2)
 * ```
 * :::
 * ::: illustration { "view": { "position": [10, 10, 10] } }
 * ```
 * Cube().scale([1, 2, 3])
 * ```
 * :::
 **/

const scale = (factor, shape) => {
  if (factor.length) {
    const [x = 1, y = 1, z = 1] = factor;
    return shape.transform(fromScaling([x, y, z]));
  } else {
    return shape.transform(fromScaling([factor, factor, factor]));
  }
};

const scaleMethod = function (factor) {
  return scale(factor, this);
};
Shape.prototype.scale = scaleMethod;

const X$1 = 0;
const Y$1 = 1;
const Z$1 = 2;

const size = (shape) => {
  const geometry = shape.toKeptGeometry();
  const [min, max] = measureBoundingBox$1(geometry);
  const area = measureArea(geometry);
  const width = max[X$1] - min[X$1];
  const length = max[Y$1] - min[Y$1];
  const height = max[Z$1] - min[Z$1];
  const center = scale$1(0.5, add(min, max));
  const radius = distance(center, max);
  return { area, length, width, height, max, min, center, radius };
};

const sizeMethod = function () {
  return size(this);
};
Shape.prototype.size = sizeMethod;

size.signature = 'size(shape:Shape) -> Size';
sizeMethod.signature = 'Shape -> size() -> Size';

/**
 *
 * # Turn
 *
 * ```
 * turn(shape, axis, angle)
 * shape.turn(axis, angle)
 * ```
 *
 * Rotates the shape around its own axis.
 *
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * Square(10)
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * Square(10).turn([1, 1, 1], 90)
 * ```
 * :::
 **/

const turn = (shape, axis, angle) => {
  const center = shape.measureCenter();
  return shape
    .move(...negate(center))
    .rotate(axis, angle)
    .move(...center);
};

const turnMethod = function (angle, axis) {
  return turn(this, axis, angle);
};
Shape.prototype.turn = turnMethod;

const turnX = (shape, angle) => {
  const center = shape.measureCenter();
  return shape
    .move(...negate(center))
    .rotateX(angle)
    .move(...center);
};

const turnXMethod = function (angle) {
  return turnX(this, angle);
};
Shape.prototype.turnX = turnXMethod;

const turnY = (shape, angle) => {
  const center = shape.measureCenter();
  return shape
    .move(...negate(center))
    .rotateY(angle)
    .move(...center);
};

const turnYMethod = function (angle) {
  return turnY(this, angle);
};
Shape.prototype.turnY = turnYMethod;

const turnZ = (shape, angle) => {
  const center = shape.measureCenter();
  return shape
    .move(...negate(center))
    .rotateZ(angle)
    .move(...center);
};

const turnZMethod = function (angle) {
  return turnZ(this, angle);
};
Shape.prototype.turnZ = turnZMethod;

const prepareShape = (shape, name, options = {}) => {
  let index = 0;
  const entries = [];
  entries.push({
    data: new TextEncoder('utf8').encode(JSON.stringify(shape)),
    filename: `${name}_${index++}.jsxcad`,
    type: 'application/x-jsxcad',
  });
  return entries;
};

const downloadShapeMethod = function (...args) {
  const entries = prepareShape(this, ...args);
  emit({ download: { entries } });
  return this;
};
Shape.prototype.downloadShape = downloadShapeMethod;

const writeShape = (shape, name, options = {}) => {
  for (const { data, filename } of prepareShape(shape, name, {})) {
    addPending(writeFile({ doSerialize: false }, `output/${filename}`, data));
  }
  return shape;
};

const writeShapeMethod = function (...args) {
  return writeShape(this, ...args);
};
Shape.prototype.writeShape = writeShapeMethod;

export default Shape;
export { Shape, assemble, canonicalize, center, color, colors, difference, drop, intersection, keep, kept, layer, log, make, material, move, moveX, moveY, moveZ, orient, readShape, rotate, rotateX, rotateY, rotateZ, scale, size, translate, turn, turnX, turnY, turnZ, union, writeShape };
