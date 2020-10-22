import Shape$1, { Shape, getPegCoords } from './jsxcad-api-v1-shape.js';
import { alphaShape, convexHull, fromPoints } from './jsxcad-geometry-graph.js';
import { taggedGraph, taggedSurface, taggedSolid, getPaths, extrude as extrude$1, outline as outline$1, section as section$1, taggedGroup, taggedLayers, getSolids, union, taggedZ0Surface, getSurfaces, getZ0Surfaces, taggedPaths, getPlans, measureBoundingBox, taggedPoints, measureHeights } from './jsxcad-geometry-tagged.js';
import { buildConvexSurfaceHull, buildConvexHull, loop, buildConvexMinkowskiSum, extrude as extrude$2 } from './jsxcad-algorithm-shape.js';
import { Assembly, Group } from './jsxcad-api-v1-shapes.js';
import { Y as Y$1, Z as Z$2 } from './jsxcad-api-v1-connector.js';
import { isClosed, isCounterClockwise, flip, transform as transform$2, getEdges } from './jsxcad-geometry-path.js';
import { toPlane } from './jsxcad-math-poly3.js';
import { transform as transform$1, alignVertices, fromPolygons } from './jsxcad-geometry-solid.js';
import { cutOpen, section as section$2, fromSolid, containsPoint as containsPoint$1 } from './jsxcad-geometry-bsp.js';
import { flip as flip$1, toPlane as toPlane$1, transform } from './jsxcad-geometry-surface.js';
import { createNormalize3 } from './jsxcad-algorithm-quantize.js';
import { fromTranslation } from './jsxcad-math-mat4.js';
import { scale, distance } from './jsxcad-math-vec3.js';
import { toXYPlaneTransforms } from './jsxcad-math-plane.js';
import { toolpath as toolpath$1 } from './jsxcad-algorithm-toolpath.js';

const Alpha = (shape, componentLimit = 1) => {
  const points = [];
  shape.eachPoint((point) => points.push(point));
  return Shape.fromGeometry(
    taggedGraph({}, alphaShape(points, componentLimit))
  );
};

const alphaMethod = function (componentLimit = 1) {
  return Alpha(this, componentLimit);
};
Shape.prototype.alpha = alphaMethod;

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
  const pointsets = shapes.map((shape) => shape.toPoints());
  const chain = [];
  for (let nth = 1; nth < pointsets.length; nth++) {
    const points = [...pointsets[nth - 1], ...pointsets[nth]];
    if (points.every((point) => point[Z] === 0)) {
      chain.push(
        Shape.fromGeometry(taggedSurface({}, buildConvexSurfaceHull(points)))
      );
    } else {
      chain.push(Shape.fromGeometry(taggedSolid({}, buildConvexHull(points))));
    }
  }
  return Assembly(...chain);
};

const ChainedHullMethod = function (...args) {
  return ChainedHull(this, ...args);
};
Shape.prototype.ChainedHull = ChainedHullMethod;

/*
import {
  buildConvexHull,
  buildConvexSurfaceHull,
} from './jsxcad-algorithm-shape.js';
import { taggedSolid, taggedSurface } from './jsxcad-geometry-tagged.js';

import { Shape } from './jsxcad-api-v1-shape.js';

const Z = 2;

export const Hull = (...shapes) => {
  const points = [];
  shapes.forEach((shape) => shape.eachPoint((point) => points.push(point)));
  // FIX: Detect planar hulls properly.
  if (points.every((point) => point[Z] === 0)) {
    return Shape.fromGeometry(
      taggedSurface({}, buildConvexSurfaceHull(points))
    );
  } else {
    return Shape.fromGeometry(taggedSolid({}, buildConvexHull(points)));
  }
};
*/

const Hull = (...shapes) => {
  const points = [];
  shapes.forEach((shape) => shape.eachPoint((point) => points.push(point)));
  return Shape.fromGeometry(taggedGraph({}, convexHull(points)));
};

const hullMethod = function (...shapes) {
  return Hull(this, ...shapes);
};
Shape.prototype.hull = hullMethod;

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

const Loop = (
  shape,
  endDegrees = 360,
  { sides = 32, pitch = 0 } = {}
) => {
  const profile = shape.chop(Y$1(0));
  const outline = profile.outline();
  const solids = [];
  for (const geometry of getPaths(outline.toKeptGeometry())) {
    for (const path of geometry.paths) {
      for (
        let startDegrees = 0;
        startDegrees < endDegrees;
        startDegrees += 360
      ) {
        solids.push(
          Shape.fromGeometry(
            loop(
              path,
              (Math.min(360, endDegrees - startDegrees) * Math.PI) / 180,
              sides,
              pitch
            )
          ).moveX((pitch * startDegrees) / 360)
        );
      }
    }
  }
  return Assembly(...solids);
};

const LoopMethod = function (...args) {
  return Loop(this, ...args);
};
Shape.prototype.Loop = LoopMethod;

const cloudSolid = (shape) => {
  const points = shape.toPoints();
  return Shape.fromGeometry(taggedGraph({}, fromPoints(points)));
};

const cloudSolidMethod = function () {
  return cloudSolid(this);
};
Shape.prototype.cloudSolid = cloudSolidMethod;

const withCloudSolidMethod = function () {
  return this.with(cloudSolid(this));
};
Shape.prototype.withCloudSolid = withCloudSolidMethod;

const extrude = (shape, height = 1, depth = 0) => {
  if (height < depth) {
    [height, depth] = [depth, height];
  }
  return Shape$1.fromGeometry(extrude$1(shape.toGeometry(), height, depth));
};

const extrudeMethod = function (height = 1, depth = 0) {
  return extrude(this, height, depth);
};
Shape$1.prototype.extrude = extrudeMethod;

/*
import {
  alignVertices,
  transform as transformSolid,
} from './jsxcad-geometry-solid.js';
import { getPlans, getSurfaces, getZ0Surfaces } from './jsxcad-geometry-tagged.js';
import {
  toPlane as toPlaneOfSurface,
  transform as transformSurface,
} from './jsxcad-geometry-surface.js';

import { Assembly } from './jsxcad-api-v1-shapes.js';
import { Shape } from './jsxcad-api-v1-shape.js';
import { extrude as extrudeAlgorithm } from './jsxcad-algorithm-shape.js';
import { toXYPlaneTransforms } from './jsxcad-math-plane.js';

export const extrude = (shape, height = 1, depth = 0) => {
  if (height < depth) {
    [height, depth] = [depth, height];
  }
  // FIX: Handle extrusion along a vector properly.
  const solids = [];
  const keptGeometry = shape.toKeptGeometry();
  for (const { z0Surface, tags } of getZ0Surfaces(keptGeometry)) {
    if (z0Surface.length > 0) {
      const solid = alignVertices(extrudeAlgorithm(z0Surface, height, depth));
      solids.push(Shape.fromGeometry({ type: 'solid', solid, tags }));
    }
  }
  for (const { surface, tags } of getSurfaces(keptGeometry)) {
    if (surface.length > 0) {
      const plane = toPlaneOfSurface(surface);
      if (
        plane[0] === 0 &&
        plane[1] === 0 &&
        plane[2] === 1 &&
        plane[3] === 0
      ) {
        // Detect Z0.
        // const solid = alignVertices(extrudeAlgorithm(surface, height, depth));
        const solid = extrudeAlgorithm(surface, height, depth);
        solids.push(Shape.fromGeometry({ type: 'solid', solid, tags }));
      } else {
        const [toZ0, fromZ0] = toXYPlaneTransforms(toPlaneOfSurface(surface));
        const z0SolidGeometry = extrudeAlgorithm(
          transformSurface(toZ0, surface),
          height,
          depth
        );
        const solid = alignVertices(transformSolid(fromZ0, z0SolidGeometry));
        solids.push(Shape.fromGeometry({ type: 'solid', solid, tags }));
      }
    }
  }
  // Keep plans.
  for (const entry of getPlans(keptGeometry)) {
    solids.push(entry);
  }
  return Assembly(...solids);
};

const extrudeMethod = function (...args) {
  return extrude(this, ...args);
};
Shape.prototype.extrude = extrudeMethod;

export default extrude;
*/

const outline = (shape) =>
  Group(
    ...outline$1(shape.toGeometry()).map((outline) =>
      Shape.fromGeometry(outline)
    )
  );

const outlineMethod = function () {
  return outline(this);
};

const withOutlineMethod = function (op = (x) => x) {
  return this.with(op(outline(this)));
};

Shape.prototype.outline = outlineMethod;
Shape.prototype.withOutline = withOutlineMethod;

const inline = (shape) => outline(shape.flip());

const inlineMethod = function (options) {
  return inline(this);
};

const withInlineMethod = function (options) {
  return this.with(inline(this));
};

Shape$1.prototype.inline = inlineMethod;
Shape$1.prototype.withInline = withInlineMethod;

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
    surfaces.push(
      Shape.fromPathsToSurface(
        paths.filter(isClosed).filter((path) => path.length >= 3)
      )
    );
  }
  return Assembly(...surfaces);
};

const interiorMethod = function (...args) {
  return interior(this);
};
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
  a.eachPoint((point) => aPoints.push(point));
  b.eachPoint((point) => bPoints.push(point));
  return Shape.fromGeometry(
    taggedSolid({}, buildConvexMinkowskiSum(aPoints, bPoints))
  );
};

const minkowskiMethod = function (shape) {
  return minkowski(this, shape);
};
Shape.prototype.minkowski = minkowskiMethod;

const section = (shape, ...pegs) => {
  const planes = [];
  if (pegs.length === 0) {
    planes.push([0, 0, 1, 0]);
  } else {
    for (const peg of pegs) {
      const { plane } = getPegCoords(peg);
      planes.push(plane);
    }
  }
  const sections = [];
  for (const plane of planes) {
    sections.push(section$1(plane, shape.toGeometry()));
  }
  if (sections.length > 1) {
    return Shape.fromGeometry(taggedGroup({}, ...sections));
  } else {
    return Shape.fromGeometry(sections[0]);
  }
};

const sectionMethod = function (...args) {
  return section(this, ...args);
};
Shape.prototype.section = sectionMethod;

const squash = (shape) => {
  const geometry = shape.toKeptGeometry();
  const result = taggedLayers({});
  for (const { solid, tags } of getSolids(geometry)) {
    const polygons = [];
    for (const surface of solid) {
      for (const path of surface) {
        const flat = path.map(([x, y]) => [x, y, 0]);
        if (toPlane(flat) === undefined) continue;
        polygons.push(isCounterClockwise(flat) ? flat : flip(flat));
      }
    }
    result.content.push(
      union(...polygons.map((polygon) => taggedZ0Surface({ tags }, [polygon])))
    );
  }
  for (const { surface, tags } of getSurfaces(geometry)) {
    const polygons = [];
    for (const path of surface) {
      const flat = path.map(([x, y]) => [x, y, 0]);
      if (toPlane(flat) === undefined) continue;
      polygons.push(isCounterClockwise(flat) ? flat : flip(flat));
    }
    result.content.push(taggedZ0Surface({ tags }, polygons));
  }
  for (const { z0Surface, tags } of getZ0Surfaces(geometry)) {
    const polygons = [];
    for (const path of z0Surface) {
      polygons.push(path);
    }
    result.content.push(taggedZ0Surface({ tags }, polygons));
  }
  for (const { paths, tags } of getPaths(geometry)) {
    const flatPaths = [];
    for (const path of paths) {
      flatPaths.push(path.map(([x, y]) => [x, y, 0]));
    }
    result.content.push({ type: 'paths', paths: flatPaths, tags });
    result.content.push(taggedPaths({ tags }, flatPaths));
  }
  return Shape$1.fromGeometry(result);
};

const squashMethod = function () {
  return squash(this);
};
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

const toSurface = (plane) => {
  const max = +1e5;
  const min = -1e5;
  const [, from] = toXYPlaneTransforms(plane);
  const path = [
    [max, max, 0],
    [min, max, 0],
    [min, min, 0],
    [max, min, 0],
  ];
  const polygon = transform$2(from, path);
  return [polygon];
};

const stretch = (shape, length, connector = Z$2()) => {
  const normalize = createNormalize3();
  const stretches = [];
  const planeSurface = toSurface(toPlaneFromConnector(connector));
  for (const { solid, tags } of getSolids(shape.toKeptGeometry())) {
    if (solid.length === 0) {
      continue;
    }
    const bottom = cutOpen(solid, planeSurface, normalize);
    const [profile] = section$2(solid, [planeSurface], normalize);
    const top = cutOpen(solid, flip$1(planeSurface), normalize);
    const [toZ0, fromZ0] = toXYPlaneTransforms(toPlane$1(profile));
    const z0SolidGeometry = extrude$2(
      transform(toZ0, profile),
      length,
      0,
      false
    );
    const middle = transform$1(fromZ0, z0SolidGeometry);
    const topMoved = transform$1(
      fromTranslation(scale(length, toPlane$1(profile))),
      top
    );
    stretches.push(
      Shape.fromGeometry({
        type: 'solid',
        solid: alignVertices([...bottom, ...middle, ...topMoved], normalize),
        tags,
      })
    );
  }

  return Assembly(...stretches);
};

const method = function (...args) {
  return stretch(this, ...args);
};
Shape.prototype.stretch = method;

// FIX: This is a weak approximation assuming a 1d profile -- it will need to be redesigned.
const sweep = (toolpath, tool) => {
  const chains = [];
  for (const { paths } of getPaths(toolpath.toKeptGeometry())) {
    for (const path of paths) {
      // FIX: Handle tool rotation around the vector of orientation, and corners.
      chains.push(
        ...getEdges(path).map(([start, end]) =>
          tool.orient({ from: start, at: end }).extrude(distance(start, end))
        )
      );
    }
  }
  return Group(...chains);
};

const sweepMethod = function (tool, { resolution = 1 } = {}) {
  return sweep(this, tool);
};

Shape.prototype.sweep = sweepMethod;
Shape.prototype.withSweep = function (tool, { resolution }) {
  return this.with(sweep(this, tool));
};

const toolpath = (
  shape,
  diameter = 1,
  { overcut = false, solid = true } = {}
) =>
  Shape.fromGeometry({
    type: 'paths',
    paths: toolpath$1(shape.toKeptGeometry(), diameter, overcut, solid),
  });

const method$1 = function (...options) {
  return toolpath(this, ...options);
};

Shape.prototype.toolpath = method$1;
Shape.prototype.withToolpath = function (...args) {
  return this.with(toolpath(this, ...args));
};

const X = 0;
const Y = 1;
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

const voxels = (shape, resolution = 1) => {
  const offset = resolution / 2;
  const geometry = shape.toDisjointGeometry();
  const normalize = createNormalize3();
  const [boxMin, boxMax] = measureBoundingBox(geometry);
  const min = floorPoint(boxMin, resolution);
  const max = ceilPoint(boxMax, resolution);
  const classifiers = [];
  for (const { solid } of getSolids(shape.toDisjointGeometry())) {
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
      for (let z = min[Z$1] - offset; z <= max[Z$1] + offset; z += resolution) {
        const state = test([x, y, z]);
        if (state !== test([x + resolution, y, z])) {
          const face = [
            [x + offset, y - offset, z - offset],
            [x + offset, y + offset, z - offset],
            [x + offset, y + offset, z + offset],
            [x + offset, y - offset, z + offset],
          ];
          polygons.push(state ? face : face.reverse());
        }
        if (state !== test([x, y + resolution, z])) {
          const face = [
            [x - offset, y + offset, z - offset],
            [x + offset, y + offset, z - offset],
            [x + offset, y + offset, z + offset],
            [x - offset, y + offset, z + offset],
          ];
          polygons.push(state ? face.reverse() : face);
        }
        if (state !== test([x, y, z + resolution])) {
          const face = [
            [x - offset, y - offset, z + offset],
            [x + offset, y - offset, z + offset],
            [x + offset, y + offset, z + offset],
            [x - offset, y + offset, z + offset],
          ];
          polygons.push(state ? face : face.reverse());
        }
      }
    }
  }
  return Shape.fromGeometry(taggedSolid({}, fromPolygons(polygons)));
};

const voxelsMethod = function (...args) {
  return voxels(this, ...args);
};
Shape.prototype.voxels = voxelsMethod;

const surfaceCloud = (shape, resolution = 1) => {
  const offset = resolution / 2;
  const geometry = shape.toDisjointGeometry();
  const normalize = createNormalize3();
  const [boxMin, boxMax] = measureBoundingBox(geometry);
  const min = floorPoint(boxMin, resolution);
  const max = ceilPoint(boxMax, resolution);
  const classifiers = [];
  for (const { solid } of getSolids(shape.toDisjointGeometry())) {
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
      for (let z = min[Z$1] - offset; z <= max[Z$1] + offset; z += resolution) {
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
  return Shape.fromGeometry(taggedPaths({}, paths));
};

const surfaceCloudMethod = function (...args) {
  return surfaceCloud(this, ...args);
};
Shape.prototype.surfaceCloud = surfaceCloudMethod;

const withSurfaceCloudMethod = function (...args) {
  return this.with(surfaceCloud(this, ...args));
};
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
  const geometry = shape.toDisjointGeometry();
  const normalize = createNormalize3();
  const [boxMin, boxMax] = measureBoundingBox(geometry);
  const min = floorPoint(boxMin, resolution);
  const max = ceilPoint(boxMax, resolution);
  const classifiers = [];
  for (const { solid } of getSolids(shape.toDisjointGeometry())) {
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
      for (let z = min[Z$1] - offset; z <= max[Z$1] + offset; z += resolution) {
        if (test([x, y, z])) {
          points.push([x, y, z]);
        }
      }
    }
  }
  points.sort(orderPoints);
  return Shape.fromGeometry(taggedPoints({}, points));
};

const cloudMethod = function (...args) {
  return cloud(this, ...args);
};
Shape.prototype.cloud = cloudMethod;

// FIX: move this
const containsPoint = (shape, point) => {
  for (const { solid } of getSolids(shape.toDisjointGeometry())) {
    const bsp = fromSolid(solid, createNormalize3());
    if (containsPoint$1(bsp, point)) {
      return true;
    }
  }
  return false;
};

const containsPointMethod = function (point) {
  return containsPoint(this, point);
};
Shape.prototype.containsPoint = containsPointMethod;

const heightCloud = (shape, resolution) => {
  const heights = measureHeights(shape.toDisjointGeometry(), resolution);
  return Shape.fromGeometry(taggedPoints({}, heights));
};

const heightCloudMethod = function (resolution) {
  return heightCloud(this, resolution);
};
Shape.prototype.heightCloud = heightCloudMethod;

const api = {
  Alpha,
  ChainedHull,
  Hull,
  Loop,
  extrude,
  interior,
  minkowski,
  inline,
  outline,
  section,
  squash,
  stretch,
  sweep,
  toolpath,
  voxels,
};

export default api;
export { Alpha, ChainedHull, Hull, Loop, cloudSolid, extrude, inline, interior, minkowski, outline, section, squash, stretch, sweep, toolpath, voxels };
