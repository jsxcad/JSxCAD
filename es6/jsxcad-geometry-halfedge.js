import { dot, length, scale } from './jsxcad-math-vec3.js';
import { toPlane as toPlane$1 } from './jsxcad-math-poly3.js';
import { pushWhenValid } from './jsxcad-geometry-polygons.js';

// This produces a half-edge link.

const createEdge = (start = [0, 0, 0], face = undefined, next = undefined, twin = undefined) => ({ start, face, next, twin });

const getEdges = (loop) => {
  let value = loop;
  let done = false;
  return {
    next: () => {
      const result = { value, done };
      value = value.next;
      if (value === loop) {
        done = true;
      }
      return result;
    },
    [Symbol.iterator]: function () { return this; }
  };
};

let id = 0;
const Z = 2;

const fromSolid = (solid, normalize, closed = true) => {
  const twinMap = new Map();
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
        for (const candidate of candidates) {
          if (candidate.start === link.next.start) {
            if (candidate.twin === undefined) {
              candidate.twin = link;
              link.twin = candidate;
            } else {
              // console.log(`QQ/twin: ${JSON.stringify(toPolygons([candidate.twin]))}`);
              // console.log(`QQ/candidate: ${JSON.stringify(toPolygons([candidate]))}`);
              // console.log(`QQ/link: ${JSON.stringify(toPolygons([link]))}`);
              // throw Error('die');
              for (const edge of getEdges(link)) {
                edge.face = undefined;
              }
            }
            break;
          }
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
      for (const edge of getEdges(loop)) {
        edgeCount += 1;
        if (edge.twin === undefined) {
          // A hole in the 2-manifold.
          holeCount += 1;
          edge.start[Z] += 1;
        }
      }
    }
  }

  console.log(`QQ/edgeCount: ${edgeCount}`);
  console.log(`QQ/holeCount: ${holeCount}`);

  return loops;
};

const THRESHOLD = 0.99999;

const equalsPlane = (a, b) => {
  const t = dot(a, b);
  if (t >= THRESHOLD) {
    return true;
  } else {
    return false;
  }
};

const junctionSelector = (solid, normalize) => {
  const planesOfPoint = new Map();

  const getPlanesOfPoint = (point) => {
    let planes = planesOfPoint.get(point);
    if (planes === undefined) {
      planes = [];
      planesOfPoint.set(point, planes);
    }
    return planes;
  };

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
  const select = (point) => getPlanesOfPoint(point).length >= 3;

  return select;
};

const X = 0;
const Y = 1;
const Z$1 = 2;
const W = 3;

const toPlane = (loop) => {
  if (loop.face.plane === undefined) {
    loop.face.plane = toPlaneFromLoop(loop.face);
  }
  return loop.face.plane;
};

// Newell's method for computing the plane of a polygon.
const toPlaneFromLoop = (start) => {
  const normal = [0, 0, 0];
  const reference = [0, 0, 0];
  // Run around the ring.
  let last = start;
  let size = 0;
  for (let edge = start.next; edge !== start; last = edge, edge = edge.next) {
    const lastPoint = last.start;
    const thisPoint = edge.start;
    normal[X] += (lastPoint[Y] - thisPoint[Y]) * (lastPoint[Z$1] + thisPoint[Z$1]);
    normal[Y] += (lastPoint[Z$1] - thisPoint[Z$1]) * (lastPoint[X] + thisPoint[X]);
    normal[Z$1] += (lastPoint[X] - thisPoint[X]) * (lastPoint[Y] + thisPoint[Y]);
    reference[X] += lastPoint[X];
    reference[Y] += lastPoint[Y];
    reference[Z$1] += lastPoint[Z$1];
    size += 1;
  }
  const factor = 1 / length(normal);
  const plane = scale(factor, normal);
  plane[W] = dot(reference, normal) * factor / size;
  if (isNaN(plane[X])) {
    return undefined;
  } else {
    return plane;
  }
};

// Note that merging produces duplicate points.

const merge = (loops, noIslands = false, selectJunction = (_ => false)) => {
  const merged = [];
  const faces = new Set();
  for (let loop of loops) {
    if (loop.face === undefined) continue;
    let link = loop;
    do {
      if (link.twin !== undefined && link.twin.face !== undefined) {
        if (noIslands === false || link.face !== link.twin.face) {
          if (equalsPlane(toPlane(link), toPlane(link.twin))) {
            // Linking a face to itself is the only way to produce a new island.

            // Edge collapse produces a duplicate in order to preserve twin edge identity.
            const twin = link.twin;
            if (twin.start !== link.next.start) {
              throw Error('die');
            }
            if (twin.next.start !== link.start) {
              throw Error('die');
            }
            const linkNext = link.next;
            const twinNext = twin.next;
            link.next = twinNext;
            twin.next = linkNext;
            // The collapsed edges do not have twins.
            link.twin = undefined;
            twin.twin = undefined;
            // Make sure that the face stays coherent.
            loop = link;
            if (link.start !== link.next.start) {
              throw Error('die');
            }
            if (twin.start !== twin.next.start) {
              throw Error('die');
            }
          }
        }
      }
      // Ensure face coherence.
      link.next.face = link.face;
      link = link.next;
    } while (link !== loop);
    if (loop.face !== undefined && !faces.has(loop.face)) {
      faces.add(loop.face);
      merged.push(loop);
    }
  }
  return merged;
};

const toPolygons = (loops) => {
  const polygons = [];
  for (const loop of loops) {
    const polygon = [];
    for (const edge of getEdges(loop)) {
      if (edge.face !== undefined) {
        polygon.push(edge.start);
      }
    }
    pushWhenValid(polygons, polygon);
  }
  return polygons;
};

const walked = Symbol('walked');

// FIX: Coplanar surface coherence.
const toSolid = (loops) => {
  const solid = [];

  const walk = (loop) => {
    if (loop === undefined || loop[walked]) return;
    loop[walked] = true;
    const path = [];
    let link = loop;
    do {
      path.push(link.start);
      walk(link.twin);
      link = link.next;
    } while (link !== loop);
    solid.push([path]);
  };

  walk(loops[0]);

  return solid;
};

const cleanSolid = (solid, normalize) => {
  const loops = fromSolid(solid, normalize, /* closed= */true);
  const selectJunction = junctionSelector(solid, normalize);
  const merged = merge(loops, /* noIslands= */false, selectJunction);
  // const merged = loops;
  const shell = toSolid(merged);
  return shell;
};

const fromSurface = (surface, normalize) => fromSolid([surface], normalize, /* closed= */false);

const fromPolygons = (polygons, normalize) => fromSurface(polygons, normalize);

const mergeCoplanarPolygons = (polygons, normalize, noIslands = false) => toPolygons(merge(fromPolygons(polygons, normalize), noIslands));

export { cleanSolid, fromSolid, fromSurface, mergeCoplanarPolygons, toPlane, toPolygons, toSolid };
