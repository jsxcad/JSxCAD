import { close, concatenate, open, getEdges, toSegments, isClosed } from './jsxcad-geometry-path.js';
import { eachPoint, flip, toDisjointGeometry, toKeptGeometry as toKeptGeometry$1, toTransformedGeometry, toPoints, transform, fromPathToSurface, fromPathToZ0Surface, fromPathsToSurface, fromPathsToZ0Surface, union as union$1, rewriteTags, allTags, difference as difference$1, getSolids, assemble as assemble$1, getPlans, getConnections, getItems, splice, drop as drop$1, getAnySurfaces, getPaths, intersection as intersection$1, measureBoundingBox as measureBoundingBox$1, outline as outline$1, getZ0Surfaces, getSurfaces, keep as keep$1, nonNegative, specify as specify$1 } from './jsxcad-geometry-tagged.js';
import { fromPolygons, alignVertices, transform as transform$3, measureBoundingBox as measureBoundingBox$2 } from './jsxcad-geometry-solid.js';
import * as jsxcadMathVec3_js from './jsxcad-math-vec3.js';
import { scale as scale$1, add, subtract, negate, transform as transform$1, normalize, dot, cross } from './jsxcad-math-vec3.js';
export { jsxcadMathVec3_js as vec };
import { buildRegularPolygon, toRadiusFromApothem as toRadiusFromApothem$1, regularPolygonEdgeLengthToRadius, buildPolygonFromPoints, buildRegularPrism, buildFromFunction, buildFromSlices, buildRegularIcosahedron, buildRingSphere, buildRegularTetrahedron, lathe as lathe$1, buildConvexSurfaceHull, buildConvexHull, extrude as extrude$1, buildConvexMinkowskiSum } from './jsxcad-algorithm-shape.js';
import { translate as translate$1 } from './jsxcad-geometry-paths.js';
import { toPlane } from './jsxcad-math-poly3.js';
import { toXYPlaneTransforms } from './jsxcad-math-plane.js';
import { log as log$1, readFile, getSources, ask as ask$1, writeFile, addSource } from './jsxcad-sys.js';
import { verlet, addInertia, createAngleConstraint, createDistanceConstraint, createPinnedConstraint, solve, positions } from './jsxcad-algorithm-verlet.js';
import { identity, fromZRotation, multiply, fromTranslation, fromRotation, fromXRotation, fromYRotation, fromScaling } from './jsxcad-math-mat4.js';
import { toFont } from './jsxcad-algorithm-text.js';
import { fromSvgPath, fromSvg, toSvg } from './jsxcad-convert-svg.js';
import { cut, section as section$1, cutOpen, fromSolid, containsPoint } from './jsxcad-algorithm-bsp-surfaces.js';
import { cut as cut$1, toPlane as toPlane$1, transform as transform$2, retessellate, flip as flip$1 } from './jsxcad-geometry-surface.js';
import { toTagFromName } from './jsxcad-algorithm-color.js';
import { toEcmascript } from './jsxcad-compiler.js';
import { pack as pack$1 } from './jsxcad-algorithm-pack.js';
import { fromDst } from './jsxcad-convert-dst.js';
import { fromDxf, toDxf } from './jsxcad-convert-dxf.js';
import { fromLDraw } from './jsxcad-convert-ldraw.js';
import { fromPng } from './jsxcad-convert-png.js';
import { fromShapefile } from './jsxcad-convert-shapefile.js';
import { fromStl, toStl } from './jsxcad-convert-stl.js';
import { overcut } from './jsxcad-algorithm-toolpath.js';
import { toGcode } from './jsxcad-convert-gcode.js';
import { toPdf } from './jsxcad-convert-pdf.js';
import { toSvg as toSvg$1, toThreejsPage } from './jsxcad-convert-threejs.js';

var api = /*#__PURE__*/Object.freeze({
  __proto__: null,
  get Shape () { return Shape; },
  get acos () { return acos; },
  get ask () { return ask; },
  get Armature () { return Armature; },
  get assemble () { return assemble; },
  get chainHull () { return chainHull; },
  get Circle () { return Circle; },
  get Cone () { return Cone; },
  get Connector () { return Connector; },
  get coordinates () { return coordinates; },
  get cos () { return cos; },
  get Cube () { return Cube; },
  get Cursor () { return Cursor; },
  get Cylinder () { return Cylinder; },
  get difference () { return difference; },
  get ease () { return ease; },
  get flat () { return flat; },
  get Font () { return Font; },
  get Gear () { return Gear; },
  get Hershey () { return Hershey; },
  get Hexagon () { return Hexagon; },
  get hull () { return hull; },
  get Icosahedron () { return Icosahedron; },
  get Item () { return Item; },
  get importModule () { return importModule; },
  get intersection () { return intersection; },
  get join () { return join; },
  get lathe () { return lathe; },
  get Label () { return Label; },
  get Lego () { return Lego; },
  get Line () { return Line; },
  get log () { return log; },
  get max () { return max; },
  get MicroGearMotor () { return MicroGearMotor; },
  get minkowski () { return minkowski; },
  get Nail () { return Nail; },
  get numbers () { return numbers; },
  get pack () { return pack; },
  get Plan () { return Plan; },
  get Path () { return Path; },
  get Point () { return Point; },
  get Points () { return Points; },
  get Polygon () { return Polygon; },
  get Polyhedron () { return Polyhedron; },
  get Prism () { return Prism; },
  get readDst () { return readDst; },
  get readDxf () { return readDxf; },
  get readFont () { return readFont; },
  get readLDraw () { return readLDraw; },
  get readPng () { return readPng; },
  get readShape () { return readShape; },
  get readShapefile () { return readShapefile; },
  get readStl () { return readStl; },
  get readSvg () { return readSvg; },
  get readSvgPath () { return readSvgPath; },
  get rejoin () { return rejoin; },
  get shell () { return shell; },
  get sin () { return sin; },
  get source () { return source; },
  get specify () { return specify; },
  get Sphere () { return Sphere; },
  get sqrt () { return sqrt; },
  get stretch () { return stretch; },
  get Spiral () { return Spiral; },
  get Square () { return Square; },
  get SvgPath () { return SvgPath; },
  get Tetrahedron () { return Tetrahedron; },
  get ThreadedRod () { return ThreadedRod; },
  get Torus () { return Torus; },
  get Triangle () { return Triangle; },
  get union () { return union; },
  get vec () { return jsxcadMathVec3_js; },
  get Wave () { return Wave; },
  get X () { return X; },
  get Y () { return Y; },
  get Z () { return Z; }
});

class Shape {
  close () {
    const geometry = this.toKeptGeometry();
    if (!isSingleOpenPath(geometry)) {
      throw Error('Close requires a single open path.');
    }
    return Shape.fromClosedPath(close(geometry.paths[0]));
  }

  concat (...shapes) {
    const paths = [];
    for (const shape of [this, ...shapes]) {
      const geometry = shape.toKeptGeometry();
      if (!isSingleOpenPath(geometry)) {
        throw Error('Concatenation requires single open paths.');
      }
      paths.push(geometry.paths[0]);
    }
    return Shape.fromOpenPath(concatenate(...paths));
  }

  constructor (geometry = fromGeometry({ assembly: [] }),
               context) {
    if (geometry.geometry) {
      throw Error('die');
    }
    this.geometry = geometry;
    this.context = context;
  }

  eachPoint (options = {}, operation) {
    eachPoint(options, operation, this.toKeptGeometry());
  }

  flip () {
    return fromGeometry(flip(toKeptGeometry(this)), this.context);
  }

  op (op, ...args) {
    return op(this, ...args);
  }

  setTags (tags) {
    return fromGeometry({ ...toGeometry(this), tags }, this.context);
  }

  toDisjointGeometry (options = {}) {
    return toDisjointGeometry(toGeometry(this));
  }

  toKeptGeometry (options = {}) {
    return toKeptGeometry$1(toGeometry(this));
  }

  getContext (symbol) {
    return this.context[symbol];
  }

  toGeometry () {
    return this.geometry;
  }

  toTransformedGeometry () {
    return toTransformedGeometry(this.toGeometry());
  }

  toPoints (options = {}) {
    return toPoints(options, this.toKeptGeometry()).points;
  }

  transform (matrix) {
    if (matrix.some(item => typeof item !== 'number' || isNaN(item))) {
      throw Error('die');
    }
    return fromGeometry(transform(matrix, this.toGeometry()), this.context);
  }
}
const isSingleOpenPath = ({ paths }) => (paths !== undefined) && (paths.length === 1) && (paths[0][0] === null);

Shape.fromClosedPath = (path, context) => fromGeometry({ paths: [close(path)] }, context);
Shape.fromGeometry = (geometry, context) => new Shape(geometry, context);
Shape.fromOpenPath = (path, context) => fromGeometry({ paths: [open(path)] }, context);
Shape.fromPath = (path, context) => fromGeometry({ paths: [path] }, context);
Shape.fromPaths = (paths, context) => fromGeometry({ paths: paths }, context);
Shape.fromPathToSurface = (path, context) => fromGeometry(fromPathToSurface(path), context);
Shape.fromPathToZ0Surface = (path, context) => fromGeometry(fromPathToZ0Surface(path), context);
Shape.fromPathsToSurface = (paths, context) => fromGeometry(fromPathsToSurface(paths), context);
Shape.fromPathsToZ0Surface = (paths, context) => fromGeometry(fromPathsToZ0Surface(paths), context);
Shape.fromPoint = (point, context) => fromGeometry({ points: [point] }, context);
Shape.fromPoints = (points, context) => fromGeometry({ points: points }, context);
Shape.fromPolygonsToSolid = (polygons, context) => fromGeometry({ solid: fromPolygons({}, polygons) }, context);
Shape.fromPolygonsToZ0Surface = (polygons, context) => fromGeometry({ z0Surface: polygons }, context);
Shape.fromSurfaces = (surfaces, context) => fromGeometry({ solid: surfaces }, context);
Shape.fromSolid = (solid, context) => fromGeometry({ solid: solid }, context);

const fromGeometry = Shape.fromGeometry;
const toGeometry = (shape) => shape.toGeometry();
const toKeptGeometry = (shape) => shape.toKeptGeometry();

const dispatch = (name, ...dispatches) => {
  const op = (...params) => {
    for (const dispatch of dispatches) {
      // For each signature
      let operation;
      try {
        // Try to decode it into an operation.
        operation = dispatch(...params);
      } catch (e) {
        continue;
      }
      return operation();
    }
    throw Error(`Unsupported interface for ${name}: ${JSON.stringify(params)}`);
  };

  return op;
};

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

const unionOfShapes = (...shapes) => {
  switch (shapes.length) {
    case 0: {
      return fromGeometry({ assembly: [] });
    }
    case 1: {
      return shapes[0];
    }
    default: {
      return fromGeometry(union$1(...shapes.map(toKeptGeometry)));
    }
  }
};

const union = dispatch(
  'union',
  (...shapes) => {
    return () => unionOfShapes(...shapes);
  });

const method = function (...shapes) { return union(this, ...shapes); };

Shape.prototype.union = method;

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

const method$1 = function (...shapes) { return union(this, ...shapes); };
Shape.prototype.add = method$1;

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
  Shape.fromGeometry(rewriteTags(tags.map(tag => `user/${tag}`), [], shape.toGeometry()));

const notAs = (shape, tags) =>
  Shape.fromGeometry(rewriteTags([], tags.map(tag => `user/${tag}`), shape.toGeometry()));

const asMethod = function (...tags) { return as(this, tags); };
const notAsMethod = function (...tags) { return notAs(this, tags); };

Shape.prototype.as = asMethod;
Shape.prototype.notAs = notAsMethod;

/**
 *
 * # Bill Of Materials
 *
 **/

const bom = (shape, ...args) => shape;

const bomMethod = function (...args) { return bom(this, ...args); };
Shape.prototype.bom = bomMethod;

const colors = (shape) =>
  [...allTags(shape.toGeometry())]
      .filter(tag => tag.startsWith('color/'))
      .map(tag => tag.substring(6));

const colorsMethod = function () { return colors(this); };
Shape.prototype.colors = colorsMethod;

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
      return fromGeometry({ assembly: [] });
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

const method$2 = function (...shapes) { return difference(this, ...shapes); };
Shape.prototype.cut = method$2;

const edges = (shape, op = (_ => _)) => {
  const edgeId = (from, to) => `${JSON.stringify(from)}->${JSON.stringify(to)}`;
  const edges = new Map();
  for (const { solid } of getSolids(shape.toKeptGeometry())) {
    const alignedSolid = alignVertices(solid);
    for (const surface of alignedSolid) {
      for (const face of surface) {
        for (const [lastPoint, nextPoint] of getEdges(face)) {
          const [a, b] = [lastPoint, nextPoint].sort();
          edges.set(edgeId(a, b), [a, b]);
        }
      }
    }
  }
  return [...edges.values()];
};

const edgesMethod = function (...args) { return edges(this, ...args); };
Shape.prototype.edges = edgesMethod;

const unitPolygon = (sides = 16) => Shape.fromGeometry(buildRegularPolygon(sides));

// Note: radius here is circumradius.
const toRadiusFromEdge = (edge, sides) => edge * regularPolygonEdgeLengthToRadius(1, sides);

const ofRadius = (radius, { sides = 16 } = {}) => unitPolygon(sides).scale(radius);
const ofEdge = (edge, { sides = 16 }) => ofRadius(toRadiusFromEdge(edge, sides), { sides });
const ofApothem = (apothem, { sides = 16 }) => ofRadius(toRadiusFromApothem$1(apothem, sides), { sides });
const ofDiameter = (diameter, ...args) => ofRadius(diameter / 2, ...args);
const ofPoints = (points) => Shape.fromGeometry(buildPolygonFromPoints(points));

/**
 *
 * # Polygon
 *
 * ::: illustration { "view": { "position": [0, 0, 5] } }
 * ```
 * Polygon([0, 1],
 *         [1, 1],
 *         [1, 0],
 *         [0.2, 0.2])
 * ```
 * :::
 * ::: illustration { "view": { "position": [0, -1, 50] } }
 * ```
 * Polygon({ edge: 10, sides: 6 })
 * ```
 * :::
 * ::: illustration { "view": { "position": [0, -1, 50] } }
 * ```
 * assemble(
 *   Polygon({ apothem: 10, sides: 5 }),
 *   Circle(10).drop())
 * ```
 * :::
 * ::: illustration { "view": { "position": [0, -1, 50] } }
 * ```
 * assemble(
 *   Circle(10),
 *   Polygon({ radius: 10, sides: 5 }).drop())
 * ```
 * :::
 * ::: illustration { "view": { "position": [0, -1, 50] } }
 * ```
 * Polygon({ diameter: 20, sides: 3 })
 * ```
 * :::
 *
 **/

const Polygon = (...args) => ofRadius(...args);

Polygon.ofEdge = ofEdge;
Polygon.ofApothem = ofApothem;
Polygon.ofRadius = ofRadius;
Polygon.ofDiameter = ofDiameter;
Polygon.ofPoints = ofPoints;
Polygon.toRadiusFromApothem = toRadiusFromApothem$1;

/**
 *
 * # Circle (disc)
 *
 * Circles are approximated as surfaces delimeted by regular polygons.
 *
 * Properly speaking what is produced here are discs.
 * The circle perimeter can be extracted via outline().
 *
 * ::: illustration { "view": { "position": [0, 0, 10] } }
 * ```
 * Circle()
 * ```
 * :::
 * ::: illustration
 * ```
 * Circle(10)
 * ```
 * :::
 * ::: illustration
 * ```
 * Circle.ofRadius(10, { sides: 8 })
 * ```
 * :::
 * ::: illustration
 * ```
 * Circle.ofApothem(10, { sides: 8 })
 * ```
 * :::
 * ::: illustration
 * ```
 * Circle.ofApothem(10, { sides: 5 })
 *       .with(Circle.ofRadius(10, { sides: 5 }).drop(),
 *             Circle.ofRadius(10).outline().moveZ(0.01))
 * ```
 * :::
 * ::: illustration
 * ```
 * Circle.ofDiameter(20, { sides: 16 })
 * ```
 * :::
 * ::: illustration
 * ```
 * Circle.ofEdge(5, { sides: 5 })
 * ```
 * :::
 **/

const ofEdge$1 = (edge = 1, { sides = 32 } = {}) => Polygon.ofEdge(edge, { sides });
const ofRadius$1 = (radius = 1, { sides = 32 } = {}) => Polygon.ofRadius(radius, { sides });
const ofApothem$1 = (apothem = 1, { sides = 32 } = {}) => Polygon.ofApothem(apothem, { sides });
const ofDiameter$1 = (diameter = 1, { sides = 32 } = {}) => Polygon.ofDiameter(diameter, { sides });

const Circle = (...args) => ofRadius$1(...args);

Circle.ofEdge = ofEdge$1;
Circle.ofApothem = ofApothem$1;
Circle.ofRadius = ofRadius$1;
Circle.ofDiameter = ofDiameter$1;
Circle.toRadiusFromApothem = (radius = 1, sides = 32) => Polygon.toRadiusFromApothem(radius, sides);

// Hershey simplex one line font.
// See: http://paulbourke.net/dataformats/hershey/

const hersheyPaths = { '32': [[null]], '33': [[null, [5, 21, 0], [5, 7, 0]], [null, [5, 2, 0], [4, 1, 0], [5, 0, 0], [6, 1, 0], [5, 2, 0]], [null]], '34': [[null, [4, 21, 0], [4, 14, 0]], [null, [12, 21, 0], [12, 14, 0]], [null]], '35': [[null, [11, 25, 0], [4, -7, 0]], [null, [17, 25, 0], [10, -7, 0]], [null, [4, 12, 0], [18, 12, 0]], [null, [3, 6, 0], [17, 6, 0]], [null]], '36': [[null, [8, 25, 0], [8, -4, 0]], [null, [12, 25, 0], [12, -4, 0]], [null, [17, 18, 0], [15, 20, 0], [12, 21, 0], [8, 21, 0], [5, 20, 0], [3, 18, 0], [3, 16, 0], [4, 14, 0], [5, 13, 0], [7, 12, 0], [13, 10, 0], [15, 9, 0], [16, 8, 0], [17, 6, 0], [17, 3, 0], [15, 1, 0], [12, 0, 0], [8, 0, 0], [5, 1, 0], [3, 3, 0]], [null]], '37': [[null, [21, 21, 0], [3, 0, 0]], [null, [8, 21, 0], [10, 19, 0], [10, 17, 0], [9, 15, 0], [7, 14, 0], [5, 14, 0], [3, 16, 0], [3, 18, 0], [4, 20, 0], [6, 21, 0], [8, 21, 0], [10, 20, 0], [13, 19, 0], [16, 19, 0], [19, 20, 0], [21, 21, 0]], [null, [17, 7, 0], [15, 6, 0], [14, 4, 0], [14, 2, 0], [16, 0, 0], [18, 0, 0], [20, 1, 0], [21, 3, 0], [21, 5, 0], [19, 7, 0], [17, 7, 0]], [null]], '38': [[null, [23, 12, 0], [23, 13, 0], [22, 14, 0], [21, 14, 0], [20, 13, 0], [19, 11, 0], [17, 6, 0], [15, 3, 0], [13, 1, 0], [11, 0, 0], [7, 0, 0], [5, 1, 0], [4, 2, 0], [3, 4, 0], [3, 6, 0], [4, 8, 0], [5, 9, 0], [12, 13, 0], [13, 14, 0], [14, 16, 0], [14, 18, 0], [13, 20, 0], [11, 21, 0], [9, 20, 0], [8, 18, 0], [8, 16, 0], [9, 13, 0], [11, 10, 0], [16, 3, 0], [18, 1, 0], [20, 0, 0], [22, 0, 0], [23, 1, 0], [23, 2, 0]], [null]], '39': [[null, [5, 19, 0], [4, 20, 0], [5, 21, 0], [6, 20, 0], [6, 18, 0], [5, 16, 0], [4, 15, 0]], [null]], '40': [[null, [11, 25, 0], [9, 23, 0], [7, 20, 0], [5, 16, 0], [4, 11, 0], [4, 7, 0], [5, 2, 0], [7, -2, 0], [9, -5, 0], [11, -7, 0]], [null]], '41': [[null, [3, 25, 0], [5, 23, 0], [7, 20, 0], [9, 16, 0], [10, 11, 0], [10, 7, 0], [9, 2, 0], [7, -2, 0], [5, -5, 0], [3, -7, 0]], [null]], '42': [[null, [8, 21, 0], [8, 9, 0]], [null, [3, 18, 0], [13, 12, 0]], [null, [13, 18, 0], [3, 12, 0]], [null]], '43': [[null, [13, 18, 0], [13, 0, 0]], [null, [4, 9, 0], [22, 9, 0]], [null]], '44': [[null, [6, 1, 0], [5, 0, 0], [4, 1, 0], [5, 2, 0], [6, 1, 0], [6, -1, 0], [5, -3, 0], [4, -4, 0]], [null]], '45': [[null, [4, 9, 0], [22, 9, 0]], [null]], '46': [[null, [5, 2, 0], [4, 1, 0], [5, 0, 0], [6, 1, 0], [5, 2, 0]], [null]], '47': [[null, [20, 25, 0], [2, -7, 0]], [null]], '48': [[null, [9, 21, 0], [6, 20, 0], [4, 17, 0], [3, 12, 0], [3, 9, 0], [4, 4, 0], [6, 1, 0], [9, 0, 0], [11, 0, 0], [14, 1, 0], [16, 4, 0], [17, 9, 0], [17, 12, 0], [16, 17, 0], [14, 20, 0], [11, 21, 0], [9, 21, 0]], [null]], '49': [[null, [6, 17, 0], [8, 18, 0], [11, 21, 0], [11, 0, 0]], [null]], '50': [[null, [4, 16, 0], [4, 17, 0], [5, 19, 0], [6, 20, 0], [8, 21, 0], [12, 21, 0], [14, 20, 0], [15, 19, 0], [16, 17, 0], [16, 15, 0], [15, 13, 0], [13, 10, 0], [3, 0, 0], [17, 0, 0]], [null]], '51': [[null, [5, 21, 0], [16, 21, 0], [10, 13, 0], [13, 13, 0], [15, 12, 0], [16, 11, 0], [17, 8, 0], [17, 6, 0], [16, 3, 0], [14, 1, 0], [11, 0, 0], [8, 0, 0], [5, 1, 0], [4, 2, 0], [3, 4, 0]], [null]], '52': [[null, [13, 21, 0], [3, 7, 0], [18, 7, 0]], [null, [13, 21, 0], [13, 0, 0]], [null]], '53': [[null, [15, 21, 0], [5, 21, 0], [4, 12, 0], [5, 13, 0], [8, 14, 0], [11, 14, 0], [14, 13, 0], [16, 11, 0], [17, 8, 0], [17, 6, 0], [16, 3, 0], [14, 1, 0], [11, 0, 0], [8, 0, 0], [5, 1, 0], [4, 2, 0], [3, 4, 0]], [null]], '54': [[null, [16, 18, 0], [15, 20, 0], [12, 21, 0], [10, 21, 0], [7, 20, 0], [5, 17, 0], [4, 12, 0], [4, 7, 0], [5, 3, 0], [7, 1, 0], [10, 0, 0], [11, 0, 0], [14, 1, 0], [16, 3, 0], [17, 6, 0], [17, 7, 0], [16, 10, 0], [14, 12, 0], [11, 13, 0], [10, 13, 0], [7, 12, 0], [5, 10, 0], [4, 7, 0]], [null]], '55': [[null, [17, 21, 0], [7, 0, 0]], [null, [3, 21, 0], [17, 21, 0]], [null]], '56': [[null, [8, 21, 0], [5, 20, 0], [4, 18, 0], [4, 16, 0], [5, 14, 0], [7, 13, 0], [11, 12, 0], [14, 11, 0], [16, 9, 0], [17, 7, 0], [17, 4, 0], [16, 2, 0], [15, 1, 0], [12, 0, 0], [8, 0, 0], [5, 1, 0], [4, 2, 0], [3, 4, 0], [3, 7, 0], [4, 9, 0], [6, 11, 0], [9, 12, 0], [13, 13, 0], [15, 14, 0], [16, 16, 0], [16, 18, 0], [15, 20, 0], [12, 21, 0], [8, 21, 0]], [null]], '57': [[null, [16, 14, 0], [15, 11, 0], [13, 9, 0], [10, 8, 0], [9, 8, 0], [6, 9, 0], [4, 11, 0], [3, 14, 0], [3, 15, 0], [4, 18, 0], [6, 20, 0], [9, 21, 0], [10, 21, 0], [13, 20, 0], [15, 18, 0], [16, 14, 0], [16, 9, 0], [15, 4, 0], [13, 1, 0], [10, 0, 0], [8, 0, 0], [5, 1, 0], [4, 3, 0]], [null]], '58': [[null, [5, 14, 0], [4, 13, 0], [5, 12, 0], [6, 13, 0], [5, 14, 0]], [null, [5, 2, 0], [4, 1, 0], [5, 0, 0], [6, 1, 0], [5, 2, 0]], [null]], '59': [[null, [5, 14, 0], [4, 13, 0], [5, 12, 0], [6, 13, 0], [5, 14, 0]], [null, [6, 1, 0], [5, 0, 0], [4, 1, 0], [5, 2, 0], [6, 1, 0], [6, -1, 0], [5, -3, 0], [4, -4, 0]], [null]], '60': [[null, [20, 18, 0], [4, 9, 0], [20, 0, 0]], [null]], '61': [[null, [4, 12, 0], [22, 12, 0]], [null, [4, 6, 0], [22, 6, 0]], [null]], '62': [[null, [4, 18, 0], [20, 9, 0], [4, 0, 0]], [null]], '63': [[null, [3, 16, 0], [3, 17, 0], [4, 19, 0], [5, 20, 0], [7, 21, 0], [11, 21, 0], [13, 20, 0], [14, 19, 0], [15, 17, 0], [15, 15, 0], [14, 13, 0], [13, 12, 0], [9, 10, 0], [9, 7, 0]], [null, [9, 2, 0], [8, 1, 0], [9, 0, 0], [10, 1, 0], [9, 2, 0]], [null]], '64': [[null, [18, 13, 0], [17, 15, 0], [15, 16, 0], [12, 16, 0], [10, 15, 0], [9, 14, 0], [8, 11, 0], [8, 8, 0], [9, 6, 0], [11, 5, 0], [14, 5, 0], [16, 6, 0], [17, 8, 0]], [null, [12, 16, 0], [10, 14, 0], [9, 11, 0], [9, 8, 0], [10, 6, 0], [11, 5, 0]], [null, [18, 16, 0], [17, 8, 0], [17, 6, 0], [19, 5, 0], [21, 5, 0], [23, 7, 0], [24, 10, 0], [24, 12, 0], [23, 15, 0], [22, 17, 0], [20, 19, 0], [18, 20, 0], [15, 21, 0], [12, 21, 0], [9, 20, 0], [7, 19, 0], [5, 17, 0], [4, 15, 0], [3, 12, 0], [3, 9, 0], [4, 6, 0], [5, 4, 0], [7, 2, 0], [9, 1, 0], [12, 0, 0], [15, 0, 0], [18, 1, 0], [20, 2, 0], [21, 3, 0]], [null, [19, 16, 0], [18, 8, 0], [18, 6, 0], [19, 5, 0]]], '65': [[null, [9, 21, 0], [1, 0, 0]], [null, [9, 21, 0], [17, 0, 0]], [null, [4, 7, 0], [14, 7, 0]], [null]], '66': [[null, [4, 21, 0], [4, 0, 0]], [null, [4, 21, 0], [13, 21, 0], [16, 20, 0], [17, 19, 0], [18, 17, 0], [18, 15, 0], [17, 13, 0], [16, 12, 0], [13, 11, 0]], [null, [4, 11, 0], [13, 11, 0], [16, 10, 0], [17, 9, 0], [18, 7, 0], [18, 4, 0], [17, 2, 0], [16, 1, 0], [13, 0, 0], [4, 0, 0]], [null]], '67': [[null, [18, 16, 0], [17, 18, 0], [15, 20, 0], [13, 21, 0], [9, 21, 0], [7, 20, 0], [5, 18, 0], [4, 16, 0], [3, 13, 0], [3, 8, 0], [4, 5, 0], [5, 3, 0], [7, 1, 0], [9, 0, 0], [13, 0, 0], [15, 1, 0], [17, 3, 0], [18, 5, 0]], [null]], '68': [[null, [4, 21, 0], [4, 0, 0]], [null, [4, 21, 0], [11, 21, 0], [14, 20, 0], [16, 18, 0], [17, 16, 0], [18, 13, 0], [18, 8, 0], [17, 5, 0], [16, 3, 0], [14, 1, 0], [11, 0, 0], [4, 0, 0]], [null]], '69': [[null, [4, 21, 0], [4, 0, 0]], [null, [4, 21, 0], [17, 21, 0]], [null, [4, 11, 0], [12, 11, 0]], [null, [4, 0, 0], [17, 0, 0]], [null]], '70': [[null, [4, 21, 0], [4, 0, 0]], [null, [4, 21, 0], [17, 21, 0]], [null, [4, 11, 0], [12, 11, 0]], [null]], '71': [[null, [18, 16, 0], [17, 18, 0], [15, 20, 0], [13, 21, 0], [9, 21, 0], [7, 20, 0], [5, 18, 0], [4, 16, 0], [3, 13, 0], [3, 8, 0], [4, 5, 0], [5, 3, 0], [7, 1, 0], [9, 0, 0], [13, 0, 0], [15, 1, 0], [17, 3, 0], [18, 5, 0], [18, 8, 0]], [null, [13, 8, 0], [18, 8, 0]], [null]], '72': [[null, [4, 21, 0], [4, 0, 0]], [null, [18, 21, 0], [18, 0, 0]], [null, [4, 11, 0], [18, 11, 0]], [null]], '73': [[null, [4, 21, 0], [4, 0, 0]], [null]], '74': [[null, [12, 21, 0], [12, 5, 0], [11, 2, 0], [10, 1, 0], [8, 0, 0], [6, 0, 0], [4, 1, 0], [3, 2, 0], [2, 5, 0], [2, 7, 0]], [null]], '75': [[null, [4, 21, 0], [4, 0, 0]], [null, [18, 21, 0], [4, 7, 0]], [null, [9, 12, 0], [18, 0, 0]], [null]], '76': [[null, [4, 21, 0], [4, 0, 0]], [null, [4, 0, 0], [16, 0, 0]], [null]], '77': [[null, [4, 21, 0], [4, 0, 0]], [null, [4, 21, 0], [12, 0, 0]], [null, [20, 21, 0], [12, 0, 0]], [null, [20, 21, 0], [20, 0, 0]], [null]], '78': [[null, [4, 21, 0], [4, 0, 0]], [null, [4, 21, 0], [18, 0, 0]], [null, [18, 21, 0], [18, 0, 0]], [null]], '79': [[null, [9, 21, 0], [7, 20, 0], [5, 18, 0], [4, 16, 0], [3, 13, 0], [3, 8, 0], [4, 5, 0], [5, 3, 0], [7, 1, 0], [9, 0, 0], [13, 0, 0], [15, 1, 0], [17, 3, 0], [18, 5, 0], [19, 8, 0], [19, 13, 0], [18, 16, 0], [17, 18, 0], [15, 20, 0], [13, 21, 0], [9, 21, 0]], [null]], '80': [[null, [4, 21, 0], [4, 0, 0]], [null, [4, 21, 0], [13, 21, 0], [16, 20, 0], [17, 19, 0], [18, 17, 0], [18, 14, 0], [17, 12, 0], [16, 11, 0], [13, 10, 0], [4, 10, 0]], [null]], '81': [[null, [9, 21, 0], [7, 20, 0], [5, 18, 0], [4, 16, 0], [3, 13, 0], [3, 8, 0], [4, 5, 0], [5, 3, 0], [7, 1, 0], [9, 0, 0], [13, 0, 0], [15, 1, 0], [17, 3, 0], [18, 5, 0], [19, 8, 0], [19, 13, 0], [18, 16, 0], [17, 18, 0], [15, 20, 0], [13, 21, 0], [9, 21, 0]], [null, [12, 4, 0], [18, -2, 0]], [null]], '82': [[null, [4, 21, 0], [4, 0, 0]], [null, [4, 21, 0], [13, 21, 0], [16, 20, 0], [17, 19, 0], [18, 17, 0], [18, 15, 0], [17, 13, 0], [16, 12, 0], [13, 11, 0], [4, 11, 0]], [null, [11, 11, 0], [18, 0, 0]], [null]], '83': [[null, [17, 18, 0], [15, 20, 0], [12, 21, 0], [8, 21, 0], [5, 20, 0], [3, 18, 0], [3, 16, 0], [4, 14, 0], [5, 13, 0], [7, 12, 0], [13, 10, 0], [15, 9, 0], [16, 8, 0], [17, 6, 0], [17, 3, 0], [15, 1, 0], [12, 0, 0], [8, 0, 0], [5, 1, 0], [3, 3, 0]], [null]], '84': [[null, [8, 21, 0], [8, 0, 0]], [null, [1, 21, 0], [15, 21, 0]], [null]], '85': [[null, [4, 21, 0], [4, 6, 0], [5, 3, 0], [7, 1, 0], [10, 0, 0], [12, 0, 0], [15, 1, 0], [17, 3, 0], [18, 6, 0], [18, 21, 0]], [null]], '86': [[null, [1, 21, 0], [9, 0, 0]], [null, [17, 21, 0], [9, 0, 0]], [null]], '87': [[null, [2, 21, 0], [7, 0, 0]], [null, [12, 21, 0], [7, 0, 0]], [null, [12, 21, 0], [17, 0, 0]], [null, [22, 21, 0], [17, 0, 0]], [null]], '88': [[null, [3, 21, 0], [17, 0, 0]], [null, [17, 21, 0], [3, 0, 0]], [null]], '89': [[null, [1, 21, 0], [9, 11, 0], [9, 0, 0]], [null, [17, 21, 0], [9, 11, 0]], [null]], '90': [[null, [17, 21, 0], [3, 0, 0]], [null, [3, 21, 0], [17, 21, 0]], [null, [3, 0, 0], [17, 0, 0]], [null]], '91': [[null, [4, 25, 0], [4, -7, 0]], [null, [5, 25, 0], [5, -7, 0]], [null, [4, 25, 0], [11, 25, 0]], [null, [4, -7, 0], [11, -7, 0]], [null]], '92': [[null, [0, 21, 0], [14, -3, 0]], [null]], '93': [[null, [9, 25, 0], [9, -7, 0]], [null, [10, 25, 0], [10, -7, 0]], [null, [3, 25, 0], [10, 25, 0]], [null, [3, -7, 0], [10, -7, 0]], [null]], '94': [[null, [6, 15, 0], [8, 18, 0], [10, 15, 0]], [null, [3, 12, 0], [8, 17, 0], [13, 12, 0]], [null, [8, 17, 0], [8, 0, 0]], [null]], '95': [[null, [0, -2, 0], [16, -2, 0]], [null]], '96': [[null, [6, 21, 0], [5, 20, 0], [4, 18, 0], [4, 16, 0], [5, 15, 0], [6, 16, 0], [5, 17, 0]], [null]], '97': [[null, [15, 14, 0], [15, 0, 0]], [null, [15, 11, 0], [13, 13, 0], [11, 14, 0], [8, 14, 0], [6, 13, 0], [4, 11, 0], [3, 8, 0], [3, 6, 0], [4, 3, 0], [6, 1, 0], [8, 0, 0], [11, 0, 0], [13, 1, 0], [15, 3, 0]], [null]], '98': [[null, [4, 21, 0], [4, 0, 0]], [null, [4, 11, 0], [6, 13, 0], [8, 14, 0], [11, 14, 0], [13, 13, 0], [15, 11, 0], [16, 8, 0], [16, 6, 0], [15, 3, 0], [13, 1, 0], [11, 0, 0], [8, 0, 0], [6, 1, 0], [4, 3, 0]], [null]], '99': [[null, [15, 11, 0], [13, 13, 0], [11, 14, 0], [8, 14, 0], [6, 13, 0], [4, 11, 0], [3, 8, 0], [3, 6, 0], [4, 3, 0], [6, 1, 0], [8, 0, 0], [11, 0, 0], [13, 1, 0], [15, 3, 0]], [null]], '100': [[null, [15, 21, 0], [15, 0, 0]], [null, [15, 11, 0], [13, 13, 0], [11, 14, 0], [8, 14, 0], [6, 13, 0], [4, 11, 0], [3, 8, 0], [3, 6, 0], [4, 3, 0], [6, 1, 0], [8, 0, 0], [11, 0, 0], [13, 1, 0], [15, 3, 0]], [null]], '101': [[null, [3, 8, 0], [15, 8, 0], [15, 10, 0], [14, 12, 0], [13, 13, 0], [11, 14, 0], [8, 14, 0], [6, 13, 0], [4, 11, 0], [3, 8, 0], [3, 6, 0], [4, 3, 0], [6, 1, 0], [8, 0, 0], [11, 0, 0], [13, 1, 0], [15, 3, 0]], [null]], '102': [[null, [10, 21, 0], [8, 21, 0], [6, 20, 0], [5, 17, 0], [5, 0, 0]], [null, [2, 14, 0], [9, 14, 0]], [null]], '103': [[null, [15, 14, 0], [15, -2, 0], [14, -5, 0], [13, -6, 0], [11, -7, 0], [8, -7, 0], [6, -6, 0]], [null, [15, 11, 0], [13, 13, 0], [11, 14, 0], [8, 14, 0], [6, 13, 0], [4, 11, 0], [3, 8, 0], [3, 6, 0], [4, 3, 0], [6, 1, 0], [8, 0, 0], [11, 0, 0], [13, 1, 0], [15, 3, 0]], [null]], '104': [[null, [4, 21, 0], [4, 0, 0]], [null, [4, 10, 0], [7, 13, 0], [9, 14, 0], [12, 14, 0], [14, 13, 0], [15, 10, 0], [15, 0, 0]], [null]], '105': [[null, [3, 21, 0], [4, 20, 0], [5, 21, 0], [4, 22, 0], [3, 21, 0]], [null, [4, 14, 0], [4, 0, 0]], [null]], '106': [[null, [5, 21, 0], [6, 20, 0], [7, 21, 0], [6, 22, 0], [5, 21, 0]], [null, [6, 14, 0], [6, -3, 0], [5, -6, 0], [3, -7, 0], [1, -7, 0]], [null]], '107': [[null, [4, 21, 0], [4, 0, 0]], [null, [14, 14, 0], [4, 4, 0]], [null, [8, 8, 0], [15, 0, 0]], [null]], '108': [[null, [4, 21, 0], [4, 0, 0]], [null]], '109': [[null, [4, 14, 0], [4, 0, 0]], [null, [4, 10, 0], [7, 13, 0], [9, 14, 0], [12, 14, 0], [14, 13, 0], [15, 10, 0], [15, 0, 0]], [null, [15, 10, 0], [18, 13, 0], [20, 14, 0], [23, 14, 0], [25, 13, 0], [26, 10, 0], [26, 0, 0]], [null]], '110': [[null, [4, 14, 0], [4, 0, 0]], [null, [4, 10, 0], [7, 13, 0], [9, 14, 0], [12, 14, 0], [14, 13, 0], [15, 10, 0], [15, 0, 0]], [null]], '111': [[null, [8, 14, 0], [6, 13, 0], [4, 11, 0], [3, 8, 0], [3, 6, 0], [4, 3, 0], [6, 1, 0], [8, 0, 0], [11, 0, 0], [13, 1, 0], [15, 3, 0], [16, 6, 0], [16, 8, 0], [15, 11, 0], [13, 13, 0], [11, 14, 0], [8, 14, 0]], [null]], '112': [[null, [4, 14, 0], [4, -7, 0]], [null, [4, 11, 0], [6, 13, 0], [8, 14, 0], [11, 14, 0], [13, 13, 0], [15, 11, 0], [16, 8, 0], [16, 6, 0], [15, 3, 0], [13, 1, 0], [11, 0, 0], [8, 0, 0], [6, 1, 0], [4, 3, 0]], [null]], '113': [[null, [15, 14, 0], [15, -7, 0]], [null, [15, 11, 0], [13, 13, 0], [11, 14, 0], [8, 14, 0], [6, 13, 0], [4, 11, 0], [3, 8, 0], [3, 6, 0], [4, 3, 0], [6, 1, 0], [8, 0, 0], [11, 0, 0], [13, 1, 0], [15, 3, 0]], [null]], '114': [[null, [4, 14, 0], [4, 0, 0]], [null, [4, 8, 0], [5, 11, 0], [7, 13, 0], [9, 14, 0], [12, 14, 0]], [null]], '115': [[null, [14, 11, 0], [13, 13, 0], [10, 14, 0], [7, 14, 0], [4, 13, 0], [3, 11, 0], [4, 9, 0], [6, 8, 0], [11, 7, 0], [13, 6, 0], [14, 4, 0], [14, 3, 0], [13, 1, 0], [10, 0, 0], [7, 0, 0], [4, 1, 0], [3, 3, 0]], [null]], '116': [[null, [5, 21, 0], [5, 4, 0], [6, 1, 0], [8, 0, 0], [10, 0, 0]], [null, [2, 14, 0], [9, 14, 0]], [null]], '117': [[null, [4, 14, 0], [4, 4, 0], [5, 1, 0], [7, 0, 0], [10, 0, 0], [12, 1, 0], [15, 4, 0]], [null, [15, 14, 0], [15, 0, 0]], [null]], '118': [[null, [2, 14, 0], [8, 0, 0]], [null, [14, 14, 0], [8, 0, 0]], [null]], '119': [[null, [3, 14, 0], [7, 0, 0]], [null, [11, 14, 0], [7, 0, 0]], [null, [11, 14, 0], [15, 0, 0]], [null, [19, 14, 0], [15, 0, 0]], [null]], '120': [[null, [3, 14, 0], [14, 0, 0]], [null, [14, 14, 0], [3, 0, 0]], [null]], '121': [[null, [2, 14, 0], [8, 0, 0]], [null, [14, 14, 0], [8, 0, 0], [6, -4, 0], [4, -6, 0], [2, -7, 0], [1, -7, 0]], [null]], '122': [[null, [14, 14, 0], [3, 0, 0]], [null, [3, 14, 0], [14, 14, 0]], [null, [3, 0, 0], [14, 0, 0]], [null]], '123': [[null, [9, 25, 0], [7, 24, 0], [6, 23, 0], [5, 21, 0], [5, 19, 0], [6, 17, 0], [7, 16, 0], [8, 14, 0], [8, 12, 0], [6, 10, 0]], [null, [7, 24, 0], [6, 22, 0], [6, 20, 0], [7, 18, 0], [8, 17, 0], [9, 15, 0], [9, 13, 0], [8, 11, 0], [4, 9, 0], [8, 7, 0], [9, 5, 0], [9, 3, 0], [8, 1, 0], [7, 0, 0], [6, -2, 0], [6, -4, 0], [7, -6, 0]], [null, [6, 8, 0], [8, 6, 0], [8, 4, 0], [7, 2, 0], [6, 1, 0], [5, -1, 0], [5, -3, 0], [6, -5, 0], [7, -6, 0], [9, -7, 0]], [null]], '124': [[null, [4, 25, 0], [4, -7, 0]], [null]], '125': [[null, [5, 25, 0], [7, 24, 0], [8, 23, 0], [9, 21, 0], [9, 19, 0], [8, 17, 0], [7, 16, 0], [6, 14, 0], [6, 12, 0], [8, 10, 0]], [null, [7, 24, 0], [8, 22, 0], [8, 20, 0], [7, 18, 0], [6, 17, 0], [5, 15, 0], [5, 13, 0], [6, 11, 0], [10, 9, 0], [6, 7, 0], [5, 5, 0], [5, 3, 0], [6, 1, 0], [7, 0, 0], [8, -2, 0], [8, -4, 0], [7, -6, 0]], [null, [8, 8, 0], [6, 6, 0], [6, 4, 0], [7, 2, 0], [8, 1, 0], [9, -1, 0], [9, -3, 0], [8, -5, 0], [7, -6, 0], [5, -7, 0]], [null]], '126': [[null, [3, 6, 0], [3, 8, 0], [4, 11, 0], [6, 12, 0], [8, 12, 0], [10, 11, 0], [14, 8, 0], [16, 7, 0], [18, 7, 0], [20, 8, 0], [21, 10, 0]], [null, [3, 8, 0], [4, 10, 0], [6, 11, 0], [8, 11, 0], [10, 10, 0], [14, 7, 0], [16, 6, 0], [18, 6, 0], [20, 7, 0], [21, 10, 0], [21, 12, 0]], [null]] };

const hersheyWidth = { '32': 16, '33': 10, '34': 16, '35': 21, '36': 20, '37': 24, '38': 26, '39': 10, '40': 14, '41': 14, '42': 16, '43': 26, '44': 10, '45': 26, '46': 10, '47': 22, '48': 20, '49': 20, '50': 20, '51': 20, '52': 20, '53': 20, '54': 20, '55': 20, '56': 20, '57': 20, '58': 10, '59': 10, '60': 24, '61': 26, '62': 24, '63': 18, '64': 27, '65': 18, '66': 21, '67': 21, '68': 21, '69': 19, '70': 18, '71': 21, '72': 22, '73': 8, '74': 16, '75': 21, '76': 17, '77': 24, '78': 22, '79': 22, '80': 21, '81': 22, '82': 21, '83': 20, '84': 16, '85': 22, '86': 18, '87': 24, '88': 20, '89': 18, '90': 20, '91': 14, '92': 14, '93': 14, '94': 16, '95': 16, '96': 10, '97': 19, '98': 19, '99': 18, '100': 19, '101': 18, '102': 12, '103': 19, '104': 19, '105': 8, '106': 10, '107': 17, '108': 8, '109': 30, '110': 19, '111': 19, '112': 19, '113': 19, '114': 13, '115': 17, '116': 12, '117': 19, '118': 16, '119': 22, '120': 17, '121': 16, '122': 17, '123': 14, '124': 8, '125': 14, '126': 24 };

const toPaths = (letters) => {
  let xOffset = 0;
  const mergedPaths = [];
  for (const letter of letters) {
    const code = letter.charCodeAt(0);
    const paths = hersheyPaths[code] || [];
    mergedPaths.push(...translate$1([xOffset, 0, 0], paths));
    xOffset += hersheyWidth[code] || 0;
  }
  return Shape.fromGeometry({ paths: mergedPaths }).scale(1 / 28);
};

const ofSize = (size) => (text) => toPaths(text).scale(size);

const Hershey = (size) => ofSize(size);
Hershey.ofSize = ofSize;
Hershey.toPaths = toPaths;

const assertEmpty = (value) => {
  if (value.length === undefined) {
    throw Error(`Has no length: ${value}`);
  }
  if (value.length !== 0) {
    throw Error(`Is not empty: ${value}`);
  }
  return true;
};

const assertShape = (value) => {
  if (value instanceof Shape) {
    return true;
  }
  throw Error(`Is not Shape: ${value}`);
};

const assertStrings = (value) => {
  if (value instanceof Array && value.every(item => typeof item === 'string')) {
    return true;
  }
  throw Error(`Is not a list of strings: ${value}`);
};

const assertPoint = (value) => {
  if (value.length === undefined) {
    throw Error(`Has no length: ${value}`);
  }
  const [x, y, z = 0] = value;
  assertNumber(x);
  assertNumber(y);
  assertNumber(z);
  return true;
};

const assertPoints = (value) => {
  if (value.length === undefined) {
    throw Error(`Has no length: ${value}`);
  }
  value.forEach(assertPoint);
  return true;
};

const assertNumber = (...values) => {
  for (const value of values) {
    if (typeof value !== 'number') {
      throw Error(`Not a number: ${value}`);
    }
  }
  return true;
};

const assertNumberTriple = (value) => {
  if (value.length === undefined) {
    throw Error(`Has no length: ${value}`);
  }
  if (value.length !== 3) {
    throw Error(`Is not a triple: ${value}`);
  }
  for (const v of value) {
    assertNumber(v);
  }
  return true;
};

const fromPoints = (points) => Shape.fromOpenPath(points.map(([x = 0, y = 0, z = 0]) => [x, y, z]));

/**
 *
 * # Path
 *
 * ::: illustration { "view": { "position": [0, 0, 5] } }
 * ```
 * Path([0, 1],
 *      [1, 1],
 *      [1, 0],
 *      [0.2, 0.2])
 * ```
 * :::
 *
 **/

const Path = dispatch(
  'Path',
  // Path([0, 0], [3, 0], [3, 3])
  (...points) => {
    assertPoints(points);
    return () => fromPoints(points);
  });

Path.fromPoints = fromPoints;

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
  shapes = shapes.filter(shape => shape !== undefined);
  switch (shapes.length) {
    case 0: {
      return Shape.fromGeometry({ assembly: [] });
    }
    case 1: {
      return shapes[0];
    }
    default: {
      return fromGeometry(assemble$1(...shapes.map(toGeometry)));
    }
  }
};

/**
 *
 * # Plan
 *
 * Produces a plan based on marks that transform as geometry.
 *
 **/

const Text = Hershey(1);

const Plan = ({ plan, marks = [], planes = [], tags = [], visualization }, context) => {
  let geometry = visualization === undefined ? { assembly: [] } : visualization.toKeptGeometry();
  const shape = Shape.fromGeometry({ plan, marks, planes, tags, visualization: geometry }, context);
  return shape;
};

// Radius

const Radius = (radius = 1, center = [0, 0, 0]) =>
  Plan({
    plan: { radius },
    marks: [center],
    visualization:
      Circle.ofRadius(radius)
          .outline()
          .add(Path([0, 0, 0], [0, radius, 0]))
          .add(Text(`R${radius}`).moveY(radius / 2))
          .color('red')
  });
Plan.Radius = Radius;

const Apothem = (apothem = 1, sides = 32, center = [0, 0, 0]) => {
  const radius = Polygon.toRadiusFromApothem(apothem, sides);
  return Plan({
    plan: { apothem },
    marks: [center],
    visualization:
      Circle.ofRadius(radius)
          .outline()
          .add(Path([0, 0, 0], [0, radius, 0]))
          .add(Text(`A${apothem}`).moveY(radius / 2))
          .color('red')
  });
};
Plan.Apothem = Apothem;

// Labels

const Label = (label, mark = [0, 0, 0]) => Plan({ plan: { label }, marks: [mark] });

Plan.Label = Label;

const labels = (geometry) => {
  const labels = {};
  for (const { plan, marks } of getPlans(geometry)) {
    if (plan.label) {
      labels[plan.label] = marks[0];
    }
  }
  return labels;
};

const labelsMethod = function () { return labels(this.toKeptGeometry()); };
Shape.prototype.labels = labelsMethod;

const withLabelMethod = function (...args) { return assemble(this, Plan.Label(...args)); };
Shape.prototype.withLabel = withLabelMethod;

/**
 *
 * # Connector
 *
 * Returns a connector plan.
 * See connect().
 *
 * ::: illustration { "view": { "position": [60, -60, 60], "target": [0, 0, 0] } }
 * ```
 * Cube(10).with(Connector('top').move(5))
 * ```
 * :::
 * ::: illustration { "view": { "position": [60, -60, 60], "target": [0, 0, 0] } }
 * ```
 * Cube(10).Connector('top').moveZ(5).connect(Sphere(5).Connector('bottom').flip().moveZ(-5))
 * ```
 * :::
 **/

const shapeToConnect = Symbol('shapeToConnect');

// A connector expresses a joint-of-connection extending from origin along axis to end.
// The orientation expresses the direction of facing orthogonal to that axis.
// The joint may have a zero length (origin and end are equal), but axis must not equal origin.
// Note: axis must be further than end from origin.

const Connector = (connector, { plane = [0, 0, 1, 0], center = [0, 0, 0], right = [1, 0, 0], start = [0, 0, 0], end = [0, 0, 0], shape, visualization } = {}) => {
  const plan = Plan(// Geometry
    {
      plan: { connector },
      marks: [center, right, start, end],
      planes: [plane],
      tags: [`connector/${connector}`],
      visualization
    },
    // Context
    {
      [shapeToConnect]: shape
    });
  return plan;
};

Plan.Connector = Connector;

const ConnectorMethod = function (connector, options) { return Connector(connector, { ...options, [shapeToConnect]: this }); };
Shape.prototype.Connector = ConnectorMethod;

// Associates an existing connector with a shape.
const toConnectorMethod = function (connector, options) { return Shape.fromGeometry(connector.toKeptGeometry(), { ...options, [shapeToConnect]: this }); };
Shape.prototype.toConnector = toConnectorMethod;

/**
 *
 * # connectors
 *
 * Returns the set of connectors in an assembly by tag.
 * See connect().
 *
 * ::: illustration { "view": { "position": [60, -60, 60], "target": [0, 0, 0] } }
 * ```
 * Cube(10).with(Connector('top').moveZ(5))
 *         .connectors()['top']
 *         .connect(Prism(10, 10).with(Connector('bottom').flip().moveZ(-5))
 *                               .connectors()['bottom']);
 * ```
 * :::
 **/

const connectors = (shape) => {
  const connectors = [];
  for (const entry of getPlans(shape.toKeptGeometry())) {
    if (entry.plan.connector && (entry.tags === undefined || !entry.tags.includes('compose/non-positive'))) {
      connectors.push(Shape.fromGeometry(entry, { [shapeToConnect]: shape }));
    }
  }
  return connectors;
};

const connectorsMethod = function () { return connectors(this); };
Shape.prototype.connectors = connectorsMethod;

/**
 *
 * # connector
 *
 * Returns a connector from an assembly.
 * See connect().
 *
 * ::: illustration { "view": { "position": [60, -60, 60], "target": [0, 0, 0] } }
 * ```
 * Prism(10, 10).with(Connector('top').moveZ(5))
 *              .connector('top')
 *              .connect(Cube(10).with(Connector('bottom').flip().moveZ(-5))
 *                               .connector('bottom'));
 * ```
 * :::
 **/

const connector = (shape, id) => {
  for (const connector of connectors(shape)) {
    if (connector.toGeometry().plan.connector === id) {
      return connector;
    }
  }
};

const connectorMethod = function (id) { return connector(this, id); };
Shape.prototype.connector = connectorMethod;

const connection = (shape, id) => {
  const shapeGeometry = shape.toKeptGeometry();
  const connections = getConnections(shapeGeometry);
  for (const geometry of connections) {
    if (geometry.connection === id) {
      return Shape.fromGeometry(geometry);
    }
  }
};

const connectionMethod = function (id) { return connection(this, id); };
Shape.prototype.connection = connectionMethod;

const faces = (shape, op = (_ => _)) => {
  let nextFaceId = 0;
  let nextPointId = 0;
  const pointIds = new Map();
  const ensurePointId = (point) => {
    const pointId = pointIds.get(point);
    if (pointId === undefined) {
      pointIds.set(point, nextPointId);
      return nextPointId++;
    } else {
      return pointId;
    }
  };
  const faces = [];
  for (const { solid } of getSolids(shape.toKeptGeometry())) {
    const alignedSolid = alignVertices(solid);
    for (const surface of alignedSolid) {
      for (const face of surface) {
        const plane = toPlane(face);
        const connectors = [];
        const tags = [];
        tags.push(`face/id:${nextFaceId++}`);
        for (const [lastPoint, nextPoint] of getEdges(face)) {
          const edgeId = `face/edge:${ensurePointId(nextPoint)}:${ensurePointId(lastPoint)}`;
          tags.push(edgeId);
          const center = scale$1(0.5, add(nextPoint, lastPoint));
          const right = add(plane, center);
          const up = add(plane, nextPoint);
          connectors.push(Connector(edgeId,
                                    {
                                      plane: toPlane([up, nextPoint, lastPoint]),
                                      center,
                                      right,
                                      start: lastPoint,
                                      end: nextPoint
                                    }));
        }
        faces.push(Shape.fromGeometry(rewriteTags(tags, [], Polygon.ofPoints(face).op(op).toGeometry()))
            .with(...connectors));
      }
    }
  }
  return faces;
};

const facesMethod = function (...args) { return faces(this, ...args); };
Shape.prototype.faces = facesMethod;

const faceId = (shape) =>
  [...allTags(shape.toGeometry())]
      .filter(tag => tag.startsWith('face/id:'))
      .map(tag => tag.substring(8));

const faceIdMethod = function () { return faceId(this); };
Shape.prototype.faceId = faceIdMethod;

const faceEdges = (shape) =>
  [...allTags(shape.toGeometry())]
      .filter(tag => tag.startsWith('face/edge:'))
      .map(tag => tag.substring(10));

const faceEdgesMethod = function () { return faceEdges(this); };
Shape.prototype.faceEdges = faceEdgesMethod;

const items = (shape, xform = (_ => _)) => {
  const items = [];
  for (const solid of getItems(shape.toKeptGeometry())) {
    items.push(xform(Shape.fromGeometry(solid)));
  }
  return items;
};

const itemsMethod = function (...args) { return items(this, ...args); };
Shape.prototype.items = itemsMethod;

/**
 *
 * # Connect
 *
 * Connects two connectors.
 *
 * ::: illustration { "view": { "position": [60, -60, 0], "target": [0, 0, 0] } }
 * ```
 * Cube(10).Connector('top').moveZ(5)
 *         .connect(Sphere(10).Connector('bottom').flip().moveZ(-9))
 * ```
 * :::
 **/

const dropConnector = (shape, connector) =>
  Shape.fromGeometry(drop$1([`connector/${connector}`], shape.toGeometry()));

const CENTER = 0;
const RIGHT = 1;

const measureAngle = ([aX, aY], [bX, bY]) => {
  const a2 = Math.atan2(aX, aY);
  const a1 = Math.atan2(bX, bY);
  const sign = a1 > a2 ? 1 : -1;
  const angle = a1 - a2;
  const K = -sign * Math.PI * 2;
  const absoluteAngle = (Math.abs(K + angle) < Math.abs(angle)) ? K + angle : angle;
  return absoluteAngle * 180 / Math.PI;
};

// Connect two shapes at the specified connector.
const connect = (aConnectorShape, bConnectorShape, { doConnect = true } = {}) => {
  const aConnector = toTransformedGeometry(aConnectorShape.toGeometry());
  const aShape = aConnectorShape.getContext(shapeToConnect);
  const [aTo] = toXYPlaneTransforms(aConnector.planes[0], subtract(aConnector.marks[RIGHT], aConnector.marks[CENTER]));

  const bConnector = toTransformedGeometry(bConnectorShape.flip().toGeometry());
  const bShape = bConnectorShape.getContext(shapeToConnect);
  const [bTo, bFrom] = toXYPlaneTransforms(bConnector.planes[0], subtract(bConnector.marks[RIGHT], bConnector.marks[CENTER]));

  // Flatten a.
  const aFlatShape = aShape.transform(aTo);
  const aFlatConnector = aConnectorShape.transform(aTo);
  const aMarks = aFlatConnector.toKeptGeometry().marks;
  const aFlatOriginShape = aFlatShape.move(...negate(aMarks[CENTER]));
  const aFlatOriginConnector = aFlatConnector.move(...negate(aMarks[CENTER]));

  // Flatten b's connector.
  const bFlatConnector = toTransformedGeometry(bConnectorShape.transform(bTo).toGeometry());
  const bMarks = bFlatConnector.marks;

  // Rotate into alignment.
  const aOrientation = subtract(aMarks[RIGHT], aMarks[CENTER]);
  const bOrientation = subtract(bMarks[RIGHT], bMarks[CENTER]);
  const angle = measureAngle(aOrientation, bOrientation);
  const aFlatOriginRotatedShape = aFlatOriginShape.rotateZ(-angle);
  const aFlatOriginRotatedConnector = aFlatOriginConnector.rotateZ(-angle);

  // Move a to the flat position of b.
  const aFlatBShape = aFlatOriginRotatedShape.move(...bMarks[CENTER]);
  const aFlatBConnector = aFlatOriginRotatedConnector.move(...bMarks[CENTER]);
  // Move a to the oriented position of b.
  const aMovedShape = aFlatBShape.transform(bFrom);
  const aMovedConnector = aFlatBConnector.transform(bFrom);

  if (doConnect) {
    return Shape.fromGeometry(
      {
        connection: `${aConnector.plan.connector}-${bConnector.plan.connector}`,
        connectors: [aMovedConnector.toKeptGeometry(), bConnector],
        geometries: [dropConnector(aMovedShape, aConnector.plan.connector).toGeometry(),
                     dropConnector(bShape, bConnector.plan.connector).toGeometry()]
      });
  } else {
    return aMoved;
  }
};

const join = (a, aJoin, bJoin, b) => {
  const aConnection = connect(a, aJoin).toGeometry();
  const bConnection = connect(b, bJoin).toGeometry();
  const result = Shape.fromGeometry(
    {
      connection: `${aConnection.connection}:${bConnection.connection}`,
      connectors: [...aConnection.connectors, ...bConnection.connectors],
      geometries: [...aConnection.geometries, ...bConnection.geometries],
      tags: ['join']
    });
  return result;
};

const rejoin = (shape, connectionShape, aJoin, bJoin) => {
  const connection = connectionShape.toKeptGeometry();
  const { connectors, geometries } = connection;
  const rejoined = join(Shape.fromGeometry(geometries[0]).toConnector(Shape.fromGeometry(connectors[0])),
                        aJoin,
                        bJoin,
                        Shape.fromGeometry(geometries[2]).toConnector(Shape.fromGeometry(connectors[2])));
  return Shape.fromGeometry(splice(shape.toKeptGeometry(), connection, rejoined.toGeometry()));
};

const toMethod = function (...args) { return connect(this, ...args); };
Shape.prototype.to = toMethod;

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

const log = (text) => log$1({ op: 'text', text: String(text) });

/**
 *
 * # Unfold
 *
 **/

// FIX: Does not handle convex solids.
const unfold = (shape) => {
  const faces = shape.faces(f => f);
  log(`Face count is ${faces.length}`);
  const faceByEdge = new Map();

  for (const face of faces) {
    for (const edge of face.faceEdges()) {
      faceByEdge.set(edge, face);
    }
  }

  const reverseEdge = (edge) => {
    const [a, b] = edge.split(':');
    const reversedEdge = `${b}:${a}`;
    return reversedEdge;
  };

  const seen = new Set();
  const queue = [];

  const enqueueNeighbors = (face) => {
    for (const edge of face.faceEdges()) {
      const redge = reverseEdge(edge);
      const neighbor = faceByEdge.get(redge);
      if (neighbor === undefined || seen.has(neighbor)) continue;
      seen.add(neighbor);
      queue.push({
        face: neighbor,
        to: `face/edge:${edge}`,
        from: `face/edge:${redge}`
      });
    }
  };

  let root = faces[0];
  enqueueNeighbors(root);

  while (queue.length > 0) {
    const { face, from, to } = queue.shift();
    seen.add(face);
    const fromConnector = face.connector(from);
    const toConnector = root.connector(to);
    if (fromConnector === undefined) {
      log('bad from');
      continue;
    }
    if (toConnector === undefined) {
      log('bad to');
      continue;
    }
    root = fromConnector.to(toConnector);
    if (root === undefined) break;
    enqueueNeighbors(face);
  }

  return root;
};

const method$3 = function (...args) { return unfold(this); };
Shape.prototype.unfold = method$3;

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

const method$4 = function (...shapes) { return assemble(this, ...shapes); };
Shape.prototype.with = method$4;

/**
 *
 * # Armature
 *
 * Armature builds a set of points based on constraints.
 *
 * ::: illustration { "view": { "position": [40, -40, 40], "target": [0, 0, 0] } }
 * ```
 * const { angle, compute, distance, pinned } = Armature();
 * pinned('A', [0, 0, 0]);
 * angle('A', 'B', 'C', 90);
 * distance('B', 'A', 20);
 * distance('B', 'C', 10);
 * const { A, B, C } = compute();
 * Polygon(A, B, C).outline().center();
 * ```
 * :::
 *
 **/

const Armature = () => {
  const constraints = verlet();
  addInertia(constraints);
  const angle = createAngleConstraint(constraints);
  const distance = createDistanceConstraint(constraints);
  const pinned = createPinnedConstraint(constraints);
  let solved = false;

  const isSolved = () => solved;

  const compute = (limit = 0) => {
    solved = solve(constraints, limit);
    return positions(constraints);
  };

  return {
    angle,
    compute,
    distance,
    isSolved,
    pinned
  };
};

const buildPrism = (radius = 1, height = 1, sides = 32) =>
  Shape.fromGeometry(buildRegularPrism(sides)).scale([radius, radius, height]);

/**
 *
 * # Prism
 *
 * Generates prisms.
 *
 * ::: illustration { "view": { "position": [10, 10, 10] } }
 * ```
 * Prism()
 * ```
 * :::
 *
 **/

const ofRadius$2 = (radius = 1, height = 1, { sides = 3 } = {}) => buildPrism(radius, height, sides);
const ofDiameter$2 = (diameter = 1, ...args) => ofRadius$2(diameter / 2, ...args);

const toPathFromSurface = (shape) => {
  for (const { surface, z0Surface } of getAnySurfaces(shape.toKeptGeometry())) {
    const anySurface = surface || z0Surface;
    for (const path of anySurface) {
      return path;
    }
  }
  return [];
};

const ofFunction = (op, { resolution, cap = true, context } = {}) =>
  Shape.fromGeometry(buildFromFunction(op, resolution, cap, context));

const ofSlices = (op, { slices = 2, cap = true } = {}) =>
  Shape.fromGeometry(buildFromSlices(t => toPathFromSurface(op(t)), slices, cap));

const Prism = (...args) => ofRadius$2(...args);

Prism.ofRadius = ofRadius$2;
Prism.ofDiameter = ofDiameter$2;
Prism.ofFunction = ofFunction;
Prism.ofSlices = ofSlices;

/**
 *
 * # Ease
 *
 * Produces a function for composing easing functions.
 * ```
 * ease(0.00, 0.25, t => sin(t * 25))(ease(0.25, 1.00, t => 5)())
 * ```
 *
 **/

const ease = (start = 0.00, end = 1.00, op = t => 1) => {
  const compose = (next = t => 1) => {
    const fn = t => {
      if (t >= start && t <= end) {
        return op((t - start) / (end - start));
      } else {
        return next(t);
      }
    };
    return fn;
  };
  return compose;
};

const linear = (start, end) => t => start + t * (end - start);
ease.linear = linear;

const ofRadius$3 = (radius = 1, height = 1, { sides = 32 } = {}) => {
  const fn = linear(0, radius);
  return Prism.ofSlices(t => Circle(fn(t) * radius, { sides }).moveZ(t * height));
};

const ofDiameter$3 = (diameter, ...args) => ofRadius$3(diameter / 2, ...args);
const ofApothem$2 = (apothem, ...args) => ofRadius$3(toRadiusFromApothem$1(apothem), ...args);

const Cone = (...args) => ofRadius$3(...args);

Cone.ofRadius = ofRadius$3;
Cone.ofDiameter = ofDiameter$3;
Cone.ofApothem = ofApothem$2;

/**
 *
 * # Cube (cuboid)
 *
 * Generates cuboids.
 *
 * ::: illustration { "view": { "position": [10, 10, 10] } }
 * ```
 * Cube()
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * Cube(10)
 * ```
 * :::
 * ::: illustration { "view": { "position": [80, 80, 80] } }
 * ```
 * Cube(10, 20, 30)
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * Cube.ofRadius(8)
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * Cube.ofDiameter(16)
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * Cube.ofApothem(8)
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * Cube.fromCorners([0, 0, 0], [10, 10, 10])
 * ```
 * :::
 *
 **/

// Geometry construction.

const edgeScale = regularPolygonEdgeLengthToRadius(1, 4);

const unitCube = () => Shape.fromGeometry(buildRegularPrism(4))
    .rotateZ(45)
    .scale([edgeScale, edgeScale, 1]);

// Cube Interfaces.

const ofSize$1 = (width = 1, length, height) =>
  unitCube().scale([width,
                    length === undefined ? width : length,
                    height === undefined ? width : height]);

const ofRadius$4 = (radius) => Shape.fromGeometry(buildRegularPrism(4))
    .rotateZ(45)
    .scale([radius, radius, radius / edgeScale]);

const ofApothem$3 = (apothem) => ofRadius$4(toRadiusFromApothem$1(apothem, 4));

const ofDiameter$4 = (diameter) => ofRadius$4(diameter / 2);

const fromCorners = (corner1, corner2) => {
  const [c1x, c1y, c1z] = corner1;
  const [c2x, c2y, c2z] = corner2;
  const length = c2x - c1x;
  const width = c2y - c1y;
  const height = c2z - c1z;
  const center = [(c1x + c2x) / 2, (c1y + c2y) / 2, (c1z + c2z) / 2];
  return unitCube().scale([length, width, height]).move(...center);
};

const Cube = (...args) => ofSize$1(...args);

Cube.ofSize = ofSize$1;
Cube.ofRadius = ofRadius$4;
Cube.ofApothem = ofApothem$3;
Cube.ofDiameter = ofDiameter$4;
Cube.fromCorners = fromCorners;

// Normalize (1, 2, 3) and ([1, 2, 3]).
const normalizeVector = (...params) => {
  if (params[0] instanceof Array) {
    const [x = 0, y = 0, z = 0] = params[0];
    return [x, y, z];
  } else {
    const [x = 0, y = 0, z = 0] = params;
    return [x, y, z];
  }
};

/**
 *
 * # Cursor
 *
 * A cursor is moved by transformations rather than the universe around it.
 *
 * ::: illustration { "view": { "position": [0, -1, 40] } }
 * ```
 * Cursor.fromOrigin()
 *       .forward(5)
 *       .right(45)
 *       .forward(5)
 *       .interior()
 * ```
 * :::
 * ::: illustration { "view": { "position": [0, -1, 40] } }
 * ```
 * Cursor.fromOrigin()
 *       .forward(5)
 *       .left(135)
 *       .forward(5)
 *       .outline()
 * ```
 * :::
 *
 **/

class Cursor {
  constructor ({ matrix = identity(), path = [null, [0, 0, 0]] } = {}) {
    this.matrix = matrix;
    this.path = path.slice();
  }

  close () {
    return new Cursor({ matrix: this.matrix, path: close(this.path) });
  }

  interior () {
    return this.close().toShape().interior();
  }

  move (...params) {
    return this.translate(...params);
  }

  outline () {
    return this.close().toShape();
  }

  rotateZ (angle) {
    return this.transform(fromZRotation(angle * Math.PI * 2 / 360));
  }

  toPoint () {
    const last = this.path[this.path.length - 1];
    if (last === null) {
      return [0, 0, 0];
    } else {
      return last;
    }
  }

  toPath () {
    return this.path;
  }

  toShape () {
    return Shape.fromPath(this.toPath());
  }

  transform (matrix) {
    return new Cursor({ matrix: multiply(matrix, this.matrix), path: this.path });
  }

  translate (...params) {
    const [x, y, z] = normalizeVector(params);
    const path = this.path.slice();
    path.push(add(this.toPoint(), transform$1(this.matrix, [x, y, z])));
    return new Cursor({ matrix: this.matrix, path });
  }

  turn (angle) {
    return this.rotateZ(angle);
  }

  left (angle) {
    return this.turn(angle);
  }

  right (angle) {
    return this.turn(-angle);
  }

  forward (distance) {
    return this.move(distance);
  }
}

const fromOrigin = () => new Cursor();
Cursor.fromOrigin = fromOrigin;

const buildPrism$1 = (radius = 1, height = 1, sides = 32) =>
  Shape.fromGeometry(buildRegularPrism(sides)).scale([radius, radius, height]);

/**
 *
 * # Cylinder
 *
 * Generates cylinders.
 *
 * ::: illustration { "view": { "position": [10, 10, 10] } }
 * ```
 * Cylinder()
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * Cylinder(10, 5)
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * Cylinder.ofRadius(6, 10, { sides: 8 })
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * Cylinder.ofApothem(6, 10, { sides: 8 })
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * Cylinder.ofDiameter(6, 8, { sides: 16 })
 * ```
 * :::
 *
 **/

const ofRadius$5 = (radius = 1, height = 1, { sides = 32 } = {}) => buildPrism$1(radius, height, sides);

const ofApothem$4 = (apothem = 1, height = 1, { sides = 32 } = {}) => ofRadius$5(toRadiusFromApothem$1(apothem, sides), { sides });
const ofDiameter$5 = (diameter = 1, ...args) => ofRadius$5(diameter / 2, ...args);

const toPathFromShape = (shape) => {
  for (const { paths } of getPaths(shape.toKeptGeometry())) {
    for (const path of paths) {
      return path;
    }
  }
  return [];
};

const ofFunction$1 = (op, { resolution, cap = true, context } = {}) =>
  Shape.fromGeometry(buildFromFunction(op, resolution, cap, context));

const ofSlices$1 = (op, { slices = 2, cap = true } = {}) =>
  Shape.fromGeometry(buildFromSlices(slice => toPathFromShape(op(slice)), slices, cap));

const Cylinder = (...args) => ofRadius$5(...args);

Cylinder.ofRadius = ofRadius$5;
Cylinder.ofApothem = ofApothem$4;
Cylinder.ofDiameter = ofDiameter$5;
Cylinder.ofFunction = ofFunction$1;
Cylinder.ofSlices = ofSlices$1;

// TODO: (await readFont(...))({ emSize: 16 })("CA");

/**
 *
 * # Read Font
 *
 * readFont reads in a font and produces a function that renders text as a surface with that font.
 *
 * The rendering function takes an option defaulting to { emSize = 10 } and a string of text.
 * This means that one M is 10 mm in height.
 *
 * ::: illustration { "view": { "position": [-50, -50, 50] } }
 * ```
 * const greatVibes = await readFont('font/great-vibes/GreatVibes-Regular.ttf');
 * greatVibes(20)("M").extrude(5).rotateX(90).above().center()
 * ```
 * :::
 * ::: illustration { "view": { "position": [0, -1, 100] } }
 * ```
 * const greatVibes = await readFont('font/great-vibes/GreatVibes-Regular.ttf');
 * greatVibes(10)("M").center()
 * ```
 * :::
 * ::: illustration { "view": { "position": [0, -1, 100] } }
 * ```
 * const greatVibes = await readFont('font/great-vibes/GreatVibes-Regular.ttf');
 * greatVibes(20)("M").center()
 * ```
 * :::
 * ::: illustration { "view": { "position": [0, -1, 50] } }
 * ```
 * const greatVibes = await readFont('font/great-vibes/GreatVibes-Regular.ttf');
 * greatVibes(16)("CA").center()
 * ```
 * :::
 *
 **/

const toEmSizeFromMm = (mm) => mm * 1.5;

const readFont = async (path, { flip = false } = {}) => {
  let data = await readFile({ as: 'bytes' }, `source/${path}`);
  if (data === undefined) {
    data = await readFile({ as: 'bytes', sources: getSources(`cache/${path}`) }, `cache/${path}`);
  }
  const font = toFont({ path }, data);
  const xform = flip ? shape => shape.flip() : _ => _;
  const fontFactory = (size = 1) => (text) => Shape.fromGeometry(font({ emSize: toEmSizeFromMm(size) }, text)).op(xform);
  return fontFactory;
};

const ofSize$2 = (size) => Hershey.ofSize(size);

const Font = (size) => ofSize$2(size);

Font.Hershey = Hershey;
Font.ofSize = ofSize$2;
Font.read = async (path, { flip = false } = {}) => readFont(path, { flip });

/**
 *
 * # Arc Cosine
 *
 * Gives the arc cosine converted to degrees.
 * ```
 * acos(a) => Math.acos(a) / (Math.PI * 2) * 360;
 *
 * acos(0) = 90
 * acos(0.5) = 60
 * acos(1) = 0
 * ```
 *
 **/

const acos = (a) => Math.acos(a) / (Math.PI * 2) * 360;

/**
 *
 * # Cosine
 *
 * Gives the cosine in degrees.
 * ```
 * cos(a) => Math.cos(a / 360 * Math.PI * 2);
 *
 * cos(0) = 1
 * cos(45) = 0.707
 * cos(90) = 0
 * ```
 *
 **/

const cos = (a) => Math.cos(a / 360 * Math.PI * 2);

/**
 *
 * # Max
 *
 * Produces the maximum of a series of numbers.
 *
 * ```
 * max(1, 2, 3, 4) == 4
 * ```
 *
 **/

const max = Math.max;

/**
 *
 * # Sine
 *
 * Gives the sine in degrees.
 * ```
 * sin(a) => Math.sin(a / 360 * Math.PI * 2);
 *
 * sin(0) = 0
 * sin(45) = 0.707
 * sin(90) = 1
 * ```
 *
 **/

const sin = (a) => Math.sin(a / 360 * Math.PI * 2);

/**
 *
 * # Square Root
 *
 * Gives the the square root of a number.
 * ```
 * sqrt(a) => Math.sqrt(a);
 *
 * sqrt(0) = 0
 * sqrt(4) = 2
 * sqrt(16) = 4
 * ```
 *
 **/

const sqrt = Math.sqrt;

// Probably derived from https://github.com/sadr0b0t/pd-gears/blob/master/pd-gears.scad
// Public Domain Parametric Involute Spur Gear (and involute helical gear and involute rack)
// version 1.1 by Leemon Baird, 2011, Leemon@Leemon.com

// convert polar to cartesian coordinates
const polar = (r, theta) => [r * sin(theta), r * cos(theta)];

// point at radius d on the involute curve
const q6 = (b, s, t, d) => polar(d, s * (iang(b, d) + t));

// radius a fraction f up the curved side of the tooth
const q7 = (f, r, b, r2, t, s) => q6(b, s, t, (1 - f) * max(b, r) + f * r2);

// unwind a string this many degrees to go from radius r1 to radius r2
const iang = (r1, r2) => sqrt((r2 / r1) * (r2 / r1) - 1) / Math.PI * 180 - acos(r1 / r2);

const buildTooth = ({ r, b, c, k, numberOfTeeth }) =>
  Shape.fromOpenPath([polar(r, r < b ? -k : 180 / numberOfTeeth),
                      q7(0 / 5, r, b, c, k, -1),
                      q7(1 / 5, r, b, c, k, -1),
                      q7(2 / 5, r, b, c, k, -1),
                      q7(3 / 5, r, b, c, k, -1),
                      q7(4 / 5, r, b, c, k, -1),
                      q7(5 / 5, r, b, c, k, -1),
                      q7(5 / 5, r, b, c, k, 1),
                      q7(4 / 5, r, b, c, k, 1),
                      q7(3 / 5, r, b, c, k, 1),
                      q7(2 / 5, r, b, c, k, 1),
                      q7(1 / 5, r, b, c, k, 1),
                      q7(0 / 5, r, b, c, k, 1),
                      polar(r, r < b ? k : -180 / numberOfTeeth),
                      polar(r, -181 / numberOfTeeth)]);

const profile =
    ({
      mmPerTooth = Math.PI,
      numberOfTeeth = 16,
      teethToHide = 0,
      pressureAngle = 20,
      clearance = 0,
      backlash = 0
    } = {}) => {
      const pi = Math.PI;
      const p = mmPerTooth * numberOfTeeth / pi / 2; // radius of pitch circle
      const c = p + mmPerTooth / pi - clearance; // radius of outer circle
      const b = p * cos(pressureAngle); // radius of base circle
      const r = p - (c - p) - clearance; // radius of the root circle
      const t = mmPerTooth / 2 - backlash / 2; // tooth thickness at pitch circle
      const k = -iang(b, p) - t / 2 / p / pi * 180; // angle to where involute meets base circle on each side of tooth
      const tooth = buildTooth({ r, b, c, k, numberOfTeeth });
      let profile = Shape.fromOpenPath([]);
      for (let i = 0; i < numberOfTeeth - teethToHide; i++) {
        profile = profile.concat(tooth.rotateZ(i * 360 / numberOfTeeth));
      }
      return profile.close();
    };

const Gear = {
  profile
};

/**
 *
 * # Hexagon
 *
 * ::: illustration { "view": { "position": [0, 0, 5] } }
 * ```
 * Hexagon()
 * ```
 * :::
 * ::: illustration
 * ```
 * Hexagon(20)
 * ```
 * :::
 **/

const ofEdge$2 = (edge) => Polygon.ofEdge(edge, 6);
const ofApothem$5 = (apothem) => Polygon.ofApothem(apothem, 6);
const ofRadius$6 = (radius) => Polygon.ofRadius(radius, 6);
const ofDiameter$6 = (diameter) => Polygon.ofDiameter(diameter, 6);

const Hexagon = (...args) => ofRadius$6(...args);

Hexagon.ofRadius = ofRadius$6;
Hexagon.ofEdge = ofEdge$2;
Hexagon.ofApothem = ofApothem$5;
Hexagon.ofRadius = ofRadius$6;
Hexagon.ofDiameter = ofDiameter$6;

/**
 *
 * # Icosahedron
 *
 * Generates tetrahedrons.
 *
 * ::: illustration { "view": { "position": [8, 8, 8] } }
 * ```
 * Icosahedron()
 * ```
 * :::
 * ::: illustration { "view": { "position": [80, 80, 80] } }
 * ```
 * Icosahedron(10)
 * ```
 * :::
 * ::: illustration { "view": { "position": [60, 60, 60] } }
 * ```
 * Icosahedron({ radius: 8 })
 * ```
 * :::
 * ::: illustration { "view": { "position": [60, 60, 60] } }
 * ```
 * Icosahedron({ diameter: 16 })
 * ```
 * :::
 *
 **/

const unitIcosahedron = () => Shape.fromPolygonsToSolid(buildRegularIcosahedron({}));

const fromValue = (value) => unitIcosahedron().scale(value);

const fromRadius = ({ radius }) => unitIcosahedron().scale(radius);

const fromDiameter = ({ diameter }) => unitIcosahedron().scale(diameter / 2);

const Icosahedron = dispatch(
  'Icosahedron',
  // Icosahedron()
  (...rest) => {
    assertEmpty(rest);
    return () => fromValue(1);
  },
  // Icosahedron(2)
  (value) => {
    assertNumber(value);
    return () => fromValue(value);
  },
  // Icosahedron({ radius: 2 })
  ({ radius }) => {
    assertNumber(radius);
    return () => fromRadius({ radius });
  },
  // Icosahedron({ diameter: 2 })
  ({ diameter }) => {
    assertNumber(diameter);
    return () => fromDiameter({ diameter });
  });

Icosahedron.fromValue = fromValue;
Icosahedron.fromRadius = fromRadius;
Icosahedron.fromDiameter = fromDiameter;

/**
 *
 * # Item
 *
 * Encapsulates a geometry as a discrete item.
 *
 **/

const Item = (shape, id) => Shape.fromGeometry(rewriteTags([`item/${id}`], [], { item: toGeometry(shape) }));

const method$5 = function (id) { return Item(this, id); };
Shape.prototype.toItem = method$5;

/**
 *
 * # Lego
 *
 * ::: illustration { "view": { "position": [10, 10, 10] } }
 * ```
 * Lego.stud()
 * ```
 * :::
 * ::: illustration { "view": { "position": [10, 10, 10] } }
 * ```
 * Lego.socket()
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * Lego.studSheet()
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, -20] } }
 * ```
 * Lego.socketSheet()
 * ```
 * :::
 * FIX: Does not drop deep 'void'.
 * ::: illustration { "view": { "position": [20, 20, -30] } }
 * ```
 * assemble(Cube(8, 8, 3.2).above().as('plate'),
 *          Lego.socket().above().as('socket'))
 * ```
 * :::
 *
 **/

const stud = ({ diameter = 5, height = 1.8, play = 0.1, faces = 32 } = {}) => {
  const top = 0.5;
  const expansion = 0.2;
  return assemble(Cylinder.ofDiameter(diameter - play - expansion, height)
      .moveZ(height / 2),
                  Cylinder.ofDiameter(diameter - play, top)
                      .moveZ(height - top / 2)
  );
};

const studSheet =
    ({
      width = 32,
      length = 32,
      height = 1.8,
      studDiameter = 5,
      studHeight = 1.8,
      studFaces = 32,
      studMarginX = 0,
      studMarginY = 0,
      play = 0.1
    } = {}) => {
      const studs = [];
      for (let x = 4 + studMarginX; x < width - studMarginX; x += 8) {
        for (let y = 4 + studMarginY; y < length - studMarginY; y += 8) {
          studs.push(stud().move(x - width / 2, y - length / 2, height / 2));
        }
      }
      return assemble(Cube(width - play * 2, length - play * 2, height), ...studs);
    };

const socket =
    ({
      diameter = 5.1,
      height = 1.8,
      gripRingHeight = 0.4,
      gripRingContraction = 0.1,
      faces = 32,
      play = 0.0
    } = {}) => {
      // A stud is theoretically 1.7 mm tall.
      // We introduce a grip-ring from 0.5 to 1.2 mm (0.7 mm in height)
      const bottom = 0.5;
      const topHeight = height - gripRingHeight - bottom;
      return assemble(
        // flaired top
        Cylinder.ofDiameter(diameter + play, topHeight)
            .moveZ(topHeight / 2 + bottom + gripRingHeight),
        // grip ring
        Cylinder.ofDiameter(diameter + play - gripRingContraction, gripRingHeight)
            .moveZ(gripRingHeight / 2 + bottom),
        // flaired base
        Cylinder.ofDiameter(diameter + play, bottom)
            .moveZ(bottom / 2));
    };

const socketSheet =
    ({
      width = 32,
      length = 32,
      height = 1.8,
      play = 0.1,
      studMarginX = 0,
      studMarginY = 0,
      stud = {}
    } = {}) => {
      const sockets = [];
      for (let x = 4 + studMarginX; x < width - studMarginX; x += 8) {
        for (let y = 4 + studMarginY; y < length - studMarginY; y += 8) {
          sockets.push(assemble(
            Cube(8 - play * 2, 8 - play * 2, height).above(),
            socket(stud).drop())
              .move(x - width / 2, y - length / 2, height / -2));
        }
      }
      return assemble(...sockets);
    };

const axleProfile = () =>
  Shape.fromPathToSurface(
    [[2.24, 0.80, 0.00],
     [0.80, 0.80, 0.00],
     [0.80, 2.24, 0.00],
     [0.00, 2.4, 0.00],
     [-0.80, 2.24, 0.00],
     [-0.80, 0.80, 0.00],
     [-2.24, 0.80, 0.00],
     [-2.4, 0.00, 0.00],
     [-2.24, -0.80, 0.00],
     [-0.80, -0.80, 0.00],
     [-0.80, -2.24, 0.00],
     [0.00, -2.40, 0.00],
     [0.80, -2.24, 0.00],
     [0.80, -0.80, 0.00],
     [2.24, -0.80, 0.00],
     [2.4, 0.00, 0.00]]);

const Lego = {
  stud,
  socket,
  studSheet,
  socketSheet,
  axleProfile
};

const Line = (length) => Path([0, 0, length / -2], [0, 0, length / 2]);

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

const intersectionOfShapes = (...shapes) => {
  switch (shapes.length) {
    case 0: {
      return fromGeometry({ assembly: [] });
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

const intersection = dispatch(
  'intersection',
  (...shapes) => {
    return () => intersectionOfShapes(...shapes);
  });

const method$6 = function (...shapes) { return intersection(this, ...shapes); };

Shape.prototype.clip = method$6;
Shape.prototype.intersection = method$6;

/**
 *
 * # Micro Gear Motor
 *
 * ::: illustration { "view": { "position": [40, 40, 80], "target": [-15, -15, 0] } }
 * ```
 * MicroGearMotor()
 * ```
 * :::
 *
 **/

const FlatShaft = ({ diameter, length, flatLength, flatOffset, play }) =>
  difference(
    Cylinder({ diameter: diameter + play,
               height: length + play * 2 }),
    Cube(diameter + play * 2, diameter + play * 2, flatLength)
        .move(diameter - 0.5, 0, (length - flatLength) / -2 + flatOffset));

const Motor = ({ play, motorWidth }) =>
  intersection(Cylinder({ diameter: 12 + play, height: 15 + play }),
               Cube(10 + play * 2, motorWidth + play * 2, 15));

const Terminal = () => Cube(5, 12, 2);

const Gearbox = ({ play, motorWidth }) => Cube(10 + play * 2, motorWidth + play * 2, 10).moveZ((15 + 10) / 2);

const MicroGearMotor = ({ play = 0.2, shaftDiameter = 3.2, shaftPlay = 0, motorWidth = 12 } = {}) =>
  union(Motor({ play, motorWidth }),
        Gearbox({ play, motorWidth }),
        FlatShaft({
          diameter: shaftDiameter,
          length: 10 + play * 2,
          flatLength: 7,
          flatOffset: 3,
          play: shaftPlay
        })
            .moveZ((15 + 10) / 2 + 10),
        Terminal()
            .moveZ((15 + 2) / -2));

/**
 *
 * # Nail
 *
 **/

const Nail = dispatch(
  'Nail',
  (radius, height) => {
    assertNumber(radius);
    assertNumber(height);
    return () => Cylinder(radius, height, 3)
        .move(0, 0, height / -2);
  });

const fromValue$1 = (point) => Shape.fromPoint(point);

/**
 *
 * # Point
 *
 * Generates a point, by default at the origin.
 *
 * Note: The points are not visible in the illustrations below.
 *
 * ::: illustration
 * ```
 * Point()
 * ```
 * :::
 * ::: illustration
 * ```
 * Point(1)
 * ```
 * :::
 * ::: illustration
 * ```
 * Point(1, 2)
 * ```
 * :::
 * ::: illustration
 * ```
 * Point(1, 2, 3)
 * ```
 * :::
 * ::: illustration
 * ```
 * Point([1, 1, 0])
 * ```
 * :::
 * ::: illustration
 * ```
 * Point([1])
 * ```
 * :::
 * ::: illustration
 * ```
 * Point([1, 2])
 * ```
 * :::
 * ::: illustration
 * ```
 * Point([1, 2, 3])
 * ```
 * :::
 *
 **/

const Point = dispatch(
  'Point',
  // Point()
  (x = 0, y = 0, z = 0, ...rest) => {
    assertNumber(x);
    assertNumber(y);
    assertNumber(z);
    assertEmpty(rest);
    return () => fromValue$1([x, y, z]);
  },
  // Point([1, 2, 3])
  ([x = 0, y = 0, z = 0]) => {
    assertNumber(x);
    assertNumber(y);
    assertNumber(z);
    return () => fromValue$1([x, y, z]);
  });

Point.fromValue = fromValue$1;

const fromPoints$1 = (points) => Shape.fromPoints(points);

/**
 *
 * # Points
 *
 * Generates point cloud.
 *
 * Note: The points are not visible in the illustrations below.
 *
 * ::: illustration
 * ```
 * Points([ -0.5, -0.5, -0.5 ],
 *        [ -0.5, -0.5, 0.5 ],
 *        [ -0.5, 0.5, -0.5 ],
 *        [ -0.5, 0.5, 0.5 ],
 *        [ 0.5, -0.5, -0.5 ],
 *        [ 0.5, -0.5, 0.5 ],
 *        [ 0.5, 0.5, -0.5 ],
 *        [ 0.5, 0.5, 0.5 ])
 * ```
 * :::
 * ::: illustration { "view": { "position": [5, 5, 5] } }
 * ```
 * hull(Points([ -0.5, -0.5, -0.5 ],
 *             [ -0.5, -0.5, 0.5 ],
 *             [ -0.5, 0.5, -0.5 ],
 *             [ -0.5, 0.5, 0.5 ],
 *             [ 0.5, -0.5, -0.5 ],
 *             [ 0.5, -0.5, 0.5 ],
 *             [ 0.5, 0.5, -0.5 ],
 *             [ 0.5, 0.5, 0.5 ]))
 * ```
 * :::
 *
 **/

const Points = dispatch(
  'Points',
  // points([1, 2, 3], [2, 3, 4])
  (...points) => {
    for (const [x = 0, y = 0, z = 0] of points) {
      assertNumberTriple([x, y, z]);
    }
    return () => fromPoints$1(points);
  });

Points.fromPoints = fromPoints$1;

/**
 *
 * # Polyhedron
 *
 * ::: illustration { "view": { "position": [80, 20, 20] } }
 * ```
 * Polyhedron([[10, 10, 0], [10, -10, 0], [-10, -10, 0], [-10, 10, 0], [0, 0, 10]],
 *            [[4, 1, 0], [4, 2, 1], [4, 3, 2], [4, 0, 3], [3, 0, 1], [3, 1, 2]] })
 * ```
 * :::
 *
 **/

const ofPointPaths = (points = [], paths = []) => {
  const polygons = [];
  for (const path of paths) {
    polygons.push(path.map(point => points[point]));
  }
  return Shape.fromPolygonsToSolid(polygons);
};

const Polyhedron = (...args) => ofPointPaths(...args);

Polyhedron.ofPointPaths = ofPointPaths;

/**
 *
 * # Sphere
 *
 * Generates spheres.
 *
 * ::: illustration { "view": { "position": [5, 5, 5] } }
 * ```
 * Sphere()
 * ```
 * :::
 * ::: illustration { "view": { "position": [60, 60, 60] } }
 * ```
 * Sphere(10)
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * Sphere({ radius: 8, resolution: 5 })
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * Sphere({ diameter: 16, resolution: 64 })
 * ```
 * :::
 *
 **/

const unitSphere = (resolution = 16) => {
  const shape = Shape.fromGeometry(buildRingSphere(resolution));
  // Make convex.
  shape.toGeometry().solid.isConvex = true;
  return shape;
};

const ofRadius$7 = (radius = 1, { resolution = 16 } = {}) => unitSphere(resolution).scale(radius);
const ofApothem$6 = (apothem = 1, { resolution = 16 } = {}) => ofRadius$7(toRadiusFromApothem$1(apothem), { resolution });
const ofDiameter$7 = (diameter = 1, { resolution = 16 } = {}) => ofRadius$7(diameter / 2, { resolution });

const Sphere = (...args) => ofRadius$7(...args);

Sphere.ofApothem = ofApothem$6;
Sphere.ofRadius = ofRadius$7;
Sphere.ofDiameter = ofDiameter$7;

/**
 *
 * # Numbers
 *
 * ```
 * numbers({ to: 10 }) is [0, 1, 2, 3, 4, 5, 6, 9].
 * numbers({ from: 3, to: 6 }) is [3, 4, 5, 6].
 * numbers({ from: 2, to: 8, by: 2 }) is [2, 4, 6].
 * numbers({ to: 2 }, { to: 3 }) is [[0, 0], [0, 1], [0, 2], [1, 0], ...];
 * ```
 *
 **/

const EPSILON = 1e-5;

const numbers = ({ from = 0, to, upto, by, resolution }, thunk = (n => n)) => {
  const numbers = [];
  if (by === undefined) {
    if (resolution !== undefined) {
      by = to / resolution;
    } else {
      by = 1;
    }
  }

  if (to === undefined && upto === undefined) {
    upto = 1;
  }

  if (upto !== undefined) {
    // Exclusive
    for (let number = from; number < to - EPSILON; number += by) {
      numbers.push(thunk(number));
    }
  } else if (to !== undefined) {
    // Inclusive
    for (let number = from; number <= to + EPSILON; number += by) {
      numbers.push(thunk(number));
    }
  }
  return numbers;
};

/**
 *
 * # Spiral
 *
 * These take a function mapping angle to radius.
 *
 * ::: illustration { "view": { "position": [0, 0, 10] } }
 * ```
 * Spiral({ to: 360 * 5 },
 *        angle => angle);
 * ```
 * :::
 * ::: illustration { "view": { "position": [0, 0, 10] } }
 * ```
 * Spiral({ to: 360 },
 *        (angle) => 2 + sin(angle * 20))
 *   .close()
 *   .interior()
 * ```
 * :::
 **/

const Spiral = ({ from = 0, to = 360, by = 1 } = {}, toRadiusFromAngle = (angle) => angle) => {
  const path = [null];
  for (const angle of numbers({ from, to, by })) {
    const radius = toRadiusFromAngle(angle);
    path.push(transform$1(fromZRotation(angle * Math.PI / 180), [radius, 0, 0]));
  }
  return Shape.fromPath(path);
};

/**
 *
 * # Square (rectangle)
 *
 * Properly speaking what is produced here are rectangles.
 *
 * ::: illustration { "view": { "position": [0, 0, 10] } }
 * ```
 * Square()
 * ```
 * :::
 * ::: illustration
 * ```
 * Square(10)
 * ```
 * :::
 * ::: illustration
 * ```
 * Square(6, 12)
 * ```
 * :::
 * ::: illustration
 * ```
 * Square({ edge: 10 })
 * ```
 * :::
 * ::: illustration
 * ```
 * assemble(Circle(10),
 *          Square({ radius: 10 })
 *            .drop())
 * ```
 * :::
 * ::: illustration
 * ```
 * assemble(Square({ apothem: 10 }),
 *          Circle(10).drop())
 * ```
 * :::
 * ::: illustration
 * ```
 * Square({ diameter: 20 })
 * ```
 * :::
 **/

const toRadiusFromApothem = (apothem) => apothem / Math.cos(Math.PI / 4);

const edgeScale$1 = regularPolygonEdgeLengthToRadius(1, 4);
const unitSquare = () => Shape.fromGeometry(buildRegularPolygon(4)).rotateZ(45).scale(edgeScale$1);

const ofEdge$3 = (size) => unitSquare().scale(size);
const ofEdges = (width, length) => unitSquare().scale([width, length, 1]);
const ofRadius$8 = (radius) => Shape.fromGeometry(buildRegularPolygon(4)).rotateZ(45).scale(radius);
const ofApothem$7 = (apothem) => ofRadius$8(toRadiusFromApothem(apothem));
const ofDiameter$8 = (diameter) => ofRadius$8(diameter / 2);

const fromCorners$1 = (corner1, corner2) => {
  const [c1x, c1y] = corner1;
  const [c2x, c2y] = corner2;
  const length = c2x - c1x;
  const width = c2y - c1y;
  const center = [(c1x + c2x) / 2, (c1y + c2y) / 2];
  return unitSquare().scale([length, width]).translate(center);
};

const Square = dispatch(
  'Square',
  // square()
  (...args) => {
    assertEmpty(args);
    return () => ofEdge$3(1);
  },
  // square(4)
  (size, ...rest) => {
    assertNumber(size);
    assertEmpty(rest);
    return () => ofEdge$3(size);
  },
  // square(4, 6)
  (width, length, ...rest) => {
    assertNumber(width);
    assertNumber(length);
    assertEmpty(rest);
    return () => ofEdges(width, length);
  },
  // square({ edge: 10 })
  ({ edge }) => {
    assertNumber(edge);
    return () => ofEdge$3(edge);
  },
  // Polygon({ apothem: 10 })
  ({ apothem }) => {
    assertNumber(apothem);
    return () => ofApothem$7(apothem);
  },
  // Polygon({ radius: 10})
  ({ radius }) => {
    assertNumber(radius);
    return () => ofRadius$8(radius);
  },
  // Polygon({ diameter: 10})
  ({ diameter }) => {
    assertNumber(diameter);
    return () => ofDiameter$8(diameter);
  });

Square.ofEdge = ofEdge$3;
Square.ofEdges = ofEdges;
Square.ofRadius = ofRadius$8;
Square.ofApothem = ofApothem$7;
Square.ofDiameter = ofDiameter$8;
Square.fromCorners = fromCorners$1;

/**
 *
 * # Svg Path
 *
 * Generates a path from svg path data.
 *
 * ::: illustration
 * ```
 * SvgPath({},
 *         'M 120.25163,89.678938 C 105.26945,76.865343 86.290871,70.978848 64.320641,70.277872 z')
 *   .center()
 *   .scale(0.2)
 * ```
 * :::
 *
 **/

const SvgPath = (options = {}, svgPath) =>
  Shape.fromGeometry(fromSvgPath(options, svgPath));

/**
 *
 * # Tetrahedron
 *
 * Generates tetrahedrons.
 *
 * ::: illustration { "view": { "position": [8, 8, 8] } }
 * ```
 * Tetrahedron()
 * ```
 * :::
 * ::: illustration { "view": { "position": [80, 80, 80] } }
 * ```
 * Tetrahedron(10)
 * ```
 * :::
 * ::: illustration { "view": { "position": [60, 60, 60] } }
 * ```
 * Tetrahedron({ radius: 8 })
 * ```
 * :::
 * ::: illustration { "view": { "position": [60, 60, 60] } }
 * ```
 * Tetrahedron({ diameter: 16 })
 * ```
 * :::
 *
 **/

const unitTetrahedron = () => Shape.fromGeometry(buildRegularTetrahedron({}));

const fromValue$2 = (value) => unitTetrahedron().scale(value);

const fromRadius$1 = ({ radius }) => unitTetrahedron().scale(radius);

const fromDiameter$1 = ({ diameter }) => unitTetrahedron().scale(diameter / 2);

const Tetrahedron = dispatch(
  'Tetrahedron',
  // Tetrahedron()
  (...rest) => {
    assertEmpty(rest);
    return () => fromValue$2(1);
  },
  // Tetrahedron(2)
  (value) => {
    assertNumber(value);
    return () => fromValue$2(value);
  },
  // Tetrahedron({ radius: 2 })
  ({ radius }) => {
    assertNumber(radius);
    return () => fromRadius$1({ radius });
  },
  // Tetrahedron({ diameter: 2 })
  ({ diameter }) => {
    assertNumber(diameter);
    return () => fromDiameter$1({ diameter });
  });

Tetrahedron.fromValue = fromValue$2;
Tetrahedron.fromRadius = fromRadius$1;
Tetrahedron.fromDiameter = fromDiameter$1;

/**
 *
 * # Triangle
 *
 * ::: illustration { "view": { "position": [0, 0, 5] } }
 * ```
 * Triangle()
 * ```
 * :::
 * ::: illustration
 * ```
 * Triangle(20)
 * ```
 * :::
 * ::: illustration
 * ```
 * Triangle({ radius: 10 })
 * ```
 * :::
 * ::: illustration
 * ```
 * assemble(Circle(10),
 *          Triangle({ radius: 10 })
 *            .drop())
 * ```
 * :::
 * ::: illustration
 * ```
 * assemble(Triangle({ apothem: 5 }),
 *          Circle(5).drop())
 * ```
 * :::
 * ::: illustration
 * ```
 * assemble(Triangle({ radius: 10 })
 *            .rotateZ(180),
 *          Triangle({ diameter: 10 })
 *            .drop())
 * ```
 * :::
 **/

const ofEdge$4 = (edge = 1) => Polygon.ofEdge(edge, { sides: 3 });
const ofApothem$8 = (apothem = 1) => Polygon.ofApothem(apothem, { sides: 3 });
const ofRadius$9 = (radius = 1) => Polygon.ofRadius(radius, { sides: 3 });
const ofDiameter$9 = (diameter = 1) => Polygon.ofDiameter(diameter, { sides: 3 });

const Triangle = (...args) => ofEdge$4(...args);

Triangle.ofEdge = ofEdge$4;
Triangle.ofApothem = ofApothem$8;
Triangle.ofRadius = ofRadius$9;
Triangle.ofDiameter = ofDiameter$9;

// Ideally this would be a plane of infinite extent.
// Unfortunately this makes things like interpolation tricky,
// so we approximate it with a very large polygon instead.

const Y = (y = 0) => {
  const size = 1e5;
  const min = -size;
  const max = size;
  return Shape.fromPathToZ0Surface([[max, y, min], [max, y, max], [min, y, max], [min, y, min]]);
};

/**
 *
 * # Lathe
 *
 * ::: illustration { "view": { "position": [-80, -80, 80] } }
 * ```
 * ```
 * :::
 *
 **/

const lathe = (shape, endDegrees = 360, { resolution = 5 }) => {
  const profile = shape.chop(Y(0));
  const outline = profile.outline();
  const solids = [];
  for (const geometry of getPaths(outline.toKeptGeometry())) {
    for (const path of geometry.paths) {
      solids.push(Shape.fromGeometry(lathe$1(path, endDegrees * Math.PI / 180, resolution)));
    }
  }
  return assemble(...solids);
};

const method$7 = function (...args) { return lathe(this, ...args); };
Shape.prototype.lathe = method$7;

/**
 *
 * # Threaded Rod
 *
 **/

const buildThread = ({ radius = 1, height = 1, pitch = 1, sides = 16 }) => {
  const thread = lathe({ loops: (height / pitch) + 2, loopOffset: pitch, sides },
                       Triangle()
                           .scale(pitch)
                           .rotateZ(90)
                           .move(0, radius));
  return intersection(Cube.fromCorners([0, -(radius + pitch), -(radius + pitch)],
                                       [height, radius + pitch, radius + pitch]),
                      thread.move(-pitch, 0, 0))
      .rotateY(-90)
      .center();
};

const buildRod = ({ radius = 1, height = 1, sides = 16 }) =>
  Cylinder({ radius, height, sides });

const fromRadius$2 = ({ radius = 1, height = 1, pitch = 1, sides = 16, play = 0, bore }) => {
  const rod = assemble(
    buildThread({ radius: radius - play, height, pitch, sides }),
    buildRod({ radius: radius - play, height, sides }));
  if (bore) {
    return assemble(
      bore().drop(),
      rod.nocut());
  } else {
    return rod;
  }
};

const ThreadedRod = dispatch(
  'ThreadedRod',
  // cube()
  (radius, height = 1, sides = 16, bore) => {
    assertNumber(radius);
    assertNumber(height);
    assertNumber(sides);
    return () => fromRadius$2({ radius, height, sides, bore });
  });

ThreadedRod.ofRadius = (radius, height, sides) => ThreadedRod(radius, height, sides);

/**
 *
 * # Torus
 *
 * ::: illustration { "view": { "position": [-80, -80, 80] } }
 * ```
 * Torus({ thickness: 5,
 *         radius: 20 })
 * ```
 * :::
 * ::: illustration { "view": { "position": [-80, -80, 80] } }
 * ```
 * Torus({ thickness: 5,
 *         radius: 20,
 *         sides: 4 })
 * ```
 * :::
 * ::: illustration { "view": { "position": [-80, -80, 80] } }
 * ```
 * Torus({ thickness: 5,
 *         radius: 20,
 *         sides: 4,
 *         rotation: 45 })
 * ```
 * :::
 *
 **/

const Torus = ({ thickness = 1, radius = 1, segments = 16, sides = 16, rotation = 0 } = {}) =>
  lathe({ sides: segments },
        Circle({ sides, radius: thickness })
            .rotateZ(rotation)
            .move(0, radius))
      .rotateY(90);

/**
 *
 * # Wave
 *
 * These take a function mapping X distance to Y distance.
 *
 * ::: illustration { "view": { "position": [0, 0, 10] } }
 * ```
 * Wave({ to: 360 },
 *      angle => sin(angle) * 100);
 * ```
 * :::
 **/

const Wave = ({ from = 0, to = 360, by = 1 } = {}, toYDistanceFromXDistance = (xDistance) => 0) => {
  const path = [null];
  for (const xDistance of numbers({ from, to, by })) {
    const yDistance = toYDistanceFromXDistance(xDistance);
    path.push([xDistance, yDistance, 0]);
  }
  return Shape.fromPath(path);
};

// Ideally this would be a plane of infinite extent.
// Unfortunately this makes things like interpolation tricky,
// so we approximate it with a very large polygon instead.

const X = (x = 0) => {
  const size = 1e5;
  const min = -size;
  const max = size;
  return Shape.fromPathToZ0Surface([[x, max, min], [x, max, max], [x, min, max], [x, min, min]]);
};

// Ideally this would be a plane of infinite extent.
// Unfortunately this makes things like interpolation tricky,
// so we approximate it with a very large polygon instead.

const Z = (z = 0) => {
  const size = 1e5;
  const min = -size;
  const max = size;
  return Shape.fromPathToZ0Surface([[max, min, z], [max, max, z], [min, max, z], [min, min, z]]);
};

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

const measureBoundingBox = (shape) => measureBoundingBox$1(shape.toGeometry());

const method$8 = function () { return measureBoundingBox(this); };
Shape.prototype.measureBoundingBox = method$8;

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

const translate = (shape, x = 0, y = 0, z = 0) => shape.transform(fromTranslation([x, y, z]));

const method$9 = function (...args) { return translate(this, ...args); };
Shape.prototype.translate = method$9;

/**
 *
 * # Move
 *
 * A shorter way to write translate.
 *
 */

const move = translate;

const method$a = function (...params) { return translate(this, ...params); };
Shape.prototype.move = method$a;

/**
 *
 * # MoveZ
 *
 * Move along the Z axis.
 *
 */

const moveZ = (shape, z) => move(shape, 0, 0, z);

const method$b = function (z) { return moveZ(this, z); };
Shape.prototype.moveZ = method$b;

/**
 *
 * # Above
 *
 * Moves the shape so that its lowest point is at z = 0.
 *
 * ::: illustration { "view": { "position": [60, -60, 60], "target": [0, 0, 0] } }
 * ```
 * Circle(20).with(Cube(10).above())
 * ```
 * :::
 **/

const MIN = 0;
const Z$1 = 2;

const above = (shape, reference) => {
  return moveZ(shape, -measureBoundingBox(shape)[MIN][Z$1]);
};

const aboveMethod = function (...params) { return above(this); };
Shape.prototype.above = aboveMethod;

/**
 *
 * # Ask
 *
 * Queries a parameter, asking the user if not already provided.
 *
 * ```
 * const length = ask('Length');
 * ```
 *
 **/

const askForString = async (identifier, value, options = {}) => {
  if (value instanceof Array) {
    return askForString(identifier, value[0], { ...options, choices: value });
  } else {
    return ask$1(identifier, { ...options, initially: value });
  }
};

const askForBool = async (identifier, value = false, options = {}) => {
  return askForString(identifier, value, { ...options, choices: [true, false] });
};

const askForNumber = async (identifier, value = 0, options = {}) => {
  const result = await askForString(identifier, value, options);
  if (typeof result === 'string') {
    try {
      return Number(result);
    } catch (e) {
      return value;
    }
  } else {
    return result;
  }
};

const ask = async (...args) => askForNumber(...args);

ask.forNumber = askForNumber;
ask.forString = askForString;
ask.forBool = askForBool;

/**
 *
 * # MoveY
 *
 * Move along the Y axis.
 *
 */

const moveY = (shape, y) => move(shape, 0, y);

const method$c = function (y) { return moveY(this, y); };
Shape.prototype.moveY = method$c;

/**
 *
 * # Back
 *
 * Moves the shape so that it is just behind the origin.
 *
 * ::: illustration { "view": { "position": [-40, -40, 40] } }
 * ```
 * Cylinder(2, 15)
 *   .with(Cube(10).back())
 * ```
 * :::
 **/

const MIN$1 = 0;
const Y$1 = 1;

const back = (shape, reference) => {
  return moveY(shape, -measureBoundingBox(shape)[MIN$1][Y$1]);
};

const backMethod = function (...params) { return back(this); };
Shape.prototype.back = backMethod;

/**
 *
 * # Below
 *
 * Moves the shape so that its highest point is at z = 0.
 *
 * ::: illustration { "view": { "position": [60, -60, -60], "target": [0, 0, 0] } }
 * ```
 * Circle(20).flip().with(Cube(10).below())
 * ```
 * :::
 **/

const MAX = 1;
const Z$2 = 2;

const below = (shape, reference) => {
  return moveZ(shape, -measureBoundingBox(shape)[MAX][Z$2]);
};

const belowMethod = function (...params) { return below(this); };
Shape.prototype.below = belowMethod;

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

const center = (shape) => {
  const [minPoint, maxPoint] = measureBoundingBox(shape);
  let center = scale$1(0.5, add(minPoint, maxPoint));
  const moved = shape.move(...negate(center));
  return moved;
};

const centerMethod = function (...params) { return center(this); };
Shape.prototype.center = centerMethod;

/**
 *
 * # Chain Hull
 *
 * Builds a convex hull between adjacent pairs in a sequence of shapes.
 *
 * ::: illustration { "view": { "position": [30, 30, 30] } }
 * ```
 * chainHull(Cube(3).move(-5, 5),
 *           Sphere(3).move(5, -5),
 *           Cylinder(3, 10).move(-10, -10))
 *   .move(10, 10)
 * ```
 * :::
 * ::: illustration { "view": { "position": [80, 80, 0] } }
 * ```
 * chainHull(Circle(20).moveZ(-10),
 *           Circle(10),
 *           Circle(20).moveZ(10))
 * ```
 * :::
 *
 **/

const Z$3 = 2;

const chainHull = (...shapes) => {
  const pointsets = shapes.map(shape => shape.toPoints());
  const chain = [];
  for (let nth = 1; nth < pointsets.length; nth++) {
    const points = [...pointsets[nth - 1], ...pointsets[nth]];
    if (points.every(point => point[Z$3] === 0)) {
      chain.push(Shape.fromGeometry(buildConvexSurfaceHull(points)));
    } else {
      chain.push(Shape.fromGeometry(buildConvexHull(points)));
    }
  }
  return union(...chain);
};

/**
 *
 * # Chop
 *
 * Remove the parts of a shape above surface, defaulting to Z(0).
 *
 * ::: illustration { "view": { "position": [60, -60, 60], "target": [0, 0, 0] } }
 * ```
 * Cube(10).with(Cube(10).moveX(10).chop(Z(0)));
 * ```
 * :::
 * ::: illustration { "view": { "position": [60, -60, 60], "target": [0, 0, 0] } }
 * ```
 * Cube(10).with(Cube(10).moveX(10).chop(Z(0).flip()));
 * ```
 * :::
 *
 **/

const chop = (shape, planeShape = Z()) => {
  const cuts = [];
  for (const { surface, z0Surface } of getAnySurfaces(planeShape.toKeptGeometry())) {
    const planeSurface = surface || z0Surface;
    for (const { solid, tags } of getSolids(shape.toKeptGeometry())) {
      const cutResult = cut(solid, planeSurface);
      cuts.push(Shape.fromGeometry({ solid: cutResult, tags }));
    }
  }

  for (const { surface, z0Surface } of getAnySurfaces(planeShape.toKeptGeometry())) {
    const planeSurface = surface || z0Surface;
    for (const { surface, z0Surface, tags } of getAnySurfaces(shape.toKeptGeometry())) {
      const cutSurface = surface || z0Surface;
      const cutResult = cut$1(planeSurface, cutSurface);
      cuts.push(Shape.fromGeometry({ surface: cutResult, tags }));
    }
  }

  return assemble(...cuts);
};

const chopMethod = function (surface) { return chop(this, surface); };
Shape.prototype.chop = chopMethod;

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
  Shape.fromGeometry(rewriteTags([toTagFromName(name)], [], shape.toGeometry()));

const color = (...args) => fromName(...args);

const colorMethod = function (...args) { return color(this, ...args); };
Shape.prototype.color = colorMethod;

/**
 *
 * # Hull
 *
 * Builds the convex hull of a set of shapes.
 *
 * ::: illustration { "view": { "position": [30, 30, 30] } }
 * ```
 * hull(Point([0, 0, 10]),
 *      Circle(10))
 * ```
 * :::
 * ::: illustration { "view": { "position": [30, 30, 30] } }
 * ```
 * assemble(Point([0, 0, 10]),
 *          Circle(10))
 *   .hull()
 * ```
 * :::
 * ::: illustration { "view": { "position": [30, 30, 30] } }
 * ```
 * Point([0, 0, 10]).hull(Circle(10))
 * ```
 * :::
 * ::: illustration { "view": { "position": [30, 30, 30] } }
 * ```
 * hull(Circle(4),
 *      Circle(2).move(8));
 * ```
 * :::
 *
 **/

const Z$4 = 2;

const hull = (...shapes) => {
  const points = [];
  shapes.forEach(shape => shape.eachPoint({}, point => points.push(point)));
  // FIX: Detect planar hulls properly.
  if (points.every(point => point[Z$4] === 0)) {
    return Shape.fromGeometry(buildConvexSurfaceHull(points));
  } else {
    return Shape.fromGeometry(buildConvexHull(points));
  }
};

const method$d = function (...shapes) { return hull(this, ...shapes); };

Shape.prototype.hull = method$d;

/**
 *
 * # Shell
 *
 * Converts a solid into a hollow shell of a given thickness.
 *
 * ::: illustration
 * ```
 * Cube(10).shell(1);
 * ```
 * :::
 *
 **/

const shell = (shape, radius = 1, resolution = 8) => {
  resolution = Math.max(resolution, 3);
  const keptGeometry = shape.toKeptGeometry();
  const shells = [];
  for (const { solid, tags = [] } of getSolids(keptGeometry)) {
    const pieces = [];
    for (const surface of solid) {
      for (const polygon of surface) {
        pieces.push(hull(...polygon.map(point => Sphere(radius, resolution).move(...point))));
      }
    }
    shells.push(union(...pieces).as(...tags));
  }
  for (const { paths, tags = [] } of outline$1(keptGeometry)) {
    const pieces = [];
    for (const path of paths) {
      for (const segment of toSegments({}, path)) {
        // FIX: Handle non-z0-surfaces properly.
        pieces.push(hull(...segment.map(([x, y]) => Circle(radius, resolution).move(x, y))));
      }
    }
    shells.push(union(...pieces).as(...tags));
  }
  return union(...shells);
};

const method$e = function (radius, resolution) { return shell(this, radius, resolution); };
Shape.prototype.shell = method$e;

/**
 *
 * # expand
 *
 * Moves the edges of the shape inward by the specified amount.
 *
 * ::: illustration { "view": { "position": [60, -60, 60], "target": [0, 0, 0] } }
 * ```
 * Cube(10).with(Cube(10).moveX(10).expand(2))
 * ```
 * :::
 **/

const expand = (shape, amount = 1, { resolution = 16 }) =>
  (amount >= 0)
    ? shape.union(shell(shape, amount, resolution))
    : shape.cut(shell(shape, -amount, resolution));

const method$f = function (...args) { return expand(this, ...args); };
Shape.prototype.expand = method$f;

/**
 *
 * # contract
 *
 * Moves the edges of the shape inward by the specified amount.
 *
 * ::: illustration { "view": { "position": [60, -60, 60], "target": [0, 0, 0] } }
 * ```
 * Cube(10).wireframe().with(Cube(10).contract(2))
 * ```
 * :::
 **/

const byRadius = (shape, amount = 1, { resolution = 16 } = {}) => expand(shape, -amount, resolution);

const contract = (...args) => byRadius(...args);

contract.byRadius = byRadius;

const method$g = function (radius, resolution) { return contract(this, radius, resolution); };
Shape.prototype.contract = method$g;

/**
 *
 * # Coordinates
 *
 * ```
 * coordinates({ to: 3 }) is [[0], [1], [2]].
 * ```
 *
 **/

// FIX: Consider other cardinalities.
const coordinates = (xSpec, ySpec, zSpec, thunk) => {
  const coordinates = [];
  numbers(xSpec, x => numbers(ySpec, y => numbers(zSpec, z => coordinates.push(thunk(x, y, z)))));
  return coordinates;
};

/**
 *
 * # Drop from assembly
 *
 * Generates an assembly from components in an assembly without a tag.
 *
 * If no tag is supplied, the whole shape is dropped.
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
 *   .drop('A')
 * ```
 * :::
 * ::: illustration
 * ```
 * assemble(Circle(10).as('A'),
 *          Square(10).as('B'))
 *   .drop('B')
 * ```
 * :::
 * ::: illustration
 * ```
 * assemble(Circle(10).as('A'),
 *          Square(10).as('B'))
 *   .drop('A', 'B')
 * ```
 * :::
 * ::: illustration
 * ```
 * assemble(Cube(10).below(),
 *          Cube(8).below().drop())
 * ```
 * :::
 *
 **/

const drop = (shape, ...tags) => {
  if (tags.length === 0) {
    return fromGeometry(rewriteTags(['compose/non-positive'], [], toGeometry(shape)));
  } else {
    return fromGeometry(drop$1(tags.map(tag => `user/${tag}`), toGeometry(shape)));
  }
};

const method$h = function (...tags) { return drop(this, ...tags); };
Shape.prototype.drop = method$h;

/**
 *
 * # Extrude
 *
 * Generates a solid from a surface by linear extrusion.
 *
 * ```
 * shape.extrude(height, depth, { twist = 0, steps = 1 })
 * ```
 *
 * ::: illustration
 * ```
 * Circle(10).cut(Circle(8))
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 60] } }
 * ```
 * Circle(10).cut(Circle(8)).extrude(10)
 * ```
 * :::
 *
 * ::: illustration { "view": { "position": [40, 40, 60] } }
 * ```
 * Triangle(10).extrude(5, -2)
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 60] } }
 * ```
 * Triangle(10).extrude(10, 0, { twist: 90, steps: 10 })
 * ```
 * :::
 *
 **/

const extrude = (shape, height = 1, depth = 0, { twist = 0, steps = 1 } = {}) => {
  if (height < depth) {
    [height, depth] = [depth, height];
  }
  const twistRadians = twist * Math.PI / 180;
  // FIX: Handle extrusion along a vector properly.
  const solids = [];
  const keptGeometry = shape.toKeptGeometry();
  for (const { z0Surface, tags } of getZ0Surfaces(keptGeometry)) {
    if (z0Surface.length > 0) {
      const solid = extrude$1(z0Surface, height, depth, steps, twistRadians);
      solids.push(Shape.fromGeometry({ solid, tags }));
    }
  }
  for (const { surface, tags } of getSurfaces(keptGeometry)) {
    if (surface.length > 0) {
      const [toZ0, fromZ0] = toXYPlaneTransforms(toPlane$1(surface));
      const z0SolidGeometry = extrude$1(transform$2(toZ0, surface), height, depth, steps, twistRadians);
      const solid = transform$3(fromZ0, z0SolidGeometry);
      solids.push(Shape.fromGeometry({ solid, tags }));
    }
  }
  return assemble(...solids);
};

const extrudeMethod = function (...args) { return extrude(this, ...args); };
Shape.prototype.extrude = extrudeMethod;

const Z$5 = 2;

const flat = (shape) => {
  let bestDepth = Infinity;
  let bestFlatShape = shape;

  const assay = (plane) => {
    if (plane !== undefined) {
      const [to] = toXYPlaneTransforms(plane);
      const flatShape = shape.transform(to);
      const [min, max] = flatShape.measureBoundingBox();
      const depth = max[Z$5] - min[Z$5];
      if (depth < bestDepth) {
        bestDepth = depth;
        bestFlatShape = flatShape.moveZ(-min[Z$5]);
      }
    } else {
      console.log(`QQ/bad`);
    }
  };

  const geometry = shape.toKeptGeometry();
  for (const { solid } of getSolids(geometry)) {
    for (const surface of solid) {
      assay(toPlane$1(surface));
    }
  }
  for (const { surface } of getSurfaces(geometry)) {
    assay(toPlane$1(surface));
  }
  // We do not need to consider z0Surface, since it could never improve the
  // orientation.

  return bestFlatShape;
};

const method$i = function () { return flat(this); };
Shape.prototype.flat = method$i;

/**
 *
 * # Front
 *
 * Moves the shape so that it is just before the origin.
 *
 * ::: illustration { "view": { "position": [-40, -40, 40] } }
 * ```
 * assemble(Cylinder(2, 15).translate([0, 0, 2.5]),
 *          Cube(10).front())
 * ```
 * :::
 * ::: illustration { "view": { "position": [-40, -40, 40] } }
 * ```
 * Cube(10).front(Sphere(5))
 * ```
 * :::
 **/

const Y$2 = 1;

const fromOrigin$1 = (shape) => {
  const [, maxPoint] = measureBoundingBox(shape);
  return moveY(shape, -maxPoint[Y$2]);
};

const fromReference = (shape, reference) => {
  const [, maxPoint] = measureBoundingBox(shape);
  const [minRefPoint] = measureBoundingBox(reference);
  return assemble(reference, moveY(shape, minRefPoint[Y$2] - maxPoint[Y$2]));
};

const front = dispatch(
  'front',
  // front(cube())
  (shape, ...rest) => {
    assertShape(shape);
    assertEmpty(rest);
    return () => fromOrigin$1(shape);
  },
  // front(cube(), sphere())
  (shape, reference) => {
    assertShape(shape);
    assertShape(reference);
    return () => fromReference(shape, reference);
  });

const method$j = function (...params) { return front(this, ...params); };

Shape.prototype.front = method$j;

/**
 *
 * # Get Pathsets
 *
 * Extracts the paths of a geometry grouped by surface.
 *
 **/

const getPathsets = (shape) => getPaths(shape.toKeptGeometry()).map(({ paths }) => paths);

const method$k = function () { return getPathsets(this); };

Shape.prototype.getPathsets = method$k;

const importModule = async (name) => {
  let script;
  if (script === undefined) {
    const path = `source/${name}`;
    script = await readFile({ path, as: 'utf8' }, path);
  }
  if (script === undefined) {
    const path = `cache/${name}`;
    const sources = getSources(path);
    script = await readFile({ path, as: 'utf8', sources }, path);
  }
  const ecmascript = toEcmascript({}, script);
  const builder = new Function(`{ ${Object.keys(api).join(', ')} }`, ecmascript);
  const constructor = await builder(api);
  const module = await constructor();
  return module;
};

/**
 *
 * # Interior
 *
 * Generates a surface from the interior of a simple closed path.
 *
 * ::: illustration
 * ```
 * Circle(10)
 * ```
 * :::
 * ::: illustration
 * ```
 * Circle(10)
 *   .outline()
 * ```
 * :::
 * ::: illustration
 * ```
 * Circle(10)
 *   .outline()
 *   .interior()
 * ```
 * :::
 *
 **/

const interior = (options = {}, shape) => {
  const surfaces = [];
  for (const { paths } of getPaths(shape.toKeptGeometry())) {
    // FIX: Check paths for coplanarity.
    surfaces.push(Shape.fromPathsToSurface(paths.filter(isClosed)));
  }
  return assemble(...surfaces);
};

const method$l = function (options) { return interior(options, this); };

Shape.prototype.interior = method$l;

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

const fromValue$3 = (tags, shape) => fromGeometry(keep$1(tags.map(tag => `user/${tag}`), toGeometry(shape)));

const keep = dispatch(
  'keep',
  (tags, shape) => {
    assertStrings(tags);
    assertShape(shape);
    return () => fromValue$3(tags, shape);
  }
);

keep.fromValues = fromValue$3;

const method$m = function (...tags) { return keep(tags, this); };

Shape.prototype.keep = method$m;

/**
 *
 * # Kept
 *
 * Kept produces a geometry without dropped elements.
 *
 **/

const kept = (shape) => Shape.fromGeometry(toKeptGeometry(shape));

const method$n = function () { return kept(this); };

Shape.prototype.kept = method$n;

/**
 *
 * # MoveX
 *
 * Move along the X axis.
 *
 */

const moveX = (shape, x) => move(shape, x);

const method$o = function (x) { return moveX(this, x); };
Shape.prototype.moveX = method$o;

/**
 *
 * # Left
 *
 * Moves the shape so that it is just to the left of the origin.
 *
 * ::: illustration { "view": { "position": [-40, -40, 40] } }
 * ```
 * assemble(Cube(10).left(),
 *          Cylinder(2, 15))
 * ```
 * :::
 * ::: illustration { "view": { "position": [-40, -40, 40] } }
 * ```
 * Cube(10).left(Sphere(5))
 * ```
 * :::
 **/

const X$1 = 0;

const fromOrigin$2 = (shape) => {
  const [, maxPoint] = measureBoundingBox(shape);
  return moveX(shape, -maxPoint[X$1]);
};

const fromReference$1 = (shape, reference) => {
  const [, maxPoint] = measureBoundingBox(shape);
  const [minRefPoint] = measureBoundingBox(reference);
  return assemble(reference, moveX(shape, minRefPoint[X$1] - maxPoint[X$1]));
};

const left = dispatch(
  'left',
  // front(cube())
  (shape, ...rest) => {
    assertShape(shape);
    assertEmpty(rest);
    return () => fromOrigin$2(shape);
  },
  // front(cube(), sphere())
  (shape, reference) => {
    assertShape(shape);
    assertShape(reference);
    return () => fromReference$1(shape, reference);
  });

const method$p = function (...params) { return left(this, ...params); };

Shape.prototype.left = method$p;

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
  Shape.fromGeometry(rewriteTags(tags.map(tag => `material/${tag}`), [], shape.toGeometry()));

const materialMethod = function (...tags) { return material(this, ...tags); };
Shape.prototype.material = materialMethod;

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

const method$q = function () { return measureCenter(this); };

Shape.prototype.measureCenter = method$q;

/**
 *
 * # Minkowski (convex)
 *
 * Generates the minkowski sum of a two convex shapes.
 *
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * minkowski(Cube(10),
 *           Sphere(3));
 * ```
 * :::
 *
 **/

// TODO: Generalize for more operands?
const minkowski = (a, b) => {
  const aPoints = [];
  const bPoints = [];
  a.eachPoint({}, point => aPoints.push(point));
  b.eachPoint({}, point => bPoints.push(point));
  return Shape.fromGeometry(buildConvexMinkowskiSum(aPoints, bPoints));
};

/**
 *
 * # Mark an object as not to cut holes.
 *
 **/

const fromValue$4 = (tags, shape) => fromGeometry(nonNegative(tags, toGeometry(shape)));

const nocut = dispatch(
  'nocut',
  (tags, shape) => {
    // assemble(circle(), circle().nocut())
    assertEmpty(tags);
    assertShape(shape);
    return () => fromGeometry(rewriteTags(['compose/non-negative'], [], toGeometry(shape)));
  },
  (tags, shape) => {
    assertStrings(tags);
    assertShape(shape);
    return () => fromValue$4(tags.map(tag => `user/${tag}`), shape);
  }
);

nocut.fromValues = fromValue$4;

const method$r = function (...tags) { return nocut(tags, this); };

Shape.prototype.nocut = method$r;

/**
 *
 * # Outline
 *
 * Generates the outline of a surface.
 *
 * ::: illustration
 * ```
 * difference(Circle(10),
 *            Circle(2).move([-4]),
 *            Circle(2).move([4]))
 * ```
 * :::
 * ::: illustration
 * ```
 * difference(Circle(10),
 *            Circle(2).move([-4]),
 *            Circle(2).move([4]))
 *   .outline()
 * ```
 * :::
 *
 **/

const outline = (shape) =>
  assemble(...outline$1(shape.toGeometry()).map(outline => Shape.fromGeometry(outline)));

const method$s = function (options) { return outline(this); };

Shape.prototype.outline = method$s;
Shape.prototype.withOutline = function (options) { return assemble(this, outline(this)); };

const offset = (shape, radius = 1, resolution = 16) => outline(expand(shape, radius, resolution));

const method$t = function (radius, resolution) { return offset(this, radius, resolution); };
Shape.prototype.offset = method$t;

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

const orient = ({ center = [0, 0, 0], facing = [0, 0, 1], at = [0, 0, 0], from = [0, 0, 0] }, shape) => {
  const normalizedFacing = normalize(facing);
  const normalizedAt = normalize(subtract(at, from));

  const angle = Math.acos(dot(normalizedFacing, normalizedAt)) * 180 / Math.PI;
  const axis = normalize(cross(normalizedFacing, normalizedAt));

  return shape
      .move(negate(center))
      .rotate(angle, axis)
      .move(from);
};

const method$u = function (options = {}) { return orient(options, this); };

Shape.prototype.orient = method$u;

const pack = (options = {}, ...shapes) => {
  const [packed, unpacked] = pack$1(options, ...shapes.map(shape => shape.toKeptGeometry()));
  return [packed.map(geometry => Shape.fromGeometry(geometry)),
          unpacked.map(geometry => Shape.fromGeometry(geometry))];
};

/**
 *
 * # Read Data Stitch Tajima
 *
 * ::: illustration { "view": { "position": [0, 0, 200] } }
 * ```
 * await readDst({ path: 'dst/atg-sft003.dst',
 *               sources: [{ file: 'dst/atg-sft003.dst' },
 *                         { url: 'https://jsxcad.js.org/dst/atg-sft003.dst' }] })
 * ```
 * :::
 * ::: illustration { "view": { "position": [0, 0, 20] } }
 * ```
 * await readDst({ path: 'dst/atg-sft003.dst',
 *                 sources: [{ file: 'dst/atg-sft003.dst' },
 *                           { url: 'https://jsxcad.js.org/dst/atg-sft003.dst' }] })
 * ```
 * :::
 *
 **/

const readDst = async (options) => {
  if (typeof options === 'string') {
    options = { path: options };
  }
  const { path } = options;
  let data = await readFile({ as: 'bytes' }, `source/${path}`);
  if (data === undefined) {
    data = await readFile({ as: 'bytes', sources: getSources(`cache/${path}`), ...options }, `cache/${path}`);
  }
  return Shape.fromGeometry(await fromDst(options, data));
};

const readDxf = async (options) => {
  if (typeof options === 'string') {
    options = { path: options };
  }
  const { path } = options;
  let data = await readFile({ as: 'utf8', ...options }, `source/${path}`);
  if (data === undefined) {
    data = await readFile({ as: 'utf8', sources: getSources(`cache/${path}`), ...options }, `cache/${path}`);
  }
  return Shape.fromGeometry(await fromDxf(options, data));
};

/**
 *
 * # Read LDraw Parts
 *
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * await readLDraw({ part: '3004.dat' })
 * ```
 * :::
 *
 **/

const readLDraw = async (options) => {
  if (typeof options === 'string') {
    options = { path: options };
  }
  const { path } = options;
  return Shape.fromGeometry(await fromLDraw({ sources: getSources(`cache/${path}`), ...options }));
};

/**
 *
 * # Read PNG
 *
 **/

const readPng = async (options) => {
  if (typeof options === 'string') {
    options = { path: options };
  }
  const { path } = options;
  let data = await readFile({ as: 'bytes', ...options }, `source/${path}`);
  if (data === undefined) {
    data = await readFile({ as: 'bytes', sources: getSources(`cache/${path}`), ...options }, `cache/${path}`);
  }
  const raster = await fromPng({}, data);
  return raster;
};

/**
 *
 * # Write Shape Geometry
 *
 * This writes a shape as a tagged geometry in json format.
 *
 * ::: illustration { "view": { "position": [5, 5, 5] } }
 * ```
 * await Cube().writeShape('cube.shape');
 * await readShape({ path: 'cube.shape' })
 * ```
 * :::
 *
 **/

const cacheShape = async (options, shape) => {
  const { path } = options;
  const geometry = shape.toGeometry();
  await writeFile({}, `cache/${path}`, JSON.stringify(geometry));
};

const writeShape = async (options, shape) => {
  if (typeof options === 'string') {
    options = { path: options };
  }
  const { path } = options;
  const geometry = shape.toGeometry();
  await writeFile({}, `output/${path}`, JSON.stringify(geometry));
  await writeFile({}, `geometry/${path}`, JSON.stringify(geometry));
};

const method$v = function (options = {}) { return writeShape(options, this); };

Shape.prototype.writeShape = method$v;

/**
 *
 * # Read Shape Geometry
 *
 * This reads tagged geometry in json format and produces a shape.
 *
 * ::: illustration { "view": { "position": [5, 5, 5] } }
 * ```
 * await Cube().writeShape({ path: 'geometry/cube' })
 * await readShape({ path: 'geometry/cube' })
 * ```
 * :::
 *
 * A shape building function can be supplied to generate the shape to read if absent.
 *
 * The second read will not call the build function, and it will be present in re-runs.
 *
 * This allows the caching of complex geometry for fast recomposition.
 *
 * ::: illustration { "view": { "position": [5, 5, 5] } }
 * ```
 * await readShape({ path: 'geometry/sphere' }, () => Sphere())
 * await readShape({ path: 'geometry/sphere' }, () => Sphere())
 * ```
 * :::
 *
 **/

const readShape = async (options, build) => {
  if (typeof options === 'string') {
    options = { path: options };
  }
  const { ephemeral, path } = options;

  let data = await readFile({ as: 'utf8', ...options }, `source/${path}`);
  if (data === undefined) {
    data = await readFile({ as: 'utf8', sources: getSources(`cache/${path}`), ...options }, `cache/${path}`);
  }

  if (data === undefined && build !== undefined) {
    const shape = await build();
    if (!ephemeral) {
      await cacheShape(options, shape);
    }
    return shape;
  }
  const geometry = JSON.parse(data);
  return Shape.fromGeometry(geometry);
};

/**
 *
 * # Read Shapefile
 *
 * ::: illustration { "view": { "position": [0, 0, 100] } }
 * ```
 *
 * await readShapefile({ shpPath: 'ne_50m_admin_0_countries.shp', dbfPath: 'ne_50m_admin_0_countries.dbf' });
 * ```
 * :::
 *
 **/

const readShapefile = async (options) => {
  const { shpPath, dbfPath } = options;
  let shpData = await readFile({ as: 'bytes', ...options }, `source/${shpPath}`);
  if (shpData === undefined) {
    shpData = await readFile({ as: 'bytes', sources: getSources(`cache/${shpPath}`), ...options }, `cache/${shpPath}`);
  }
  let dbfData = await readFile({ as: 'bytes', ...options }, `source/${dbfPath}`);
  if (dbfData === undefined) {
    dbfData = await readFile({ as: 'bytes', sources: getSources(`cache/${dbfPath}`), ...options }, `cache/${dbfPath}`);
  }
  return Shape.fromGeometry(await fromShapefile(options, shpData, dbfData));
};

/**
 *
 * # Read STL
 *
 * ::: illustration { "view": { "position": [100, 100, 100] } }
 * ```
 * await readStl({ path: 'stl/teapot.stl',
 *                 format: 'ascii',
 *                 sources: [{ file: 'stl/teapot.stl' },
 *                           { url: 'https://jsxcad.js.org/stl/teapot.stl' }] })
 * ```
 * :::
 *
 **/

const formatToAs = (format) => {
  switch (format) {
    case 'binary': return 'bytes';
    case 'ascii':
    default: return 'utf8';
  }
};

const readStl = async (options) => {
  if (typeof options === 'string') {
    options = { path: options };
  }
  const { path, format = 'ascii' } = options;
  const as = formatToAs(format);
  let data = await readFile({ as, ...options }, `source/${path}`);
  if (data === undefined) {
    data = await readFile({ as, sources: getSources(`cache/${path}`), ...options }, `cache/${path}`);
  }
  return Shape.fromGeometry(await fromStl(options, data));
};

/**
 *
 * # Read Scalable Vector Format
 *
 * ::: illustration { "view": { "position": [0, 0, 100] } }
 * ```
 *
 * const svg = await readSvg({ path: 'svg/butterfly.svg',
 *                             sources: [{ file: 'svg/butterfly.svg' },
 *                                       { url: 'https://jsxcad.js.org/svg/butterfly.svg' }] });
 * svg.center().scale(0.02)
 * ```
 * :::
 *
 **/

const readSvg = async (options) => {
  if (typeof options === 'string') {
    options = { path: options };
  }
  const { path } = options;
  let data = await readFile({ decode: 'utf8', ...options }, `source/${path}`);
  if (data === undefined) {
    data = await readFile({ decode: 'utf8', sources: getSources(`cache/${path}`), ...options }, `cache/${path}`);
  }
  return Shape.fromGeometry(await fromSvg(options, data));
};

/**
 *
 * # Read SVG path data
 *
 **/

const readSvgPath = async (options) => {
  if (typeof options === 'string') {
    options = { path: options };
  }
  const { path } = options;
  let data = await readFile({ decode: 'utf8', ...options }, `source/${path}`);
  if (data === undefined) {
    data = await readFile({ decode: 'utf8', sources: getSources(`cache/${path}`), ...options }, `cache/${path}`);
  }
  return Shape.fromGeometry(await fromSvgPath(options, data));
};

/**
 *
 * # Right
 *
 * Moves the shape so that it is just to the right of the origin.
 *
 * ::: illustration { "view": { "position": [-40, -40, 40] } }
 * ```
 * assemble(Cube(10).right(),
 *          Cylinder(2, 15))
 * ```
 * :::
 * ::: illustration { "view": { "position": [-40, -40, 40] } }
 * ```
 * Cube(10).right(Sphere(5))
 * ```
 * :::
 **/

const X$2 = 0;

const fromOrigin$3 = (shape) => {
  const [minPoint] = measureBoundingBox(shape);
  return moveX(shape, -minPoint[X$2]);
};

const fromReference$2 = (shape, reference) => {
  const [minPoint] = measureBoundingBox(shape);
  const [, maxRefPoint] = measureBoundingBox(reference);
  return assemble(reference, moveX(shape, maxRefPoint[X$2] - minPoint[X$2]));
};

const right = dispatch(
  'right',
  // right(Cube())
  (shape, ...rest) => {
    assertShape(shape);
    assertEmpty(rest);
    return () => fromOrigin$3(shape);
  },
  // right(Cube(), Sphere())
  (shape, reference) => {
    assertShape(shape);
    assertShape(reference);
    return () => fromReference$2(shape, reference);
  });

const method$w = function (...params) { return right(this, ...params); };

Shape.prototype.right = method$w;

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

const rotate = (shape, axis, angle) => shape.transform(fromRotation(angle * 0.017453292519943295, axis));

const method$x = function (angle, axis) { return rotate(this, axis, angle); };

Shape.prototype.rotate = method$x;

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

const rotateX = (shape, angle) => shape.transform(fromXRotation(angle * 0.017453292519943295));

const method$y = function (angle) { return rotateX(this, angle); };

Shape.prototype.rotateX = method$y;

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

const rotateY = (shape, angle) => shape.transform(fromYRotation(angle * 0.017453292519943295));

const method$z = function (angle) { return rotateY(this, angle); };

Shape.prototype.rotateY = method$z;

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

const rotateZ = (shape, angle) => shape.transform(fromZRotation(angle * 0.017453292519943295));

const method$A = function (angle) { return rotateZ(this, angle); };

Shape.prototype.rotateZ = method$A;

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

const method$B = function (factor) { return scale(factor, this); };

Shape.prototype.scale = method$B;

/**
 *
 * # Section
 *
 * Produces a cross-section of a solid as a surface.
 *
 * ::: illustration { "view": { "position": [40, 40, 60] } }
 * ```
 * difference(Cylinder(10, 10),
 *            Cylinder(8, 10))
 * ```
 * :::
 * ::: illustration
 * ```
 * difference(Sphere(10),
 *            Sphere(8))
 *   .section()
 * ```
 * :::
 * ::: illustration
 * ```
 * difference(Sphere(10),
 *            Sphere(8))
 *   .section()
 *   .outline()
 * ```
 * :::
 *
 **/

const section = (solidShape, surfaceShape = Z(0)) => {
  const sections = [];
  for (const { surface, z0Surface } of getAnySurfaces(surfaceShape.toKeptGeometry())) {
    const anySurface = surface || z0Surface;
    const shapes = [];
    const plane = toPlane$1(anySurface);
    for (const { solid } of getSolids(solidShape.toKeptGeometry())) {
      const surface = retessellate(section$1(solid, anySurface));
      surface.plane = plane;
      shapes.push(Shape.fromGeometry({ surface }));
    }
    sections.push(union(...shapes));
  }
  return assemble(...sections);
};

const method$C = function (surface) { return section(this, surface); };

Shape.prototype.section = method$C;

const solids = (shape, xform = (_ => _)) => {
  const solids = [];
  for (const solid of getSolids(shape.toKeptGeometry())) {
    solids.push(xform(Shape.fromGeometry(solid)));
  }
  return solids;
};

const solidsMethod = function (...args) { return solids(this, ...args); };
Shape.prototype.solids = solidsMethod;

const source = (path, source) => addSource(`cache/${path}`, source);

/**
 *
 * # Specify
 *
 * Encapsulates a geometry as a discrete item.
 *
 **/

// DEPRECATED: See 'Item'.
const specify = (specification, ...shapes) => {
  shapes = shapes.filter(shape => shape !== undefined);
  let geometry;
  switch (shapes.length) {
    case 0: {
      geometry = specify$1({ assembly: [] });
      break;
    }
    case 1: {
      geometry = specify$1(toGeometry(shapes[0]));
      break;
    }
    default: {
      geometry = specify$1({ assembly: shapes.map(toGeometry) });
      break;
    }
  }
  return Shape.fromGeometry(rewriteTags([`item/${JSON.stringify(specification)}`], [], geometry));
};

const method$D = function (specification) { return specify(specification, this); };
Shape.prototype.specify = method$D;

/**
 *
 * # Stretch
 *
 **/

const stretch = (shape, length, planeShape = Z(0)) => {
  const stretches = [];
  for (const { surface, z0Surface } of getAnySurfaces(planeShape.toKeptGeometry())) {
    const planeSurface = surface || z0Surface;
    for (const { solid, tags } of getSolids(shape.toKeptGeometry())) {
      const bottom = cutOpen(solid, planeSurface);
      const profile = section$1(solid, planeSurface);
      const top = cutOpen(solid, flip$1(planeSurface));
      const [toZ0, fromZ0] = toXYPlaneTransforms(toPlane$1(profile));
      const z0SolidGeometry = extrude$1(transform$2(toZ0, profile), length, 0, 1, 0, false);
      const middle = transform$3(fromZ0, z0SolidGeometry);
      const topMoved = transform$3(fromTranslation(scale$1(length, toPlane$1(profile))), top);
      stretches.push(Shape.fromGeometry({ solid: [...bottom, ...middle, ...topMoved], tags }));
    }
  }

  return assemble(...stretches);
};

const method$E = function (...args) { return stretch(this, ...args); };

Shape.prototype.stretch = method$E;

/**
 *
 * # Sweep
 *
 * Sweep a tool profile along a path, to produce a surface.
 *
 **/

// FIX: This is a weak approximation assuming a 1d profile -- it will need to be redesigned.
const sweep = (toolpath, tool) => {
  const chains = [];
  for (const { paths } of getPaths(toolpath.toKeptGeometry())) {
    for (const path of paths) {
      chains.push(chainHull(...path.map(point => tool.move(...point))));
    }
  }
  return union(...chains);
};

const method$F = function (tool) { return sweep(this, tool); };

Shape.prototype.sweep = method$F;
Shape.prototype.withSweep = function (tool) { return assemble(this, sweep(this, tool)); };

const tags = (shape) =>
  [...allTags(shape.toGeometry())]
      .filter(tag => tag.startsWith('user/'))
      .map(tag => tag.substring(5));

const method$G = function () { return tags(this); };

Shape.prototype.tags = method$G;

const toBillOfMaterial = (shape) => {
  const specifications = [];
  for (const { tags } of getItems(shape.toKeptGeometry())) {
    for (const tag of tags) {
      if (tag.startsWith('item/')) {
        const specification = tag.substring(5);
        specifications.push(specification);
      }
    }
  }
  return specifications;
};

const method$H = function (options = {}) { return toBillOfMaterial(this); };

Shape.prototype.toBillOfMaterial = method$H;

// DEPRECATED: See 'Shape.items'
const toItems = (shape) => getItems(shape.toKeptGeometry()).map(fromGeometry);

const method$I = function (options = {}) { return toItems(this); };

Shape.prototype.toItems = method$I;

// Return an assembly of paths so that each toolpath can have its own tag.
const toolpath = (shape, radius = 1, { overcut: overcut$1 = 0, joinPaths = false } = {}) =>
  Shape.fromGeometry({ paths: overcut(shape.outline().toKeptGeometry(), radius, overcut$1, joinPaths) });

const method$J = function (...options) { return toolpath(this, ...options); };

Shape.prototype.toolpath = method$J;
Shape.prototype.withToolpath = function (...args) { return assemble(this, toolpath(this, ...args)); };

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
  return shape.move(...negate(center))
      .rotate(axis, angle)
      .move(...center);
};

const turnMethod = function (angle, axis) { return turn(this, axis, angle); };
Shape.prototype.turn = turnMethod;

const turnX = (shape, angle) => {
  const center = shape.measureCenter();
  return shape.move(...negate(center))
      .rotateX(angle)
      .move(...center);
};

const turnXMethod = function (angle) { return turnX(this, angle); };
Shape.prototype.turnX = turnXMethod;

const turnY = (shape, angle) => {
  const center = shape.measureCenter();
  return shape.move(...negate(center))
      .rotateY(angle)
      .move(...center);
};

const turnYMethod = function (angle) { return turnY(this, angle); };
Shape.prototype.turnY = turnYMethod;

const turnZ = (shape, angle) => {
  const center = shape.measureCenter();
  return shape.move(...negate(center))
      .rotateZ(angle)
      .move(...center);
};

const turnZMethod = function (angle) { return turnZ(this, angle); };
Shape.prototype.turnZ = turnZMethod;

const X$3 = 0;
const Y$3 = 1;
const Z$6 = 2;

const voxels = ({ resolution = 1 }, shape) => {
  const offset = resolution / 2;
  const voxels = [];
  for (const { solid, tags } of getSolids(shape.toKeptGeometry())) {
    const [min, max] = measureBoundingBox$2(solid);
    const bsp = fromSolid(solid);
    const polygons = [];
    for (let x = min[X$3] - offset; x <= max[X$3] + offset; x += resolution) {
      for (let y = min[Y$3] - offset; y <= max[Y$3] + offset; y += resolution) {
        for (let z = min[Z$6] - offset; z <= max[Z$6] + offset; z += resolution) {
          const state = containsPoint(bsp, [x, y, z]);
          if (state !== containsPoint(bsp, [x + resolution, y, z])) {
            const face = [[x + offset, y - offset, z - offset],
                          [x + offset, y + offset, z - offset],
                          [x + offset, y + offset, z + offset],
                          [x + offset, y - offset, z + offset]];
            polygons.push(state ? face : face.reverse());
          }
          if (state !== containsPoint(bsp, [x, y + resolution, z])) {
            const face = [[x - offset, y + offset, z - offset],
                          [x + offset, y + offset, z - offset],
                          [x + offset, y + offset, z + offset],
                          [x - offset, y + offset, z + offset]];
            polygons.push(state ? face.reverse() : face);
          }
          if (state !== containsPoint(bsp, [x, y, z + resolution])) {
            const face = [[x - offset, y - offset, z + offset],
                          [x + offset, y - offset, z + offset],
                          [x + offset, y + offset, z + offset],
                          [x - offset, y + offset, z + offset]];
            polygons.push(state ? face : face.reverse());
          }
        }
      }
    }
    voxels.push(Shape.fromGeometry({ solid: fromPolygons({}, polygons), tags }));
  }
  return assemble(...voxels);
};

const method$K = function ({ resolution = 1 } = {}) { return voxels({ resolution }, this); };

Shape.prototype.voxels = method$K;

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

/**
 *
 * # Wireframe
 *
 * Generates a set of paths outlining a solid.
 *
 * ::: illustration { "view": { "position": [-40, -40, 40] } }
 * ```
 * Cube(10).wireframe()
 * ```
 * :::
 * ::: illustration { "view": { "position": [-40, -40, 40] } }
 * ```
 * Sphere(10).wireframe()
 * ```
 * :::
 *
 **/

const wireframe = (options = {}, shape) => {
  const pieces = [];
  for (const { solid } of getSolids(shape.toKeptGeometry())) {
    pieces.push(toWireframeFromSolid(solid));
  }
  for (const { surface } of getSurfaces(shape.toKeptGeometry())) {
    pieces.push(toWireframeFromSurface(surface));
  }
  for (const { z0Surface } of getZ0Surfaces(shape.toKeptGeometry())) {
    pieces.push(toWireframeFromSurface(z0Surface));
  }
  return assemble(...pieces);
};

const method$L = function (options) { return wireframe(options, this); };

Shape.prototype.wireframe = method$L;
Shape.prototype.withWireframe = function (options) { return assemble(this, wireframe(options, this)); };

/**
 *
 * # Write DXF
 *
 * ```
 * Cube().section().writeDxf('cube.dxf');
 * ```
 *
 **/

const writeDxf = async (options, shape) => {
  if (typeof options === 'string') {
    // Support writeDxf('foo', bar);
    options = { path: options };
  }
  const { path } = options;
  const geometry = shape.toKeptGeometry();
  const dxf = await toDxf({ preview: true, ...options }, geometry);
  await writeFile({}, `output/${path}`, dxf);
  await writeFile({}, `geometry/${path}`, JSON.stringify(geometry));
};

const method$M = function (options = {}) { return writeDxf(options, this); };

Shape.prototype.writeDxf = method$M;

/**
 *
 * # Write G-Code
 *
 * ```
 * Square().toolpath(0.5).writeGcode('cube.pdf');
 * ```
 *
 **/

const writeGcode = async (options, shape) => {
  if (typeof options === 'string') {
    // Support writeGcode('foo', bar);
    options = { path: options };
  }
  const { path } = options;
  const geometry = shape.toKeptGeometry();
  const gcode = await toGcode({ preview: true, ...options }, geometry);
  await writeFile({}, `output/${path}`, gcode);
  await writeFile({}, `geometry/${path}`, JSON.stringify(geometry));
};

const method$N = function (options = {}) { return writeGcode(options, this); };

Shape.prototype.writeGcode = method$N;

/**
 *
 * # Write PDF
 *
 * ```
 * Cube().section().writePdf('cube.pdf');
 * ```
 *
 **/

const writePdf = async (options, shape) => {
  if (typeof options === 'string') {
    // Support writePdf('foo', bar);
    options = { path: options };
  }
  const { path } = options;
  const geometry = shape.toKeptGeometry();
  const pdf = await toPdf({ preview: true, ...options }, geometry);
  await writeFile({}, `output/${path}`, pdf);
  await writeFile({}, `geometry/${path}`, JSON.stringify(geometry));
};

const method$O = function (options = {}) { return writePdf(options, this); };

Shape.prototype.writePdf = method$O;

/**
 *
 * # Write STL
 *
 * ::: illustration { "view": { "position": [5, 5, 5] } }
 * ```
 * await Cube().writeStl('cube.stl');
 * await readStl({ path: 'cube.stl' });
 * ```
 * :::
 *
 **/

const writeStl = async (options, shape) => {
  if (typeof options === 'string') {
    options = { path: options };
  }
  const { path } = options;
  const geometry = shape.toKeptGeometry();
  await writeFile({}, `output/${path}`, toStl(options, geometry));
  await writeFile({}, `geometry/${path}`, JSON.stringify(geometry));
};

const method$P = function (options = {}) { return writeStl(options, this); };

Shape.prototype.writeStl = method$P;

/**
 *
 * # Write SVG
 *
 * ::: illustration
 * ```
 * await Cube().section().writeSvg('svg/cube1.svg');
 * await readSvg({ path: 'svg/cube1.svg' })
 * ```
 * :::
 *
 **/

const writeSvg = async (options, shape) => {
  if (typeof options === 'string') {
    options = { path: options };
  }
  const { path } = options;
  const geometry = shape.toKeptGeometry();
  await writeFile({}, `output/${path}`, toSvg(options, geometry));
  await writeFile({}, `geometry/${path}`, JSON.stringify(geometry));
};

const method$Q = function (options = {}) { return writeSvg(options, this); };

Shape.prototype.writeSvg = method$Q;

/**
 *
 * # Write SVG Photo
 *
 * This takes a scene and a camera position and generates a two-dimensional SVG representation
 * as a svg tag.
 *
 * Note: Illustrations broken due to scaling issue affecting readSvg.
 *
 * ::: illustration { "view": { "position": [0, -1, 2500] } }
 * ```
 * await Cube().writeSvgPhoto({ path: 'svg/cube3.svg', view: { position: [10, 10, 10], target: [0, 0, 0] } });
 * await readSvg({ path: 'svg/cube3.svg' })
 * ```
 * :::
 *
 **/

const writeSvgPhoto = async (options, shape) => {
  if (typeof options === 'string') {
    options = { path: options };
  }
  const { path } = options;
  const geometry = shape.toKeptGeometry();
  await writeFile({}, `output/${path}`, toSvg$1(options, geometry));
  await writeFile({}, `geometry/${path}`, JSON.stringify(geometry));
};

const method$R = function (options = {}) { return writeSvgPhoto(options, this); };

Shape.prototype.writeSvgPhoto = method$R;

const writeThreejsPage = async (options, shape) => {
  if (typeof options === 'string') {
    options = { path: options };
  }
  const { path } = options;
  const geometry = shape.toKeptGeometry();
  await writeFile({}, `output/${path}`, toThreejsPage(options, geometry));
  await writeFile({}, `geometry/${path}`, JSON.stringify(geometry));
};

const method$S = function (options = {}) { return writeThreejsPage(options, this); };

Shape.prototype.writeThreejsPage = method$S;

/**
 *
 * Defines the interface used by the api to access the rest of the system on
 * behalf of a user. e.g., algorithms and geometries.
 *
 * A user can destructively update this mapping in their code to change what
 * the api uses.
 */

const methods = [
  above,
  back,
  below,
  center,
  chop,
  color,
  connect,
  connector,
  connectors,
  contract,
  drop,
  ease,
  expand,
  extrude,
  front,
  getPathsets,
  flat,
  interior,
  kept,
  left,
  material,
  measureBoundingBox,
  measureCenter,
  move,
  moveX,
  moveY,
  moveZ,
  nocut,
  offset,
  orient,
  outline,
  right,
  rotate,
  rotateX,
  rotateY,
  rotateZ,
  scale,
  section,
  shell,
  solids,
  specify,
  sweep,
  tags,
  toolpath,
  toBillOfMaterial,
  toItems,
  translate,
  turn,
  turnX,
  turnY,
  turnZ,
  keep,
  voxels,
  wireframe,
  writeDxf,
  writeGcode,
  writePdf,
  writeShape,
  writeStl,
  writeSvg,
  writeSvgPhoto,
  writeThreejsPage
];

if (methods.includes(undefined)) {
  throw Error('die');
}

export { Armature, Circle, Cone, Connector, Cube, Cursor, Cylinder, Font, Gear, Hershey, Hexagon, Icosahedron, Item, Label, Lego, Line, MicroGearMotor, Nail, Path, Plan, Point, Points, Polygon, Polyhedron, Prism, Shape, Sphere, Spiral, Square, SvgPath, Tetrahedron, ThreadedRod, Torus, Triangle, Wave, X, Y, Z, acos, ask, assemble, chainHull, coordinates, cos, difference, ease, flat, hull, importModule, intersection, join, lathe, log, max, minkowski, numbers, pack, readDst, readDxf, readFont, readLDraw, readPng, readShape, readShapefile, readStl, readSvg, readSvgPath, rejoin, shell, sin, source, specify, sqrt, stretch, union };
