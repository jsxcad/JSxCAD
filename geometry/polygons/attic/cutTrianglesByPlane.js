import { canonicalize, dot, equals, lerp, subtract } from '@jsxcad/math-vec3';
import { edgesToPolygons } from './edgesToPolygons';

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
const Z = 2;
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

const closePathMaybe = (openPaths, closedPaths, path, nth) => {
  if (equals(path[0][START], path[path.length - 1][END])) {
    console.log(`QQ/closePathMaybe: ${JSON.stringify(path)}`);
    // The path was closed.
    closedPaths.push(path);
    openPaths.splice(nth, 1);
  }
}

const spanPoint = (plane, startPoint, endPoint) => {
  let t = (plane[W] - dot(plane, startPoint)) / dot(plane, subtract(endPoint, startPoint));
  return canonicalize(lerp(t, startPoint, endPoint));
}

const edges = [];

const addEdge = (openPaths, closedPaths, start, end) => {
  for (const edge of edges) {
    if ((equals(start, edge[0]) && equals(end, edge[1])) ||
        (equals(start, edge[1]) && equals(end, edge[0]))) {
      console.log(`Duplicate edge: ${JSON.stringify([start, end ])}`);
      return;
    }
  }
  edges.push([start, end]);
console.log(`QQ/addEdge/try: ${JSON.stringify(start)} <-> ${JSON.stringify(end)}`);
  for (let nth = 0; nth < openPaths.length; nth++) {
    const path = openPaths[nth];
    if (equals(path[0][START], end)) {
      // Extend the front of an existing path.
      path.unshift([start, end]);
      closePathMaybe(openPaths, closedPaths, path, nth);
      return;
    } else if (equals(path[0][START], start)) {
      // Reverse the edge to extend the front of an existing path.
      path.unshift([end, start]);
      closePathMaybe(openPaths, closedPaths, path, nth);
      return;
    } else {
      const pathLast = path[path.length - 1];
      if (equals(pathLast[END], start)) {
        // Extend the end of an existing path.
        path.push([start, end]);
        closePathMaybe(openPaths, closedPaths, path, nth);
        return;
      } else if (equals(pathLast[END], end)) {
        // Reverse the edge to extend the end of an existing path.
        path.push([end, start]);
        closePathMaybe(openPaths, closedPaths, path, nth);
        return;
      }
    }
  }
  // There are no open paths to extend, add a new open path.
  openPaths.push([[start, end]]);
}

export const cutTrianglesByPlane = (plane, triangles) => {
console.log(`QQ/triangles/length: ${triangles.length}`);
  // Note: These are paths of edges, not points.
  const openPaths = [];
  const closedPaths = [];
  const dropped = [];
  let length = 0;

  // Find the edges along the plane and fold them into paths to produce a set of closed loops.
  for (let nth = 0; nth < triangles.length; nth++) {
    const triangle = triangles[nth];
console.log(`QQ/addEdge/possible: ${nth}`);
console.log(`QQ/addEdge/triangles/length: ${triangles.length}`);
    const [a, b, c] = triangle;
    const [aType, bType, cType] = [toType(plane, a), toType(plane, b), toType(plane, c)];

    if (aType === COPLANAR && bType === COPLANAR && cType === COPLANAR) {
      addEdge(openPaths, closedPaths, a, b);
      addEdge(openPaths, closedPaths, b, c);
      addEdge(openPaths, closedPaths, c, a);
    } else if ((aType | bType) === SPANNING && (bType | cType) === SPANNING) { // a-b, b-c
      addEdge(openPaths, closedPaths, spanPoint(plane, a, b), spanPoint(plane, b, c));
    } else if ((aType | bType) === SPANNING && (cType | aType) === SPANNING) { // a-b, c-a
      addEdge(openPaths, closedPaths, spanPoint(plane, a, b), spanPoint(plane, c, a));
    } else if ((bType | cType) === SPANNING && (cType | aType) === SPANNING) { // b-c, c-a
      addEdge(openPaths, closedPaths, spanPoint(plane, b, c), spanPoint(plane, c, a));
    } else if ((aType === COPLANAR) && (bType | cType) === SPANNING) {
      addEdge(openPaths, closedPaths, a, spanPoint(plane, b, c));
    } else if ((bType === COPLANAR) && (cType | aType) === SPANNING) {
      addEdge(openPaths, closedPaths, b, spanPoint(plane, c, a));
    } else if ((cType === COPLANAR) && (aType | bType) === SPANNING) {
      addEdge(openPaths, closedPaths, c, spanPoint(plane, a, b));
    } else if ((aType === COPLANAR) && (bType === COPLANAR)) {
      addEdge(openPaths, closedPaths, a, b);
    } else if ((aType === COPLANAR) && (cType === COPLANAR)) {
      addEdge(openPaths, closedPaths, a, c);
    } else if ((bType === COPLANAR) && (cType === COPLANAR)) {
      addEdge(openPaths, closedPaths, b, c);
    } else {
      dropped.push([triangle, [aType, bType, cType]]);
console.log(`QQ/addEdge/notry`);
      // The remaining cases are where corners touch.
      // No edge added.
      console.log(`QQ/addEdge/none/triangle: ${JSON.stringify(triangle)}`);
      console.log(`QQ/addEdge/none/triangle/type: ${JSON.stringify([aType, bType, cType])}`);
    }
console.log(`QQ/openPaths: ${JSON.stringify(openPaths)}`);
console.log(`QQ/closedPaths: ${JSON.stringify(closedPaths)}`);
  }

  if (openPaths.length > 0) {
    console.log(`QQ/closedPaths: ${JSON.stringify(closedPaths)}`);
    console.log(`QQ/openPaths: ${JSON.stringify(openPaths)}`);
    console.log(`QQ/dropped: ${JSON.stringify(dropped)}`);
    // throw Error('die');
  }

  console.log(`graph { ${edges.map(([start, end]) => `"${JSON.stringify(start)}" -- "${JSON.stringify(end)}"`).join('; ')} }`);

  // Convert the edge paths to point paths.
  return closedPaths.map(edgePath => edgePath.map(([start, end]) => start));
};
