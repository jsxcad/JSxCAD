import Shape$1, { Shape, union, assemble, layer } from './jsxcad-api-v1-shape.js';
import { buildConvexSurfaceHull, buildConvexHull, loop, extrude as extrude$1, buildConvexMinkowskiSum } from './jsxcad-algorithm-shape.js';
import { Y as Y$1, Z as Z$3 } from './jsxcad-api-v1-connector.js';
import { getPaths, getZ0Surfaces, getSurfaces, getPlans, getAnySurfaces, outline as outline$1, getSolids, measureBoundingBox } from './jsxcad-geometry-tagged.js';
import { alignVertices, transform as transform$1, fromPolygons } from './jsxcad-geometry-solid.js';
import { toPlane as toPlane$1, transform, makeConvex, flip as flip$1 } from './jsxcad-geometry-surface.js';
import { toXYPlaneTransforms } from './jsxcad-math-plane.js';
import { intersectionOfPathsBySurfaces, outline as outline$2 } from './jsxcad-geometry-z0surface-boolean.js';
import { transform as transform$2 } from './jsxcad-geometry-paths.js';
import { isClosed, transform as transform$3, isCounterClockwise, flip } from './jsxcad-geometry-path.js';
import { section as section$1, cutOpen, fromSolid, containsPoint as containsPoint$1 } from './jsxcad-algorithm-bsp-surfaces.js';
import { createNormalize3 } from './jsxcad-algorithm-quantize.js';
import { toPlane as toPlane$2 } from './jsxcad-math-poly3.js';
import { fromTranslation } from './jsxcad-math-mat4.js';
import { scale } from './jsxcad-math-vec3.js';
import { overcut } from './jsxcad-algorithm-toolpath.js';

/**
 *
 * # Chained Hull
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

const Z = 2;

const ChainedHull = (...shapes) => {
  const pointsets = shapes.map(shape => shape.toPoints());
  const chain = [];
  for (let nth = 1; nth < pointsets.length; nth++) {
    const points = [...pointsets[nth - 1], ...pointsets[nth]];
    if (points.every(point => point[Z] === 0)) {
      chain.push(Shape.fromGeometry(buildConvexSurfaceHull(points)));
    } else {
      chain.push(Shape.fromGeometry(buildConvexHull(points)));
    }
  }
  return union(...chain);
};

const ChainedHullMethod = function (...args) { return ChainedHull(this, ...args); };
Shape.prototype.ChainedHull = ChainedHullMethod;

ChainedHull.signature = 'ChainedHull(...shapes:Shape) -> Shape';

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

const Z$1 = 2;

const Hull = (...shapes) => {
  const points = [];
  shapes.forEach(shape => shape.eachPoint(point => points.push(point)));
  // FIX: Detect planar hulls properly.
  if (points.every(point => point[Z$1] === 0)) {
    return Shape.fromGeometry(buildConvexSurfaceHull(points));
  } else {
    return Shape.fromGeometry(buildConvexHull(points));
  }
};

const HullMethod = function (...shapes) { return Hull(this, ...shapes); };
Shape.prototype.Hull = HullMethod;

Hull.signature = 'Hull(shape:Shape, ...shapes:Shape) -> Shape';
HullMethod.signature = 'Shape -> Hull(...shapes:Shape) -> Shape';

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

const Loop = (shape, endDegrees = 360, { sides = 32, pitch = 0 } = {}) => {
  const profile = shape.chop(Y$1(0));
  const outline = profile.outline();
  const solids = [];
  for (const geometry of getPaths(outline.toKeptGeometry())) {
    for (const path of geometry.paths) {
      for (let startDegrees = 0; startDegrees < endDegrees; startDegrees += 360) {
        solids.push(Shape.fromGeometry(loop(path, Math.min(360, endDegrees - startDegrees) * Math.PI / 180, sides, pitch)).moveX(pitch * startDegrees / 360));
      }
    }
  }
  return assemble(...solids);
};

const LoopMethod = function (...args) { return Loop(this, ...args); };
Shape.prototype.Loop = LoopMethod;

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

const extrude = (shape, height = 1, depth = 0) => {
  if (height < depth) {
    [height, depth] = [depth, height];
  }
  // FIX: Handle extrusion along a vector properly.
  const solids = [];
  const keptGeometry = shape.toKeptGeometry();
  for (const { z0Surface, tags } of getZ0Surfaces(keptGeometry)) {
    if (z0Surface.length > 0) {
      const solid = alignVertices(extrude$1(z0Surface, height, depth));
      solids.push(Shape.fromGeometry({ solid, tags }));
    }
  }
  for (const { surface, tags } of getSurfaces(keptGeometry)) {
    if (surface.length > 0) {
      const plane = toPlane$1(surface);
      if (plane[0] === 0 && plane[1] === 0 && plane[2] === 1 && plane[3] === 0) {
        // Detect Z0.
        // const solid = alignVertices(extrudeAlgorithm(surface, height, depth));
        const solid = extrude$1(surface, height, depth);
        solids.push(Shape.fromGeometry({ solid, tags }));
      } else {
        const [toZ0, fromZ0] = toXYPlaneTransforms(toPlane$1(surface));
        const z0SolidGeometry = extrude$1(transform(toZ0, surface), height, depth);
        const solid = alignVertices(transform$1(fromZ0, z0SolidGeometry));
        solids.push(Shape.fromGeometry({ solid, tags }));
      }
    }
  }
  // Keep plans.
  for (const entry of getPlans(keptGeometry)) {
    solids.push(entry);
  }
  return assemble(...solids);
};

const extrudeMethod = function (...args) { return extrude(this, ...args); };
Shape.prototype.extrude = extrudeMethod;

extrude.signature = 'extrude(shape:Shape, height:number = 1, depth:number = 1) -> Shape';
extrudeMethod.signature = 'Shape -> extrude(height:number = 1, depth:number = 1) -> Shape';

const fill = (shape, pathsShape) => {
  const fills = [];
  for (const { surface, z0Surface } of getAnySurfaces(shape.toKeptGeometry())) {
    const anySurface = surface || z0Surface;
    const plane = toPlane$1(anySurface);
    const [to, from] = toXYPlaneTransforms(plane);
    const flatSurface = transform(to, anySurface);
    for (const { paths } of getPaths(pathsShape.toKeptGeometry())) {
      const flatPaths = transform$2(to, paths);
      const flatFill = intersectionOfPathsBySurfaces(flatPaths, flatSurface);
      const fill = transform$2(from, flatFill);
      fills.push(...fill);
    }
  }
  return Shape.fromGeometry({ paths: fills });
};

const fillMethod = function (...args) { return fill(this, ...args); };
Shape.prototype.fill = fillMethod;

const withFillMethod = function (...args) { return assemble(this, fill(this, ...args)); };
Shape.prototype.withFill = withFillMethod;

fill.signature = 'interior(shape:Surface, paths:Paths) -> Paths';
fillMethod.signature = 'Surface -> interior(paths:Paths) -> Paths';
withFillMethod.signature = 'Surface -> interior(paths:Paths) -> Shape';

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

const interior = (shape) => {
  const surfaces = [];
  for (const { paths } of getPaths(shape.toKeptGeometry())) {
    // FIX: Check paths for coplanarity.
    surfaces.push(Shape.fromPathsToSurface(paths.filter(isClosed).filter(path => path.length >= 3)));
  }
  return assemble(...surfaces);
};

const interiorMethod = function (...args) { return interior(this); };
Shape.prototype.interior = interiorMethod;

interior.signature = 'interior(shape:Shape) -> Shape';
interiorMethod.signature = 'Shape -> interior() -> Shape';

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
  a.eachPoint(point => aPoints.push(point));
  b.eachPoint(point => bPoints.push(point));
  return Shape.fromGeometry(buildConvexMinkowskiSum(aPoints, bPoints));
};

const minkowskiMethod = function (shape) { return minkowski(this, shape); };
Shape.prototype.minkowski = minkowskiMethod;

minkowski.signature = 'minkowski(a:Shape, b:Shape) -> Shape';

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

const outlineMethod = function (options) { return outline(this); };
const withOutlineMethod = function (options) { return assemble(this, outline(this)); };

Shape.prototype.outline = outlineMethod;
Shape.prototype.withOutline = withOutlineMethod;

outline.signature = 'outline(shape:Surface) -> Shape';
outlineMethod.signature = 'Shape -> outline() -> Shape';
withOutlineMethod.signature = 'Shape -> outline() -> Shape';

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

const toPlane = (connector) => {
  for (const entry of getPlans(connector.toKeptGeometry())) {
    if (entry.plan && entry.plan.connector) {
      return entry.planes[0];
    }
  }
};

const toSurface = (plane) => {
  const max = +1e5;
  const min = -1e5;
  const [, from] = toXYPlaneTransforms(plane);
  const path = [[max, max, 0], [min, max, 0], [min, min, 0], [max, min, 0]];
  const polygon = transform$3(from, path);
  return [polygon];
};

const section = (solidShape, ...connectors) => {
  if (connectors.length === 0) {
    connectors.push(Z$3(0));
  }
  const planes = connectors.map(toPlane);
  const planeSurfaces = planes.map(toSurface);
  const shapes = [];
  const normalize = createNormalize3();
  for (const { solid } of getSolids(solidShape.toKeptGeometry())) {
    const sections = section$1(solid, planeSurfaces, normalize);
    const surfaces = sections.map(section => makeConvex(section, normalize));
    // const surfaces = sections.map(section => outlineSurface(section, normalize));
    // const surfaces = sections.map(section => section);
    // const surfaces = sections;
    for (let i = 0; i < surfaces.length; i++) {
      surfaces[i].plane = planes[i];
      shapes.push(Shape.fromGeometry({ surface: surfaces[i] }));
    }
  }
  return layer(...shapes);
};

const sectionMethod = function (...args) { return section(this, ...args); };
Shape.prototype.section = sectionMethod;

const squash = (shape) => {
  const geometry = shape.toKeptGeometry();
  const result = { layers: [] };
  for (const { solid, tags } of getSolids(geometry)) {
    const polygons = [];
    for (const surface of solid) {
      for (const path of surface) {
        const flat = path.map(([x, y]) => [x, y, 0]);
        if (toPlane$2(flat) === undefined) continue;
        polygons.push(isCounterClockwise(flat) ? flat : flip(flat));
      }
    }
    result.layers.push({ z0Surface: outline$2(polygons), tags });
  }
  for (const { surface, tags } of getSurfaces(geometry)) {
    const polygons = [];
    for (const path of surface) {
      const flat = path.map(([x, y]) => [x, y, 0]);
      if (toPlane$2(flat) === undefined) continue;
      polygons.push(isCounterClockwise(flat) ? flat : flip(flat));
    }
    result.layers.push({ z0Surface: polygons, tags });
  }
  for (const { z0Surface, tags } of getZ0Surfaces(geometry)) {
    const polygons = [];
    for (const path of z0Surface) {
      polygons.push(path);
    }
    result.layers.push({ z0Surface: polygons, tags });
  }
  for (const { paths, tags } of getPaths(geometry)) {
    const flatPaths = [];
    for (const path of paths) {
      flatPaths.push(path.map(([x, y]) => [x, y, 0]));
    }
    result.layers.push({ paths: flatPaths, tags });
  }
  return Shape$1.fromGeometry(result);
};

const squashMethod = function () { return squash(this); };
Shape$1.prototype.squash = squashMethod;

/**
 *
 * # Stretch
 *
 **/

const toPlaneFromConnector = (connector) => {
  for (const entry of getPlans(connector.toKeptGeometry())) {
    if (entry.plan && entry.plan.connector) {
      return entry.planes[0];
    }
  }
};

const toSurface$1 = (plane) => {
  const max = +1e5;
  const min = -1e5;
  const [, from] = toXYPlaneTransforms(plane);
  const path = [[max, max, 0], [min, max, 0], [min, min, 0], [max, min, 0]];
  const polygon = transform$3(from, path);
  return [polygon];
};

const stretch = (shape, length, connector = Z$3()) => {
  const normalize = createNormalize3();
  const stretches = [];
  const planeSurface = toSurface$1(toPlaneFromConnector(connector));
  for (const { solid, tags } of getSolids(shape.toKeptGeometry())) {
    if (solid.length === 0) {
      continue;
    }
    const bottom = cutOpen(solid, planeSurface, normalize);
    const [profile] = section$1(solid, [planeSurface], normalize);
    const top = cutOpen(solid, flip$1(planeSurface), normalize);
    const [toZ0, fromZ0] = toXYPlaneTransforms(toPlane$1(profile));
    const z0SolidGeometry = extrude$1(transform(toZ0, profile), length, 0, false);
    const middle = transform$1(fromZ0, z0SolidGeometry);
    const topMoved = transform$1(fromTranslation(scale(length, toPlane$1(profile))), top);
    stretches.push(Shape.fromGeometry({ solid: alignVertices([...bottom, ...middle, ...topMoved], normalize), tags }));
  }

  return assemble(...stretches);
};

const method = function (...args) { return stretch(this, ...args); };
Shape.prototype.stretch = method;

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
      chains.push(ChainedHull(...path.map(point => tool.move(...point))));
    }
  }
  return union(...chains);
};

const sweepMethod = function (tool) { return sweep(this, tool); };

Shape.prototype.sweep = sweepMethod;
Shape.prototype.withSweep = function (tool) { return assemble(this, sweep(this, tool)); };

// Return an assembly of paths so that each toolpath can have its own tag.
const toolpath = (shape, radius = 1, { overcut: overcut$1 = 0, joinPaths = false } = {}) =>
  Shape.fromGeometry({ paths: overcut(shape.outline().toKeptGeometry(), radius, overcut$1, joinPaths) });

const method$1 = function (...options) { return toolpath(this, ...options); };

Shape.prototype.toolpath = method$1;
Shape.prototype.withToolpath = function (...args) { return assemble(this, toolpath(this, ...args)); };

const X = 0;
const Y = 1;
const Z$2 = 2;

const floor = (value, resolution) => Math.floor(value / resolution) * resolution;
const ceil = (value, resolution) => Math.ceil(value / resolution) * resolution;

const floorPoint = ([x, y, z], resolution) => [floor(x, resolution), floor(y, resolution), floor(z, resolution)];
const ceilPoint = ([x, y, z], resolution) => [ceil(x, resolution), ceil(y, resolution), ceil(z, resolution)];

const voxels = (shape, resolution = 1) => {
  const offset = resolution / 2;
  const geometry = shape.toKeptGeometry();
  const normalize = createNormalize3();
  const [boxMin, boxMax] = measureBoundingBox(geometry);
  const min = floorPoint(boxMin, resolution);
  const max = ceilPoint(boxMax, resolution);
  const classifiers = [];
  for (const { solid } of getSolids(shape.toKeptGeometry())) {
    classifiers.push({ bsp: fromSolid(solid, normalize) });
  }
  const test = (point) => {
    for (const { bsp } of classifiers) {
      if (containsPoint$1(bsp, point)) {
        return true;
      }
    }
    return false;
  };
  const polygons = [];
  for (let x = min[X] - offset; x <= max[X] + offset; x += resolution) {
    for (let y = min[Y] - offset; y <= max[Y] + offset; y += resolution) {
      for (let z = min[Z$2] - offset; z <= max[Z$2] + offset; z += resolution) {
        const state = test([x, y, z]);
        if (state !== test([x + resolution, y, z])) {
          const face = [[x + offset, y - offset, z - offset],
                        [x + offset, y + offset, z - offset],
                        [x + offset, y + offset, z + offset],
                        [x + offset, y - offset, z + offset]];
          polygons.push(state ? face : face.reverse());
        }
        if (state !== test([x, y + resolution, z])) {
          const face = [[x - offset, y + offset, z - offset],
                        [x + offset, y + offset, z - offset],
                        [x + offset, y + offset, z + offset],
                        [x - offset, y + offset, z + offset]];
          polygons.push(state ? face.reverse() : face);
        }
        if (state !== test([x, y, z + resolution])) {
          const face = [[x - offset, y - offset, z + offset],
                        [x + offset, y - offset, z + offset],
                        [x + offset, y + offset, z + offset],
                        [x - offset, y + offset, z + offset]];
          polygons.push(state ? face : face.reverse());
        }
      }
    }
  }
  return Shape.fromGeometry({ solid: fromPolygons({}, polygons) });
};

const voxelsMethod = function (...args) { return voxels(this, ...args); };
Shape.prototype.voxels = voxelsMethod;

const surfaceCloud = (shape, resolution = 1) => {
  const offset = resolution / 2;
  const geometry = shape.toKeptGeometry();
  const normalize = createNormalize3();
  const [boxMin, boxMax] = measureBoundingBox(geometry);
  const min = floorPoint(boxMin, resolution);
  const max = ceilPoint(boxMax, resolution);
  const classifiers = [];
  for (const { solid } of getSolids(shape.toKeptGeometry())) {
    classifiers.push({ bsp: fromSolid(solid, normalize) });
  }
  const test = (point) => {
    for (const { bsp } of classifiers) {
      if (containsPoint$1(bsp, point)) {
        return true;
      }
    }
    return false;
  };
  const paths = [];
  for (let x = min[X] - offset; x <= max[X] + offset; x += resolution) {
    for (let y = min[Y] - offset; y <= max[Y] + offset; y += resolution) {
      for (let z = min[Z$2] - offset; z <= max[Z$2] + offset; z += resolution) {
        const state = test([x, y, z]);
        if (state !== test([x + resolution, y, z])) {
          paths.push([null, [x, y, z], [x + resolution, y, z]]);
        }
        if (state !== test([x, y + resolution, z])) {
          paths.push([null, [x, y, z], [x, y + resolution, z]]);
        }
        if (state !== test([x, y, z + resolution])) {
          paths.push([null, [x, y, z], [x, y, z + resolution]]);
        }
      }
    }
  }
  return Shape.fromGeometry({ paths });
};

const surfaceCloudMethod = function (...args) { return surfaceCloud(this, ...args); };
Shape.prototype.surfaceCloud = surfaceCloudMethod;

const withSurfaceCloudMethod = function (...args) { return assemble(this, surfaceCloud(this, ...args)); };
Shape.prototype.withSurfaceCloud = withSurfaceCloudMethod;

const orderPoints = ([aX, aY, aZ], [bX, bY, bZ]) => {
  const dX = aX - bX;
  if (dX !== 0) {
    return dX;
  }
  const dY = aY - bY;
  if (dY !== 0) {
    return dY;
  }
  const dZ = aZ - bZ;
  return dZ;
};

const cloud = (shape, resolution = 1) => {
  const offset = resolution / 2;
  const geometry = shape.toKeptGeometry();
  const normalize = createNormalize3();
  const [boxMin, boxMax] = measureBoundingBox(geometry);
  const min = floorPoint(boxMin, resolution);
  const max = ceilPoint(boxMax, resolution);
  const classifiers = [];
  for (const { solid } of getSolids(shape.toKeptGeometry())) {
    classifiers.push({ bsp: fromSolid(solid, normalize) });
  }
  const test = (point) => {
    for (const { bsp } of classifiers) {
      if (containsPoint$1(bsp, point)) {
        return true;
      }
    }
    return false;
  };
  const points = [];
  for (let x = min[X] - offset; x <= max[X] + offset; x += resolution) {
    for (let y = min[Y] - offset; y <= max[Y] + offset; y += resolution) {
      for (let z = min[Z$2] - offset; z <= max[Z$2] + offset; z += resolution) {
        if (test([x, y, z])) {
          points.push([x, y, z]);
        }
      }
    }
  }
  points.sort(orderPoints);
  return Shape.fromGeometry({ points });
};

const cloudMethod = function (...args) { return cloud(this, ...args); };
Shape.prototype.cloud = cloudMethod;

// FIX: move this
const containsPoint = (shape, point) => {
  for (const { solid } of getSolids(shape.toKeptGeometry())) {
    const bsp = fromSolid(solid, createNormalize3());
    if (containsPoint$1(bsp, point)) {
      return true;
    }
  }
  return false;
};

const containsPointMethod = function (point) { return containsPoint(this, point); };
Shape.prototype.containsPoint = containsPointMethod;

const api = {
  ChainedHull,
  Hull,
  Loop,
  extrude,
  fill,
  interior,
  minkowski,
  outline,
  section,
  squash,
  stretch,
  sweep,
  toolpath,
  voxels
};

export default api;
export { ChainedHull, Hull, Loop, extrude, fill, interior, minkowski, outline, section, squash, stretch, sweep, toolpath, voxels };
