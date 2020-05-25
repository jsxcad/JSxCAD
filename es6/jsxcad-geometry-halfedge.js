import { dot, length, scale } from './jsxcad-math-vec3.js';
import { toPlane as toPlane$1 } from './jsxcad-math-poly3.js';
import { pushWhenValid } from './jsxcad-geometry-polygons.js';

/**
 * @typedef {import("./types").Edge} Edge
 */

/**
 * @typedef {function(Edge): void} Thunk
 * @returns {void}
 */

/* @type {function(Edge, Thunk): void} */

/**
 * eachLink
 *
 * @function
 * @param {Edge} loop
 * @param {Thunk} thunk
 * @returns {void}
 */
const eachLink = (loop, thunk) => {
  let link = loop;
  do {
    thunk(link);
    if (link.dead === true) { throw Error('die/dead'); }
    if (link.next === undefined) { throw Error('die/next'); }
    link = link.next;
  } while (link !== loop);
};

/**
 * @typedef {import("./types").Plane} Plane
 * @typedef {import("./types").Point} Point
 * @typedef {import("./types").PointSelector} PointSelector
 * @typedef {import("./types").Normalizer} Normalizer
 * @typedef {import("./types").Solid} Solid
 */

const THRESHOLD = 0.99999;

/**
 * equalsPlane
 *
 * @function
 * @param {Plane} a
 * @param {Plane} b
 * @returns {boolean} b
 */
const equalsPlane = (a, b) => {
  if (a === undefined || b === undefined) {
    return false;
  }
  const t = dot(a, b);
  if (t >= THRESHOLD) {
    return true;
  } else {
    return false;
  }
};

/**
 * junctionSelector
 *
 * @function
 * @param {Solid} solid
 * @param {Normalizer} normalize
 * @returns {PointSelector}
 */
const junctionSelector = (solid, normalize) => {
  const planesOfPoint = new Map();

  /**
   * getPlanesOfPoint
   *
   * @param {Point} point
   * @returns {Array<Plane>}
   */
  const getPlanesOfPoint = (point) => {
    let planes = planesOfPoint.get(point);
    if (planes === undefined) {
      planes = [];
      planesOfPoint.set(point, planes);
    }
    return planes;
  };

  /**
   * considerJunction
   *
   * @param {Point} point
   * @param {Plane} planeOfPath
   * @returns {undefined}
   */
  const considerJunction = (point, planeOfPath) => {
    let planes = getPlanesOfPoint(point);
    for (const plane of planes) {
      if (equalsPlane(plane, planeOfPath)) {
        return;
      }
    }
    planes.push(planeOfPath);
  };

  for (const surface of solid) {
    for (const path of surface) {
      for (const point of path) {
        considerJunction(normalize(point), toPlane$1(path));
      }
    }
  }

  // A corner is defined as a point of intersection of three distinct planes.
  /** @type {PointSelector} */
  const select = (point) => getPlanesOfPoint(point).length >= 3;

  return select;
};

/**
 * @typedef {import("./types").Edge} Edge
 * @typedef {import("./types").Plane} Plane
 */

const X = 0;
const Y = 1;
const Z = 2;
const W = 3;

/**
 * toPlane
 *
 * @function
 * @param {Edge} loop
 * @param {boolean} recompute
 * @returns {Plane}
 */
const toPlane = (loop, recompute = false) => {
  if (loop.face.plane === undefined || recompute) {
    loop.face.plane = toPlaneFromLoop(loop.face);
  }
  return loop.face.plane;
};

/**
 * Newell's method for computing the plane of a polygon.
 *
 * @function
 * @param {Edge} start
 * @returns {Plane}
 */
const toPlaneFromLoop = (start) => {
  const normal = [0, 0, 0];
  const reference = [0, 0, 0];
  // Run around the ring.
  let size = 0;
  let link = start;
  do {
    const lastPoint = link.start;
    const thisPoint = link.next.start;
    if (lastPoint !== thisPoint) {
      normal[X] += (lastPoint[Y] - thisPoint[Y]) * (lastPoint[Z] + thisPoint[Z]);
      normal[Y] += (lastPoint[Z] - thisPoint[Z]) * (lastPoint[X] + thisPoint[X]);
      normal[Z] += (lastPoint[X] - thisPoint[X]) * (lastPoint[Y] + thisPoint[Y]);
      reference[X] += lastPoint[X];
      reference[Y] += lastPoint[Y];
      reference[Z] += lastPoint[Z];
      size += 1;
    }
    link = link.next;
  } while (link !== start);
  const factor = 1 / length(normal);
  const plane = scale(factor, normal);
  plane[W] = dot(reference, normal) * factor / size;
  if (isNaN(plane[X])) {
    return undefined;
  } else {
    return plane;
  }
};

/**
 * @typedef {import("./types").Edge} Edge
 * @typedef {import("./types").Plane} Plane
 * @typedef {import("./types").Point} Point
 */

// This produces a half-edge link.

/**
 * createEdge
 *
 * @function
 * @param {Point=} start
 * @param {Edge=} face
 * @param {Edge=} next
 * @param {Edge=} twin
 * @param {Array<Edge>=} holes
 * @param {Plane=} plane
 * @param {number=} id
 * @param {boolean=} dead
 * @param {boolean=} spurLinkage
 * @returns {Edge}
 */
const createEdge = (start = [0, 0, 0], face, next, twin, holes, plane, id, dead, spurLinkage) => ({ start, face, next, twin, holes, plane, id, dead, spurLinkage });

/**
 * @typedef {import("./types").Edge} Edge
 * @typedef {import("./types").Loops} Loops
 * @typedef {import("./types").Normalizer} Normalizer
 * @typedef {import("./types").Point} Point
 * @typedef {import("./types").Solid} Solid
 */

let id = 0;

/**
 * fromSolid
 *
 * @function
 * @param {Solid} solid
 * @param {Normalizer} normalize
 * @param {boolean} closed
 * @returns {Loops}
 */
const fromSolid = (solid, normalize, closed = true) => {
  const twinMap = new Map();
  /**
   * getTwins
   *
   * @param {Point} point
   * @returns {Array<Edge>}
   */
  const getTwins = (point) => {
    let twins = twinMap.get(point);
    if (twins === undefined) {
      twins = [];
      twinMap.set(point, twins);
    }
    return twins;
  };
  const loops = [];

  for (const surface of solid) {
    for (const path of surface) {
      let first;
      let last;
      for (let nth = 0; nth < path.length; nth++) {
        const thisPoint = normalize(path[nth]);
        const nextPoint = normalize(path[(nth + 1) % path.length]);
        const edge = createEdge(thisPoint);
        edge.id = id++;
        // nextPoint will be the start of the twin.
        getTwins(nextPoint).push(edge);
        if (first === undefined) {
          first = edge;
        }
        if (last !== undefined) {
          last.next = edge;
        }
        // Any arbitrary link will serve for face identity.
        edge.face = first;
        last = edge;
      }
      if (first === undefined) {
        throw Error(`die: ${JSON.stringify(path)}`);
      }
      // Close the loop.
      last.next = first;
      // And collect the closed loop.
      loops.push(first);
    }
  }

  // Bridge the edges.
  for (const loop of loops) {
    let link = loop;
    do {
      if (link.twin === undefined) {
        const candidates = twinMap.get(link.start);
        if (candidates === undefined) {
          throw Error('die');
        }
        // FIX: Assert one or zero twins?
        // Find the candidate that starts where we end.
        let count = 0;
        for (const candidate of candidates) {
          if (candidate.start === link.next.start) {
            count += 1;
            if (candidate.twin === undefined) {
              candidate.twin = link;
              link.twin = candidate;
            } else {
              // console.log(`QQ/twin: ${JSON.stringify(toPolygons([candidate.twin]))}`);
              // console.log(`QQ/candidate: ${JSON.stringify(toPolygons([candidate]))}`);
              // console.log(`QQ/link: ${JSON.stringify(toPolygons([link]))}`);
              throw Error('die');
            }
          }
        }
        if (count > 1) {
          console.log(`QQ/fromSolid/twins: multiple ${link.start} -> ${link.next.start}`);
        } else if (count === 0) {
          console.log(`QQ/fromSolid/twins: none ${link.start} -> ${link.next.start} ${link.face.id}`);
        }
      }
      link = link.next;
    } while (link !== loop);
  }

  let holeCount = 0;
  let edgeCount = 0;

  if (closed) {
    for (const loop of loops) {
      if (loop.face === undefined) continue;
      eachLink(loop,
               edge => {
                 edgeCount += 1;
                 if (edge.twin === undefined) {
                   // A hole in the 2-manifold.
                   holeCount += 1;
                 }
               });
    }
  }

  console.log(`QQ/edgeCount: ${edgeCount}`);
  console.log(`QQ/holeCount: ${holeCount}`);

  return loops;
};

/**
 * @typedef {import("./types").Edge} Edge
 * @typedef {import("./types").Loops} Loops
 */

const merged = Symbol('merged');

/**
 * merge
 *
 * @function
 * @param {Loops} loops
 * @returns {Loops}
 */
const merge = (loops) => {
  /**
   * walk
   *
   * @param {Edge} loop
   * @returns {Edge}
   */
  const walk = (loop) => {
    if (loop[merged] || loop.next === undefined) return;
    eachLink(loop, link => { link[merged] = true; });
    let link = loop;
    const twin = link.twin;
    do {
      // Ensure face cohesion.
      link.face = loop;
      if (twin === undefined) {
console.log(`QQ/merge/twin/no: ${link.id}`);
        // Do nothing.
      } else if (twin.face === link.face) {
console.log(`QQ/merge/twin/self: ${link.id}`);
        // Do nothing.
      } else if (twin === link.next) {
console.log(`QQ/merge/twin/spur: ${link.id}`);
        // Do nothing.
      } else if (equalsPlane(toPlane(link), toPlane(twin))) {
console.log(`QQ/Merge: ${link.id} face: ${loop.face.id}`);
        // Merge the loops.
        const linkNext = link.next;
        const twinNext = twin.next;

        if (linkNext.dead) throw Error('die');
        if (twinNext.dead) throw Error('die');
        if (twin.twin !== link) throw Error('die');

        if (twinNext === link) throw Error('die');
        if (linkNext === twin) throw Error('die');

        link.twin = undefined;
        twin.twin = undefined;

        Object.assign(link, twinNext);
        link.from = twinNext;
        twinNext.to = link;

        Object.assign(twin, linkNext);
        twin.from = linkNext;
        linkNext.to = twin;

        if (link.twin) {
          link.twin.twin = link;
        }

        if (twin.twin) {
          twin.twin.twin = twin;
        }

        if (twin.next === twin) throw Error('die');

        linkNext.face = undefined;
        linkNext.next = undefined;
        linkNext.twin = undefined;
        linkNext.dead = true;
        linkNext.id -= 1000000;

        twinNext.face = undefined;
        twinNext.next = undefined;
        twinNext.twin = undefined;
        twinNext.dead = true;
        twinNext.id -= 1000000;

        // Ensure we do a complete pass over the merged loop.
        loop = link;

        // Update face affinity to detect self-merging.
        do {
          link.face = loop;
          link = link.next;
        } while (link !== loop);
      }
      if (link.next === undefined) { throw Error('die'); }
      link = link.next;
      if (link.to !== undefined) { throw Error('die'); }
    } while (link !== loop);
    while (link !== link.face) link = link.face;
    return link.face;
  };

  for (const loop of loops) {
    let link = loop;
    do {
      if (link.twin) {
        if (link.twin.start !== link.next.start) throw Error('die');
        if (link.twin.next.start !== link.start) throw Error('die');
      }
      if (link.dead) {
        throw Error('die');
      }
      link = link.next;
    } while (link !== loop);
  }

  const seen = new Set();
  const filtered = [];
  for (const loop of loops.map(walk)) {
    if (loop === undefined) continue;
    if (loop.next === undefined) continue;
    if (loop.face === undefined) continue;
    if (loop.dead !== undefined) continue;
    let link = loop;
    do {
      if (link.face.id !== loop.face.id) throw Error('die');
      link = link.next;
    } while (link !== loop);
    if (seen.has(loop.face)) ; else {
      seen.add(loop.face);
      // We're getting the wrong ones in here, sometimes.
      filtered.push(loop);
    }
  }
  return filtered;
};

/**
 * @typedef {import("./types").Loops} Loops
 * @typedef {import("./types").Polygons} Polygons
 */

/**
 * toPolygons
 *
 * @function
 * @param {Loops} loops
 * @returns {Polygons}
 */
const toPolygons = (loops) => {
  const polygons = [];
  for (const loop of loops) {
    const polygon = [];
    eachLink(loop,
             edge => {
               if (edge.face !== undefined) {
                 polygon.push(edge.start);
               }
             });
    pushWhenValid(polygons, polygon);
  }
  return polygons;
};

/**
 * @typedef {import("./types").Edge} Edge
 * @typedef {import("./types").Loops} Loops
 * @typedef {import("./types").PointSelector} PointSelector
 * @typedef {import("./types").Solid} Solid
 */

const walked = Symbol('walked');

/*
const pushPolygon = (polygons, loop) => {
  const polygon = [];
  eachLink(loop, link => polygon.push(link.start));
  polygons.push(polygon);
};
*/

// FIX: Coplanar surface coherence.
/**
 * toSolid
 *
 * @function
 * @param {Loops} loops
 * @param {PointSelector} selectJunction
 * @returns {Solid}
 */
const toSolid = (loops, selectJunction) => {
  const solid = [];

  /**
   * walk
   *
   * @param {Edge} loop
   * @returns {void}
   */
  const walk = (loop) => {
    if (loop === undefined || loop[walked] || loop.face === undefined) return;
    eachLink(loop, (link) => { link[walked] = true; });
    eachLink(loop, (link) => walk(link.twin));
    const polygons = toPolygons([loop]);
/*
    const polygons = [];
    pushConvexPolygons(polygons, loop, selectJunction);
    if (polygons.length === 0) {
      console.log(`QQ/toSolid/polygons/none`);
      pushConvexPolygons(polygons, loop, selectJunction);
    }
    // pushPolygon(polygons, loop);
*/
    solid.push(polygons);
  };

  for (const loop of loops) {
    walk(loop);
  }

  return solid;
};

/**
 * @typedef {import("./types").Normalizer} Normalizer
 * @typedef {import("./types").Solid} Solid
 */

/**
 * CleanSolid produces a defragmented version of a solid, while maintaining watertightness.
 *
 * @function
 * @param {Solid} solid
 * @param {Normalizer} normalize
 * @returns {Solid}
 */
const cleanSolid = (solid, normalize) => {
  for (const surface of solid) {
    console.log(`QQ/surface/length: ${surface.length}`);
  }
  const loops = fromSolid(solid, normalize, /* closed= */true);
  console.log(`QQ/loops/length: ${loops.length}`);
  const selectJunction = junctionSelector(solid, normalize);
  const mergedLoops = merge(loops);
  // const cleanedLoops = clean(mergedLoops);
  // const splitLoops = split(cleanedLoops);
  return toSolid(mergedLoops);
  // return toSolid(mergedLoops, p => true, false);
  // return solid;
};

/**
 * @typedef {import("./types").Loops} Loops
 * @typedef {import("./types").Normalizer} Normalizer
 * @typedef {import("./types").Surface} Surface
 */

/**
 * fromSurface
 *
 * @function
 * @param {Surface} surface
 * @param {Normalizer} normalize
 * @returns {Loops}
 */
const fromSurface = (surface, normalize) => fromSolid([surface], normalize, /* closed= */false);

/**
 * @typedef {import("./types").Normalizer} Normalizer
 * @typedef {import("./types").Solid} Solid
 */

/**
 * Produces the outline of a surface.
 *
 * @function
 * @param {Surface} surface
 * @param {Normalizer} normalize
 * @returns {Surface}
 */
const outlineSurface = (surface, normalize) => {
  const loops = fromSurface(surface, normalize);
  console.log(`QQ/loops/length: ${loops.length}`);
  const mergedLoops = merge(loops);
  // const cleanedLoops = clean(mergedLoops);
  // const splitLoops = split(cleanedLoops);
  return toPolygons(mergedLoops);
};

export { cleanSolid, fromSolid, fromSurface, junctionSelector, outlineSurface, toPlane, toPolygons, toSolid };
