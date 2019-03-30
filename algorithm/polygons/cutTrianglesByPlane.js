import { canonicalize, dot, equals, lerp, subtract } from '@jsxcad/math-vec3';
import { measureArea } from '@jsxcad/algorithm-path';

const EPSILON = 1e-5;

// Points
const COPLANAR = 0; // Neither front nor back.
const FRONT = 1;
const BACK = 2;
const SPANNING = 3; // Both front and back.

// Edges
const START = 0;
const END = 1;

// Dimensions
const W = 3;

const toType = (plane, point) => {
  let t = dot(plane, point) - plane[W];
  if (t < -EPSILON) {
    return BACK;
  } else if (t > EPSILON) {
    return FRONT;
  } else {
    return COPLANAR;
  }
};

const spanPoint = (plane, startPoint, endPoint) => {
  let t = (plane[W] - dot(plane, startPoint)) / dot(plane, subtract(endPoint, startPoint));
  return canonicalize(lerp(t, startPoint, endPoint));
};

const equalsEdge = ([aStart, aEnd], [bStart, bEnd]) => equals(aStart, bStart) && equals(aEnd, bEnd);

/**
 * Takes a cross-section of a triangulated solid at a plane, yielding surface defining loops
 * in that plane.
 *
 * FIX: Make sure this works properly for solids with holes in them, etc.
 * FIX: Figure out where the duplicate paths are coming from and see if we can avoid deduplication.
 */
export const cutTrianglesByPlane = (plane, triangles) => {
  let edges = [];
  const addEdge = (start, end) => edges.push([start, end].sort());

  // Find the edges along the plane and fold them into paths to produce a set of closed loops.
  for (let nth = 0; nth < triangles.length; nth++) {
    const triangle = triangles[nth];
    const [a, b, c] = triangle;
    const [aType, bType, cType] = [toType(plane, a), toType(plane, b), toType(plane, c)];

    if (aType === COPLANAR && bType === COPLANAR && cType === COPLANAR) {
      // addEdge(a, b);
      // addEdge(b, c);
      // addEdge(c, a);
    } else if ((aType | bType) === SPANNING && (bType | cType) === SPANNING) { // a-b, b-c
      addEdge(spanPoint(plane, a, b), spanPoint(plane, b, c));
    } else if ((aType | bType) === SPANNING && (cType | aType) === SPANNING) { // a-b, c-a
      addEdge(spanPoint(plane, a, b), spanPoint(plane, c, a));
    } else if ((bType | cType) === SPANNING && (cType | aType) === SPANNING) { // b-c, c-a
      addEdge(spanPoint(plane, b, c), spanPoint(plane, c, a));
    } else if ((aType === COPLANAR) && (bType | cType) === SPANNING) {
      addEdge(a, spanPoint(plane, b, c));
    } else if ((bType === COPLANAR) && (cType | aType) === SPANNING) {
      addEdge(b, spanPoint(plane, c, a));
    } else if ((cType === COPLANAR) && (aType | bType) === SPANNING) {
      addEdge(c, spanPoint(plane, a, b));
    } else if ((aType === COPLANAR) && (bType === COPLANAR)) {
      addEdge(a, b);
    } else if ((aType === COPLANAR) && (cType === COPLANAR)) {
      addEdge(a, c);
    } else if ((bType === COPLANAR) && (cType === COPLANAR)) {
      addEdge(b, c);
    } else {
      // The remaining cases are where corners touch.
      // No edge added.
    }
  }

  const extractSuccessor = (edges, edge) => {
    // FIX: Use a binary search to take advantage of the sorting of the edges.
    for (let nth = 0; nth < edges.length; nth++) {
      const candidate = edges[nth];
      if (equals(candidate[START], edge[END])) {
        edges.splice(nth, 1);
        return candidate;
      } else if (equals(candidate[END], edge[END])) {
        edges.splice(nth, 1);
        return candidate.reverse();
      }
    }
    throw Error('die');
  };

  // Sort the edges so that deduplication is efficient.
  edges.sort();

  // Deduplicate.
  {
    // FIX: Figure out where the duplicates are coming from.
    const deduped = [];
    for (const edge of edges) {
      if (deduped.length === 0 || !equalsEdge(edge, deduped[deduped.length - 1])) {
        deduped.push(edge);
      }
    }
    edges = deduped;
  }

  // Assemble the edges into loops which are closed paths.
  const loops = [];
  while (edges.length > 0) {
    let edge = edges.shift();
    const loop = [edge[START]];
    while (!equals(edge[END], loop[0])) {
      edge = extractSuccessor(edges, edge);
      loop.push(edge[START]);
    }
    // Ensure loop is correctly turned.
    if (measureArea(loop) < 0) {
      // Assume it is an exterior loop for now.
      // FIX: Do it properly.
      loop.reverse();
    }
    loops.push(loop);
  }

  return loops;
};
