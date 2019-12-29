import { fromPolygons, eachPoint } from './jsxcad-geometry-solid.js';
import { canonicalize, toTriangles } from './jsxcad-geometry-polygons.js';
import { toKeptGeometry, getSolids } from './jsxcad-geometry-tagged.js';
import { deduplicate, assertUnique } from './jsxcad-geometry-path.js';
import { scale, add, subtract, length, equals, distance } from './jsxcad-math-vec3.js';
import { toPlane } from './jsxcad-math-poly3.js';

function parse(str) {
  if(typeof str !== 'string') {
    str = str.toString();
  }

  var positions = [];
  var cells = [];
  var faceNormals = [];
  var name = null;

  var lines = str.split('\n');
  var cell = [];

  for(var i=0; i<lines.length; i++) {

    var parts = lines[i]
      .trim()
      .split(' ')
      .filter(function(part) {
        return part !== '';
      });

    switch(parts[0]) {
      case 'solid':
        name = parts.slice(1).join(' ');
        break;
      case 'facet':
        var normal = parts.slice(2).map(Number);
        faceNormals.push(normal);
        break;
      case 'vertex':
        var position = parts.slice(1).map(Number);
        cell.push(positions.length);
        positions.push(position);
        break;
      case 'endfacet':
        cells.push(cell);
        cell = [];
        // skip
    }
  }

  return {
    positions: positions,
    cells: cells,
    faceNormals: faceNormals,
    name: name
  };
}

var parseStlAscii = parse;

// Adapted for ArrayBuffer from parse-stl-binary version ^1.0.1.

const LITTLE_ENDIAN = true;

const readVector = (view, off) => [view.getFloat32(off + 0, LITTLE_ENDIAN),
                                   view.getFloat32(off + 4, LITTLE_ENDIAN),
                                   view.getFloat32(off + 8, LITTLE_ENDIAN)];

const parse$1 = (data) => {
  const view = new DataView(data.buffer);
  var off = 80; // skip header

  var triangleCount = view.getUint32(off, LITTLE_ENDIAN);
  off += 4;

  var cells = [];
  var positions = [];
  var faceNormals = [];

  for (var i = 0; i < triangleCount; i++) {
    var cell = [];
    var normal = readVector(view, off);
    off += 12; // 3 floats

    faceNormals.push(normal);

    for (var j = 0; j < 3; j++) {
      var position = readVector(view, off);
      off += 12;
      cell.push(positions.length);
      positions.push(position);
    }

    cells.push(cell);
    off += 2; // skip attribute byte count
  }

  return {
    positions: positions,
    cells: cells,
    faceNormals: faceNormals
  };
};

const toParser = (format) => {
  switch (format) {
    case 'ascii': return parseStlAscii;
    case 'binary': return parse$1;
    default: throw Error('die');
  }
};

const fromStl = async ({ format = 'ascii' }, stl) => {
  const parse = toParser(format);
  const { positions, cells } = parse(stl);
  const polygons = [];
  for (const [a, b, c] of cells) {
    polygons.push([positions[a], positions[b], positions[c]]);
  }
  return { solid: fromPolygons({}, polygons) };
};

var bounds3 = Bounds3;

function Bounds3(x, y, z, half) {
  this.x = typeof x === 'number' ? x : 0;
  this.y = typeof y === 'number' ? y : 0;
  this.z = typeof z === 'number' ? z : 0;
  this.half = typeof half === 'number' ? half : 0;
}

Bounds3.prototype.contains = function contains(x, y, z) {
  var half = this.half;
  return this.x - half <= x && x < this.x + half &&
    this.y - half <= y && y < this.y + half &&
    this.z - half <= z && z < this.z + half;
};

var MAX_ITEMS = 4;

var treeNode = TreeNode;

function TreeNode(bounds) {
  this.bounds = bounds;
  this.q0 = null;
  this.q1 = null;
  this.q2 = null;
  this.q3 = null;
  this.q4 = null;
  this.q5 = null;
  this.q6 = null;
  this.q7 = null;
  this.items = null;
}

TreeNode.prototype.subdivide = function subdivide() {
  var bounds = this.bounds;
  var quarter = bounds.half / 2;

  this.q0 = new TreeNode(new bounds3(bounds.x - quarter, bounds.y - quarter, bounds.z - quarter, quarter));
  this.q1 = new TreeNode(new bounds3(bounds.x + quarter, bounds.y - quarter, bounds.z - quarter, quarter));
  this.q2 = new TreeNode(new bounds3(bounds.x - quarter, bounds.y + quarter, bounds.z - quarter, quarter));
  this.q3 = new TreeNode(new bounds3(bounds.x + quarter, bounds.y + quarter, bounds.z - quarter, quarter));
  this.q4 = new TreeNode(new bounds3(bounds.x - quarter, bounds.y - quarter, bounds.z + quarter, quarter));
  this.q5 = new TreeNode(new bounds3(bounds.x + quarter, bounds.y - quarter, bounds.z + quarter, quarter));
  this.q6 = new TreeNode(new bounds3(bounds.x - quarter, bounds.y + quarter, bounds.z + quarter, quarter));
  this.q7 = new TreeNode(new bounds3(bounds.x + quarter, bounds.y + quarter, bounds.z + quarter, quarter));
};

TreeNode.prototype.insert = function insert(idx, array, depth) {
  var isLeaf = this.q0 === null;
  if (isLeaf) {
    // TODO: this memory could be recycled to avoid GC
    if (this.items === null) {
      this.items = [idx];
    } else {
      this.items.push(idx);
    }
    if (this.items.length >= MAX_ITEMS && depth < 16) {
      this.subdivide();
      for (var i = 0; i < this.items.length; ++i) {
        this.insert(this.items[i], array, depth + 1);
      }
      this.items = null;
    }
  } else {
    var x = array[idx],
      y = array[idx + 1],
      z = array[idx + 2];
    var bounds = this.bounds;
    var quadIdx = 0; // assume NW
    if (x > bounds.x) {
      quadIdx += 1; // nope, we are in E part
    }
    if (y > bounds.y) {
      quadIdx += 2; // Somewhere south.
    }
    if (z > bounds.z) {
      quadIdx += 4; // Somewhere far
    }

    var child = getChild(this, quadIdx);
    child.insert(idx, array, depth + 1);
  }
};

TreeNode.prototype.query = function queryBounds(results, sourceArray, intersects, preciseCheck) {
  if (!intersects(this.bounds)) return;
  var items = this.items;
  var needsCheck = typeof preciseCheck === 'function';
  if (items) {
    for (var i = 0; i < items.length; ++i) {
      var idx = items[i];
      if (needsCheck) {
        if (preciseCheck(sourceArray[idx], sourceArray[idx + 1], sourceArray[idx + 2])) {
          results.push(idx);
        }
      } else {
        results.push(idx);
      }
    }
  }

  if (!this.q0) return;

  this.q0.query(results, sourceArray, intersects, preciseCheck);
  this.q1.query(results, sourceArray, intersects, preciseCheck);
  this.q2.query(results, sourceArray, intersects, preciseCheck);
  this.q3.query(results, sourceArray, intersects, preciseCheck);
  this.q4.query(results, sourceArray, intersects, preciseCheck);
  this.q5.query(results, sourceArray, intersects, preciseCheck);
  this.q6.query(results, sourceArray, intersects, preciseCheck);
  this.q7.query(results, sourceArray, intersects, preciseCheck);
};

function getChild(node, idx) {
  if (idx === 0) return node.q0;
  if (idx === 1) return node.q1;
  if (idx === 2) return node.q2;
  if (idx === 3) return node.q3;
  if (idx === 4) return node.q4;
  if (idx === 5) return node.q5;
  if (idx === 6) return node.q6;
  if (idx === 7) return node.q7;
}

var rafor = asyncFor;

/**
 * Iterates over array in async manner. This function attempts to maximize
 * number of elements visited within single event loop cycle, while at the
 * same time tries to not exceed a time threshold allowed to stay within
 * event loop.
 *
 * @param {Array} array which needs to be iterated. Array-like objects are OK too.
 * @param {VisitCalback} visitCallback called for every element within for loop.
 * @param {DoneCallback} doneCallback called when iterator has reached end of array.
 * @param {Object=} options - additional configuration:
 * @param {number} [options.step=1] - default iteration step
 * @param {number} [options.maxTimeMS=8] - maximum time (in milliseconds) which
 *   iterator should spend within single event loop.
 * @param {number} [options.probeElements=5000] - how many elements should iterator
 *   visit to measure its iteration speed.
 */
function asyncFor(array, visitCallback, doneCallback, options) {
  var start = 0;
  var elapsed = 0;
  options = options || {};
  var step = options.step || 1;
  var maxTimeMS = options.maxTimeMS || 8;
  var pointsPerLoopCycle = options.probeElements || 5000;
  // we should never block main thread for too long...
  setTimeout(processSubset, 0);

  function processSubset() {
    var finish = Math.min(array.length, start + pointsPerLoopCycle);
    var i = start;
    var timeStart = new Date();
    for (i = start; i < finish; i += step) {
      visitCallback(array[i], i, array);
    }
    if (i < array.length) {
      elapsed += (new Date() - timeStart);
      start = i;

      pointsPerLoopCycle = Math.round(start * maxTimeMS/elapsed);
      setTimeout(processSubset, 0);
    } else {
      doneCallback(array);
    }
  }
}

/**
 * Represents octree data structure
 *
 * https://en.wikipedia.org/wiki/Octree
 */


var EmptyRegion = new bounds3();


var yaot = createTree;

function createTree(options) {
  var noPoints = [];

  var root;
  var originalArray;
  var api = {
    /**
     * Initializes tree asynchronously. Very useful when you have millions
     * of points and do not want to block rendering thread for too long.
     *
     * @param {number[]} points array of points for which we are building the
     * tree. Flat sequence of (x, y, z) coordinates. Array length should be
     * multiple of 3.
     *
     * @param {Function=} doneCallback called when tree is initialized. The
     * callback will be called with single argument which represent current
     * tree.
     */
    initAsync: initAsync,

    /**
     * Synchronous version of `initAsync()`. Should only be used for small
     * trees (less than 50-70k of points).
     *
     * @param {number[]} points array of points for which we are building the
     * tree. Flat sequence of (x, y, z) coordinates. Array length should be
     * multiple of 3.
     */
    init: init,

    /**
     * Gets bounds of the root node. Bounds are represented by center of the
     * node (x, y, z) and `half` attribute - distance from the center to an
     * edge of the root node.
     */
    bounds: getBounds,

    /**
     * Fires a ray from `rayOrigin` into `rayDirection` and collects all points
     * that lie in the octants intersected by the ray.
     *
     * This method implements An Efficient Parametric Algorithm for Octree Traversal
     * described in http://wscg.zcu.cz/wscg2000/Papers_2000/X31.pdf
     *
     * @param {Vector3} rayOrigin x,y,z coordinates where ray starts
     * @param {Vector3} rayDirection normalized x,y,z direction where ray shoots.
     * @param {number+} near minimum distance from the ray origin. 0 by default.
     * @param {number+} far maximum length of the ray. POSITIVE_INFINITY by default
     *
     * @return {Array} of indices in the source array. Each index represnts a start
     * of the x,y,z triplet of a point, that lies in the intersected octant.
     */
    intersectRay: intersectRay,

    /**
     * Once you have collected points from the octants intersected by a ray
     * (`intersectRay()` method), it may be worth to query points from the surrouning
     * area.
     */
    intersectSphere: intersectSphere,

    /**
     * Gets root node of the tree
     */
    getRoot: getRoot
  };

  return api;

  function getRoot() {
    return root;
  }

  function intersectSphere(cx, cy, cz, r) {
    if (!root) {
      // Most likely we are not initialized yet
      return noPoints;
    }
    var indices = [];
    var r2 = r * r;
    root.query(indices, originalArray, intersectCheck, preciseCheck);
    return indices;

    // http://stackoverflow.com/questions/4578967/cube-sphere-intersection-test
    function intersectCheck(candidate) {
      var dist = r2;
      var half = candidate.half;
      if (cx < candidate.x - half) dist -= sqr(cx - (candidate.x - half));
      else if (cx > candidate.x + half) dist -= sqr(cx - (candidate.x + half));

      if (cy < candidate.y - half) dist -= sqr(cy - (candidate.y - half));
      else if (cy > candidate.y + half) dist -= sqr(cy - (candidate.y + half));

      if (cz < candidate.z - half) dist -= sqr(cz - (candidate.z - half));
      else if (cz > candidate.z + half) dist -= sqr(cz - (candidate.z + half));
      return dist > 0;
    }

    function preciseCheck(x, y, z) {
      return sqr(x - cx) + sqr(y - cy) + sqr(z - cz) < r2;
    }
  }

  function sqr(x) {
    return x * x;
  }

  function intersectRay(rayOrigin, rayDirection, near, far) {
    if (!root) {
      // Most likely we are not initialized yet
      return noPoints;
    }

    if (near === undefined) near = 0;
    if (far === undefined) far = Number.POSITIVE_INFINITY;
    // we save as squar, to avoid expensive sqrt() operation
    near *= near;
    far *= far;

    var indices = [];
    root.query(indices, originalArray, intersectCheck, farEnough);
    return indices.sort(byDistanceToCamera);

    function intersectCheck(candidate) {
      // using http://wscg.zcu.cz/wscg2000/Papers_2000/X31.pdf
      var half = candidate.half;
      var t1 = (candidate.x - half - rayOrigin.x) / rayDirection.x,
        t2 = (candidate.x + half - rayOrigin.x) / rayDirection.x,
        t3 = (candidate.y + half - rayOrigin.y) / rayDirection.y,
        t4 = (candidate.y - half - rayOrigin.y) / rayDirection.y,
        t5 = (candidate.z - half - rayOrigin.z) / rayDirection.z,
        t6 = (candidate.z + half - rayOrigin.z) / rayDirection.z,
        tmax = Math.min(Math.min(Math.max(t1, t2), Math.max(t3, t4)), Math.max(t5, t6)),
        tmin;

      if (tmax < 0) return false;

      tmin = Math.max(Math.max(Math.min(t1, t2), Math.min(t3, t4)), Math.min(t5, t6));
      return tmin <= tmax && tmin <= far;
    }

    function farEnough(x, y, z) {
      var dist = (x - rayOrigin.x) * (x - rayOrigin.x) +
                 (y - rayOrigin.y) * (y - rayOrigin.y) +
                 (z - rayOrigin.z) * (z - rayOrigin.z);
      return near <= dist && dist <= far;
    }

    function byDistanceToCamera(idx0, idx1) {
      var x0 = rayOrigin[idx0];
      var y0 = rayOrigin[idx0 + 1];
      var z0 = rayOrigin[idx0 + 2];
      var dist0 = (x0 - rayOrigin.x) * (x0 - rayOrigin.x) +
                  (y0 - rayOrigin.y) * (y0 - rayOrigin.y) +
                  (z0 - rayOrigin.z) * (z0 - rayOrigin.z);

      var x1 = rayOrigin[idx1];
      var y1 = rayOrigin[idx1 + 1];
      var z1 = rayOrigin[idx1 + 2];

      var dist1 = (x1 - rayOrigin.x) * (x1 - rayOrigin.x) +
                  (y1 - rayOrigin.y) * (y1 - rayOrigin.y) +
                  (z1 - rayOrigin.z) * (z1 - rayOrigin.z);
      return dist0 - dist1;
    }
  }

  function init(points) {
    verifyPointsInvariant(points);
    originalArray = points;
    root = createRootNode(points);
    for (var i = 0; i < points.length; i += 3) {
      root.insert(i, originalArray, 0);
    }
  }

  function initAsync(points, doneCallback) {
    verifyPointsInvariant(points);

    var tempRoot = createRootNode(points);
    rafor(points, insertToRoot, doneInternal, { step: 3 });

    function insertToRoot(element, i) {
      tempRoot.insert(i, points, 0);
    }

    function doneInternal() {
      originalArray = points;
      root = tempRoot;
      if (typeof doneCallback === 'function') {
        doneCallback(api);
      }
    }
  }

  function verifyPointsInvariant(points) {
    if (!points) throw new Error('Points array is required for quadtree to work');
    if (typeof points.length !== 'number') throw new Error('Points should be array-like object');
    if (points.length % 3 !== 0) throw new Error('Points array should consist of series of x,y,z coordinates and be multiple of 3');
  }

  function getBounds() {
    if (!root) return EmptyRegion;
    return root.bounds;
  }

  function createRootNode(points) {
    // Edge case deserves empty region:
    if (points.length === 0) {
      var empty = new bounds3();
      return new treeNode(empty);
    }

    // Otherwise let's figure out how big should be the root region
    var minX = Number.POSITIVE_INFINITY;
    var minY = Number.POSITIVE_INFINITY;
    var minZ = Number.POSITIVE_INFINITY;
    var maxX = Number.NEGATIVE_INFINITY;
    var maxY = Number.NEGATIVE_INFINITY;
    var maxZ = Number.NEGATIVE_INFINITY;
    for (var i = 0; i < points.length; i += 3) {
      var x = points[i],
        y = points[i + 1],
        z = points[i + 2];
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
      if (z < minZ) minZ = z;
      if (z > maxZ) maxZ = z;
    }

    // Make bounds square:
    var side = Math.max(Math.max(maxX - minX, maxY - minY), maxZ - minZ);
    // since we need to have both sides inside the area, let's artificially
    // grow the root region:
    side += 2;
    minX -= 1;
    minY -= 1;
    minZ -= 1;
    var half = side / 2;

    var bounds = new bounds3(minX + half, minY + half, minZ + half, half);
    return new treeNode(bounds);
  }
}

const copy = ({ solid }) => ({ solid: solid.map(surface => surface.map(path => path.map(point => [...point]))) });

// FIX: This is neither efficient nor principled.
// We include this fix for now to better understand the cases where it fails.

const fixTJunctions = (solids) => {
  const tree = yaot();
  const points = [];
  for (const { solid } of solids) {
    eachPoint(point => points.push(...point), solid);
  }
  tree.init(points);

  const fixed = [];
  for (const geometry of solids) {
    const { solid } = copy(geometry);
    for (let nthSurface = 0; nthSurface < solid.length; nthSurface++) {
      const surface = solid[nthSurface];
      for (let nthPath = 0; nthPath < surface.length; nthPath++) {
        const path = surface[nthPath];
        let last = path.length - 1;
        for (let current = 0; current < path.length; last = current++) {
          const start = path[last];
          const end = path[current];
          const midpoint = scale(0.5, add(start, end));
          const direction = subtract(end, start);
          const span = length(direction);
          const matches = tree.intersectSphere(...midpoint, span / 2 + 1);
          const colinear = [];
          for (const match of matches) {
            const point = points.slice(match, match + 3);
            if (equals(point, start)) continue;
            if (equals(point, end)) continue;
            if (distance(start, point) + distance(point, end) === span) {
              // The point is approximately colinear and upon the segment.
              colinear.push(point);
            }
          }
          colinear.sort((a, b) => distance(start, a) - distance(start, b));
          path.splice(current, 0, ...colinear);
          current += colinear.length;
        }
        surface[nthPath] = deduplicate(path);
        assertUnique(surface[nthPath]);
      }
    }
    fixed.push({ solid });
  }
  return fixed;
};

/**
 * Translates a polygon array [[[x, y, z], [x, y, z], ...]] to ascii STL.
 * The exterior side of a polygon is determined by a CCW point ordering.
 *
 * @param {Object} options.
 * @param {Polygon Array} polygons - An array of arrays of points.
 * @returns {String} - the ascii STL output.
 */

const geometryToTriangles = (solids) => {
  const triangles = [];
  for (const { solid } of solids) {
    // FIX: Should already be convex.
    // let convex = makeSurfacesConvex(solid);
    for (const surface of solid) {
      for (const triangle of toTriangles({}, surface)) {
        assertUnique(triangle);
        triangles.push(triangle);
      }
    }
  }
  return triangles;
};

const toStl = async (options = {}, geometry) => {
  const { doFixTJunctions = true } = options;
  const keptGeometry = toKeptGeometry(geometry);
  let solids = getSolids(keptGeometry);
  if (doFixTJunctions) {
    solids = fixTJunctions(solids);
  }
  const triangles = geometryToTriangles(solids);
  return `solid JSxCAD\n${convertToFacets(options, canonicalize(triangles))}\nendsolid JSxCAD\n`;
};

const convertToFacets = (options, polygons) =>
  polygons.map(convertToFacet).filter(facet => facet !== undefined).join('\n');

const toStlVector = vector =>
  `${vector[0]} ${vector[1]} ${vector[2]}`;

const toStlVertex = vertex =>
  `vertex ${toStlVector(vertex)}`;

const convertToFacet = (polygon) => {
  const plane = toPlane(polygon);
  if (plane !== undefined) {
    return `facet normal ${toStlVector(toPlane(polygon))}\n` +
           `outer loop\n` +
           `${toStlVertex(polygon[0])}\n` +
           `${toStlVertex(polygon[1])}\n` +
           `${toStlVertex(polygon[2])}\n` +
           `endloop\n` +
           `endfacet`;
  }
};

export { fromStl, toStl };
