import { concatenate, rotateZ, translate } from './jsxcad-geometry-path.js';
import Shape, { difference, intersection } from './jsxcad-api-v1-shape.js';
import { numbers, linear } from './jsxcad-api-v1-math.js';
import { buildRegularPolygon, toRadiusFromApothem as toRadiusFromApothem$1, regularPolygonEdgeLengthToRadius, buildPolygonFromPoints, buildRegularPrism, buildFromFunction, buildFromSlices, buildRegularIcosahedron, buildRingSphere, buildRegularTetrahedron } from './jsxcad-algorithm-shape.js';
import { getAnySurfaces, getPaths, rewriteTags } from './jsxcad-geometry-tagged.js';

/**
 *
 * # Spiral
 *
 * These take a function mapping angle to radius.
 *
 * ::: illustration { "view": { "position": [0, 0, 10] } }
 * ```
 * Spiral(angle => [angle],
 *        { to: 360 * 5 });
 * ```
 * :::
 * ::: illustration { "view": { "position": [0, 0, 10] } }
 * ```
 * Spiral({ to: 360 },
 *        (angle) => [[2 + sin(angle * 20)]])
 *   .close()
 *   .interior()
 * ```
 * :::
 **/

const Spiral = (toPathFromAngle = (angle => [[angle]]), { from = 0, to = 360, by, resolution } = {}) => {
  if (by === undefined && resolution === undefined) {
    by = 1;
  }
  let path = [null];
  for (const angle of numbers(angle => angle, { from, to, by, resolution })) {
    const radians = angle * Math.PI / 180;
    const subpath = toPathFromAngle(angle);
    path = concatenate(path, rotateZ(radians, subpath));
  }
  return Shape.fromPath(path);
};

const ofRadius = (radius, angle = 360, { start = 0, sides = 32 } = {}) =>
  Spiral(a => [[radius]], { from: start, to: start + angle, resolution: sides });

const Arc = (...args) => ofRadius(...args);
Arc.ofRadius = ofRadius;

const Assembly = (...shapes) => Shape.fromGeometry({ assembly: shapes.map(shape => shape.toGeometry()) });

const unitPolygon = (sides = 16) => Shape.fromGeometry(buildRegularPolygon(sides));

// Note: radius here is circumradius.
const toRadiusFromEdge = (edge, sides) => edge * regularPolygonEdgeLengthToRadius(1, sides);

const ofRadius$1 = (radius, { sides = 16 } = {}) => unitPolygon(sides).scale(radius);
const ofEdge = (edge, { sides = 16 }) => ofRadius$1(toRadiusFromEdge(edge, sides), { sides });
const ofApothem = (apothem, { sides = 16 }) => ofRadius$1(toRadiusFromApothem$1(apothem, sides), { sides });
const ofDiameter = (diameter, ...args) => ofRadius$1(diameter / 2, ...args);
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

const Polygon = (...args) => ofRadius$1(...args);

Polygon.ofEdge = ofEdge;
Polygon.ofApothem = ofApothem;
Polygon.ofRadius = ofRadius$1;
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

const ofRadius$2 = (radius = 1, { sides = 32 } = {}) => Polygon.ofRadius(radius, { sides });

const ofApothem$1 = (apothem = 1, { sides = 32 } = {}) => Polygon.ofApothem(apothem, { sides });

const ofDiameter$1 = (diameter = 1, { sides = 32 } = {}) => Polygon.ofDiameter(diameter, { sides });

const Circle = (...args) => ofRadius$2(...args);

Circle.ofEdge = ofEdge$1;
Circle.ofApothem = ofApothem$1;
Circle.ofRadius = ofRadius$2;
Circle.ofDiameter = ofDiameter$1;
Circle.toRadiusFromApothem = (radius = 1, sides = 32) => Polygon.toRadiusFromApothem(radius, sides);

Circle.signature = 'Circle(radius:number = 1, { sides:number = 32 }) -> Shape';
ofEdge$1.signature = 'Circle.ofEdge(edge:number = 1, { sides:number = 32 }) -> Shape';
ofRadius$2.signature = 'Circle.ofRadius(radius:number = 1, { sides:number = 32 }) -> Shape';
ofApothem$1.signature = 'Circle.ofApothem(apothem:number = 1, { sides:number = 32 }) -> Shape';
ofDiameter$1.signature = 'Circle.ofDiameter(diameter:number = 1, { sides:number = 32 }) -> Shape';

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

const ofRadius$3 = (radius = 1, height = 1, { sides = 3 } = {}) => buildPrism(radius, height, sides);
const ofDiameter$2 = (diameter = 1, ...args) => ofRadius$3(diameter / 2, ...args);

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

const Prism = (...args) => ofRadius$3(...args);

Prism.ofRadius = ofRadius$3;
Prism.ofDiameter = ofDiameter$2;
Prism.ofFunction = ofFunction;
Prism.ofSlices = ofSlices;

const ofRadius$4 = (radius = 1, height = 1, { sides = 32 } = {}) => {
  const fn = linear(radius, 0);
  return Prism.ofSlices(t => Circle(fn(t) * radius, { sides }).moveZ(t * height));
};

const ofDiameter$3 = (diameter, ...args) => ofRadius$4(diameter / 2, ...args);
const ofApothem$2 = (apothem, ...args) => ofRadius$4(toRadiusFromApothem$1(apothem), ...args);

const Cone = (...args) => ofRadius$4(...args);

Cone.ofRadius = ofRadius$4;
Cone.ofDiameter = ofDiameter$3;
Cone.ofApothem = ofApothem$2;

Cone.signature = 'Cone(radius:number, height:number, { sides:number = 32 }) -> Shape';
Cone.ofRadius.signature = 'Cone.ofRadius(radius:number, height:number, { sides:number = 32 }) -> Shape';
Cone.ofDiameter.signature = 'Cone.ofDiameter(diameter:number, height:number, { sides:number = 32 }) -> Shape';
Cone.ofApothem.signature = 'Cone.ofApothem(apothem:number, height:number, { sides:number = 32 }) -> Shape';

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

const ofSize = (width = 1, length, height) =>
  unitCube().scale([width,
                    length === undefined ? width : length,
                    height === undefined ? width : height]);

const ofRadius$5 = (radius) => Shape.fromGeometry(buildRegularPrism(4))
    .rotateZ(45)
    .scale([radius, radius, radius / edgeScale]);

const ofApothem$3 = (apothem) => ofRadius$5(toRadiusFromApothem$1(apothem, 4));

const ofDiameter$4 = (diameter) => ofRadius$5(diameter / 2);

const fromCorners = (corner1, corner2) => {
  const [c1x, c1y, c1z] = corner1;
  const [c2x, c2y, c2z] = corner2;
  const length = c2x - c1x;
  const width = c2y - c1y;
  const height = c2z - c1z;
  const center = [(c1x + c2x) / 2, (c1y + c2y) / 2, (c1z + c2z) / 2];
  return unitCube().scale([length, width, height]).move(...center);
};

const Cube = (...args) => ofSize(...args);

Cube.ofSize = ofSize;
Cube.ofRadius = ofRadius$5;
Cube.ofApothem = ofApothem$3;
Cube.ofDiameter = ofDiameter$4;
Cube.fromCorners = fromCorners;

Cube.signature = 'Cube(size:number = 1) -> Shape';
Cube.ofSize.signature = 'Cube.ofSize(width:number = 1, length:number = 1, height:number = 1) -> Shape';
Cube.ofRadius.signature = 'Cube.ofRadius(radius:number = 1) -> Shape';
Cube.ofApothem.signature = 'Cube.ofApothem(apothem:number = 1) -> Shape';
Cube.ofDiameter.signature = 'Cube.ofDiameter(diameter:number = 1) -> Shape';
Cube.fromCorners.signature = 'Cube.fromCorners(corner1:point, corner2:point) -> Shape';

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

const ofRadius$6 = (radius = 1, height = 1, { sides = 32 } = {}) => buildPrism$1(radius, height, sides);
const ofApothem$4 = (apothem = 1, height = 1, { sides = 32 } = {}) => ofRadius$6(toRadiusFromApothem$1(apothem, sides), height, { sides });
const ofDiameter$5 = (diameter = 1, ...args) => ofRadius$6(diameter / 2, ...args);

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

const Cylinder = (...args) => ofRadius$6(...args);

Cylinder.ofRadius = ofRadius$6;
Cylinder.ofApothem = ofApothem$4;
Cylinder.ofDiameter = ofDiameter$5;
Cylinder.ofFunction = ofFunction$1;
Cylinder.ofSlices = ofSlices$1;

Cylinder.signature = 'Cylinder(radius:number = 1, height:number = 1, { sides:number = 32 }) -> Shape';
Cylinder.ofRadius.signature = 'Cylinder.ofRadius(radius:number = 1, height:number = 1, { sides:number = 32 }) -> Shape';
Cylinder.ofDiameter.signature = 'Cylinder.ofDiameter(radius:number = 1, height:number = 1, { sides:number = 32 }) -> Shape';
Cylinder.ofApothem.signature = 'Cylinder.ofApothem(radius:number = 1, height:number = 1, { sides:number = 32 }) -> Shape';
Cylinder.ofSlices.signature = 'Cylinder.ofSlices(op:function, { slices:number = 2, cap:boolean = true }) -> Shape';
Cylinder.ofFunction.signature = 'Cylinder.ofFunction(op:function, { resolution:number, cap:boolean = true, context:Object }) -> Shape';

const Difference = (...args) => difference(...args);

const Empty = (...shapes) => Shape.fromGeometry({ disjointAssembly: [{ solid: [] }, { surface: [] }, { paths: [] }] });

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

const ofEdge$2 = (edge = 1) => Polygon.ofEdge(edge, { sides: 6 });
const ofApothem$5 = (apothem = 1) => Polygon.ofApothem(apothem, { sides: 6 });
const ofRadius$7 = (radius = 1) => Polygon.ofRadius(radius, { sides: 6 });
const ofDiameter$6 = (diameter = 1) => Polygon.ofDiameter(diameter, { sides: 6 });

const Hexagon = (...args) => ofRadius$7(...args);

Hexagon.ofRadius = ofRadius$7;
Hexagon.ofEdge = ofEdge$2;
Hexagon.ofApothem = ofApothem$5;
Hexagon.ofRadius = ofRadius$7;
Hexagon.ofDiameter = ofDiameter$6;

Hexagon.signature = 'Hexagon(radius:number = 1) -> Shape';
Hexagon.ofRadius.signature = 'Hexagon.ofRadius(radius:number = 1) -> Shape';
Hexagon.ofDiameter.signature = 'Hexagon.ofDiameter(diameter:number = 1) -> Shape';
Hexagon.ofApothem.signature = 'Hexagon.ofApothem(apothem:number = 1) -> Shape';
Hexagon.ofEdge.signature = 'Hexagon.ofEdge(edge:number = 1) -> Shape';

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

const ofRadius$8 = (radius = 1) => unitIcosahedron().scale(radius);
const ofDiameter$7 = (diameter = 1) => unitIcosahedron().scale(diameter / 2);
const Icosahedron = (...args) => ofRadius$8(...args);

Icosahedron.ofRadius = ofRadius$8;
Icosahedron.ofDiameter = ofDiameter$7;

Icosahedron.signature = 'Icosahedron(radius:number = 1) -> Shape';
Icosahedron.ofRadius.signature = 'Icosahedron.ofRadius(radius:number = 1) -> Shape';
Icosahedron.ofDiameter.signature = 'Icosahedron.ofDiameter(diameter:number = 1) -> Shape';

const Intersection = (...args) => intersection(...args);

const Layers = (...shapes) => Shape.fromGeometry({ layers: shapes.map(shape => shape.toGeometry()) });

const fromPoints = (...points) => Shape.fromOpenPath(points.map(([x = 0, y = 0, z = 0]) => [x, y, z]));

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

const Path = (...points) => fromPoints(...points);
Path.fromPoints = fromPoints;

Path.signature = 'Path(...points:Point) -> Shape';
Path.fromPoints.signature = 'Path.fromPoints(...points:Point) -> Shape';

const Line = (length) => Path([0, 0, length / -2], [0, 0, length / 2]);

Line.signature = 'Line(length:number) -> Shape';

const fromPoint = (x = 0, y = 0, z = 0) => Shape.fromPoint([x, y, z]);
const Point = (...args) => fromPoint(...args);
Point.fromPoint = fromPoint;

Point.signature = 'Point(point:Point) -> Shape';

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

const Points = (...args) => fromPoints$1(...args);
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

// FIX: This name is confusing wrt Shape.sketch().
const Sketch = (shape) => shape.Void().with(shape.sketch());

const SketchMethod = function () { return Sketch(this); };
Shape.prototype.Sketch = SketchMethod;

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

const ofRadius$9 = (radius = 1, { resolution = 16 } = {}) => unitSphere(resolution).scale(radius);
const ofApothem$6 = (apothem = 1, { resolution = 16 } = {}) => ofRadius$9(toRadiusFromApothem$1(apothem), { resolution });
const ofDiameter$8 = (diameter = 1, { resolution = 16 } = {}) => ofRadius$9(diameter / 2, { resolution });

const Sphere = (...args) => ofRadius$9(...args);

Sphere.ofApothem = ofApothem$6;
Sphere.ofRadius = ofRadius$9;
Sphere.ofDiameter = ofDiameter$8;

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

const ofSize$1 = (width = 1, length) => unitSquare().scale([width, length === undefined ? width : length, 1]);
const ofRadius$a = (radius) => Shape.fromGeometry(buildRegularPolygon(4)).rotateZ(45).scale(radius);
const ofApothem$7 = (apothem) => ofRadius$a(toRadiusFromApothem(apothem));
const ofDiameter$9 = (diameter) => ofRadius$a(diameter / 2);

const fromCorners$1 = (corner1, corner2) => {
  const [c1x, c1y] = corner1;
  const [c2x, c2y] = corner2;
  const length = c2x - c1x;
  const width = c2y - c1y;
  const center = [(c1x + c2x) / 2, (c1y + c2y) / 2];
  return unitSquare().scale([length, width]).translate(center);
};

const Square = (...args) => ofSize$1(...args);

Square.ofSize = ofSize$1;
Square.ofRadius = ofRadius$a;
Square.ofApothem = ofApothem$7;
Square.ofDiameter = ofDiameter$9;
Square.fromCorners = fromCorners$1;

Square.signature = 'Square(edge:number) -> Surface';
Square.ofApothem.signature = 'Square(apothem:number) -> Surface';
Square.ofDiameter.signature = 'Square(diameter:number) -> Surface';
Square.ofRadius.signature = 'Square(radius:number) -> Surface';
Square.ofSize.signature = 'Square(edge:number) -> Surface';
Square.fromCorners.signature = 'Square(corner1:Point, corner2:Point) -> Surface';

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

const ofRadius$b = (radius = 1) => unitTetrahedron().scale(radius);
const ofDiameter$a = (diameter = 1) => unitTetrahedron().scale(diameter / 2);

const Tetrahedron = (...args) => ofRadius$b(...args);

Tetrahedron.ofRadius = ofRadius$b;
Tetrahedron.ofDiameter = ofDiameter$a;

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

const Torus = (radius = 1, height = 1, { segments = 32, sides = 32, rotation = 0 } = {}) =>
  Circle(height / 2, { sides })
      .rotateZ(rotation)
      .moveY(radius)
      .Loop(360, { sides: segments })
      .rotateY(90);

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

const ofEdge$3 = (edge = 1) => Polygon.ofEdge(edge, { sides: 3 });
const ofApothem$8 = (apothem = 1) => Polygon.ofApothem(apothem, { sides: 3 });
const ofRadius$c = (radius = 1) => Polygon.ofRadius(radius, { sides: 3 });
const ofDiameter$b = (diameter = 1) => Polygon.ofDiameter(diameter, { sides: 3 });

const Triangle = (...args) => ofEdge$3(...args);

Triangle.ofEdge = ofEdge$3;
Triangle.ofApothem = ofApothem$8;
Triangle.ofRadius = ofRadius$c;
Triangle.ofDiameter = ofDiameter$b;

const Union = (...args) => Empty().add(...args);

const UnionMethod = function (...args) { return Union(this, ...args); };
Shape.prototype.Union = UnionMethod;

const Void = (shape) => Shape.fromGeometry(rewriteTags(['compose/non-positive'], [], shape.toGeometry()));

const VoidMethod = function () { return Void(this); };
Shape.prototype.Void = VoidMethod;

/**
 *
 * # Wave
 *
 * These take a function mapping X distance to Y distance.
 *
 * ::: illustration { "view": { "position": [0, 0, 10] } }
 * ```
 * Wave(angle => [[sin(angle) * 100]],
 *      { to: 360 });
 * ```
 * :::
 **/

const Wave = (toPathFromXDistance = (xDistance) => [[0]], { from = 0, to = 360, by, resolution } = {}) => {
  if (by === undefined && resolution === undefined) {
    by = 1;
  }
  let path = [null];
  for (const xDistance of numbers(distance => distance, { from, to, by })) {
    const subpath = toPathFromXDistance(xDistance);
    path = concatenate(path, translate([xDistance, 0, 0], subpath));
  }
  return Shape.fromPath(path);
};

const api = {
  Arc,
  Assembly,
  Circle,
  Cone,
  Cube,
  Cylinder,
  Difference,
  Empty,
  Hexagon,
  Icosahedron,
  Intersection,
  Layers,
  Line,
  Path,
  Point,
  Points,
  Polygon,
  Polyhedron,
  Prism,
  Sketch,
  Sphere,
  Spiral,
  Square,
  Tetrahedron,
  Torus,
  Triangle,
  Union,
  Void,
  Wave
};

export default api;
export { Arc, Assembly, Circle, Cone, Cube, Cylinder, Difference, Empty, Hexagon, Icosahedron, Intersection, Layers, Line, Path, Point, Points, Polygon, Polyhedron, Prism, Sketch, Sphere, Spiral, Square, Tetrahedron, Torus, Triangle, Union, Void, Wave };
