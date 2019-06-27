import { equals as equalsVec3, squaredDistance } from '@jsxcad/math-vec3';

// Edge Properties.
const START = 0;
const END = 1;

const THRESHOLD = 1e-5;

const equals = (a, b) => {
  if (equalsVec3(a, b)) {
    return true;
  }
  if (squaredDistance(a, b) < THRESHOLD) {
    return true;
  }
  return false;
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

export const toLoops = ({ allowOpenPaths = false }, edges) => {
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

  /*
  console.log(`QQ/edges: ${JSON.stringify(edges)}`);
  console.log(`digraph {`);
  for (const edge of edges) {
    console.log(`"${JSON.stringify(edge[0])}" -> "${JSON.stringify(edge[1])}"`);
  }
  console.log(`}`);
*/

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
