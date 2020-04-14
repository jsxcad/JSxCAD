import { length, scale, dot } from './jsxcad-math-vec3.js';

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

// This produces a half-edge mesh.

let id = 0;

const fromSolid = (solid, normalize) => {
  const twinMap = new Map();
  const loops = [];

  for (const surface of solid) {
    for (const path of surface) {
      let first = undefined;
      let last = undefined;
      for (let nth = 0; nth < path.length; nth++) {
        const thisPoint = normalize(path[nth]);
        const nextPoint = normalize(path[(nth + 1) % path.length]);
        const edge = createEdge(thisPoint);
        edge.id = id++;
        // nextPoint will be the start of the twin.
        const twins = twinMap.get(nextPoint);
        if (twins === undefined) {
          twinMap.set(nextPoint, [edge]);
        } else {
          twins.push(edge);
        }
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
            candidate.twin = link;
            link.twin = candidate;
            break;
          }
        }
      }
      link = link.next;
    } while (link !== loop);
  }

  return loops;
};

const fromSurface = (surface, normalize) => fromSolid([surface], normalize);

const fromPolygons = (polygons, normalize) => fromSurface(polygons, normalize);

// Note that merging produces duplicate points.

const merge = (loops, noIslands = false) => {
  const merged = [];
  const faces = new Set();
  for (let loop of loops) {
    let link = loop;
    do {
      if (link.twin !== undefined && (noIslands == false || link.face !== link.twin.face)) {
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
      // Ensure face coherence.
      link.next.face = link.face;
      link = link.next;
    } while (link !== loop);
    if (!faces.has(loop.face)) {
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
      if (polygon.length === 0 || polygon[polygon.length - 1] !== edge.start) {
        polygon.push(edge.start);
      }
    }
    if (polygon[polygon.length - 1] === polygon[0]) {
      polygon.pop();
    }
    if (polygon.length >= 3) {
      polygons.push(polygon);
    }
  }
  return polygons;
};

const mergeCoplanarPolygons = (polygons, normalize, noIslands = false) => toPolygons(merge(fromPolygons(polygons, normalize), noIslands));

const X = 0;
const Y = 1;
const Z = 2;
const W = 3;

// Newell's method for computing the plane of a polygon.
const toPlane = (start) => {
  const normal = [0, 0, 0];
  const reference = [0, 0, 0];
  // Run around the ring.
  let last = start;
  let size = 0;
  for (let edge = start.next; edge !== start; last = edge, edge = edge.next) {
    const lastPoint = last.start;
    const thisPoint = edge.start;
    normal[X] += (lastPoint[Y] - thisPoint[Y]) * (lastPoint[Z] + thisPoint[Z]);
    normal[Y] += (lastPoint[Z] - thisPoint[Z]) * (lastPoint[X] + thisPoint[X]);
    normal[Z] += (lastPoint[X] - thisPoint[X]) * (lastPoint[Y] + thisPoint[Y]);
    reference[X] += lastPoint[X];
    reference[Y] += lastPoint[Y];
    reference[Z] += lastPoint[Z];
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

export { fromSolid, fromSurface, mergeCoplanarPolygons, toPlane, toPolygons };
