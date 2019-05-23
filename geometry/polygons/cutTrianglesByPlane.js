import { canonicalize, dot, equals, lerp, subtract } from '@jsxcad/math-vec3';

const EPSILON = 1e-5;

// Point Classification.
const COPLANAR = 0;
const FRONT = 1;
const BACK = 2;

// Edge Properties.
const START = 0;
const END = 1;

// Plane Properties.
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

const lexicographcalPointOrder = ([aX, aY, aZ], [bX, bY, bZ]) => {
  if (aX < bX) { return -1; }
  if (aX > bX) { return 1; }
  if (aY < bY) { return -1; }
  if (aY > bY) { return 1; }
  if (aZ < bZ) { return -1; }
  if (aZ > bZ) { return 1; }
  return 0;
};

/**
 * Takes a cross-section of a triangulated solid at a plane, yielding surface defining loops
 * in that plane.
 *
 * FIX: Make sure this works properly for solids with holes in them, etc.
 * FIX: Figure out where the duplicate paths are coming from and see if we can avoid deduplication.
 */
export const cutTrianglesByPlane = ({ allowOpenPaths = false }, plane, triangles) => {
  let edges = [];
  const addEdge = (start, end) => {
    edges.push([canonicalize(start), canonicalize(end)]);
  };

  // Find the edges along the plane and fold them into paths to produce a set of closed loops.
  for (let nth = 0; nth < triangles.length; nth++) {
    const triangle = triangles[nth];
    const [a, b, c] = triangle;
    const [aType, bType, cType] = [toType(plane, a), toType(plane, b), toType(plane, c)];

    switch (aType) {
      case FRONT:
        switch (bType) {
          case FRONT:
            switch (cType) {
              case FRONT:
                // No intersection.
                break;
              case COPLANAR:
                // Corner touches.
                break;
              case BACK:
                // b-c down c-a up
                addEdge(spanPoint(plane, b, c), spanPoint(plane, c, a));
                break;
            }
            break;
          case COPLANAR:
            switch (cType) {
              case FRONT:
                // Corner touches.
                break;
              case COPLANAR:
                // b-c along plane.
                addEdge(b, c);
                break;
              case BACK:
                // down at b, up c-a.
                addEdge(b, spanPoint(plane, c, a));
                break;
            }
            break;
          case BACK:
            switch (cType) {
              case FRONT:
                // a-b down, b-c up.
                addEdge(spanPoint(plane, a, b), spanPoint(plane, b, c));
                break;
              case COPLANAR:
                // a-b down, c up.
                addEdge(spanPoint(plane, a, b), c);
                break;
              case BACK:
                // a-b down, c-a up.
                addEdge(spanPoint(plane, a, b), spanPoint(plane, c, a));
                break;
            }
            break;
        }
        break;
      case COPLANAR:
        switch (bType) {
          case FRONT:
            switch (cType) {
              case FRONT:
                // Corner touches.
                break;
              case COPLANAR:
                // c-a along plane.
                addEdge(c, a);
                break;
              case BACK:
                // down at b-c, up at a
                addEdge(spanPoint(plane, b, c), a);
                break;
            }
            break;
          case COPLANAR:
            switch (cType) {
              case FRONT:
                // a-b along plane.
                addEdge(a, b);
                break;
              case COPLANAR:
                // Entirely coplanar -- doesn't cut.
                break;
              case BACK:
                // Wrong half-space.
                break;
            }
            break;
          case BACK:
            switch (cType) {
              case FRONT:
                // down at a, up at b-c.
                addEdge(a, spanPoint(plane, b, c));
                break;
              case COPLANAR:
                // Wrong half-space.
                break;
              case BACK:
                // Wrong half-space.
                break;
            }
            break;
        }
        break;
      case BACK:
        switch (bType) {
          case FRONT:
            switch (cType) {
              case FRONT:
                // down at c-a, up at a-b
                addEdge(spanPoint(plane, c, a), spanPoint(plane, a, b));
                break;
              case COPLANAR:
                // down at c, up at a-b
                addEdge(c, spanPoint(plane, a, b));
                break;
              case BACK:
                // down at b-c, up at a-b.
                addEdge(spanPoint(plane, b, c), spanPoint(plane, a, b));
                break;
            }
            break;
          case COPLANAR:
            switch (cType) {
              case FRONT:
                // down at c-a, up at b.
                addEdge(spanPoint(plane, c, a), b);
                break;
              case COPLANAR:
                // Wrong half-space.
                break;
              case BACK:
                // Wrong half-space.
                break;
            }
            break;
          case BACK:
            switch (cType) {
              case FRONT:
                // down at c-a, up at b-c.
                addEdge(spanPoint(plane, c, a), spanPoint(plane, b, c));
                break;
              case COPLANAR:
                // Wrong half-space.
                break;
              case BACK:
                // Wrong half-space.
                break;
            }
            break;
        }
        break;
    }
  }

  const extractSuccessor = (edges, start) => {
    // FIX: Use a binary search to take advantage of the sorting of the edges.
    for (let nth = 0; nth < edges.length; nth++) {
      const candidate = edges[nth];
      if (equals(candidate[START], start)) {
        edges.splice(nth, 1);
        return candidate;
      }
    }
    // Given manifold geometry, there must always be a successor.
    throw Error('Non-manifold');
  };

  // Sort the edges so that deduplication is efficient.
  edges.sort(lexicographcalPointOrder);

  // Assemble the edges into loops which are closed paths.
  const loops = [];
  while (edges.length > 0) {
    let edge = edges.shift();
    const loop = [edge[START]];
    try {
      while (!equals(edge[END], loop[0])) {
        edge = extractSuccessor(edges, edge[END]);
        loop.push(edge[START]);
      }
    } catch (e) {
      if (allowOpenPaths) {
        // FIX: Check the error.
        loop.unshift(null);
      } else {
        throw e;
      }
    }
    loops.push(loop);
  }

  return loops;
};
