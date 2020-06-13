import { Shape, log } from '@jsxcad/api-v1-shape';

/**
 *
 * # Unfold
 *
 **/

// FIX: Does not handle convex solids.
export const unfold = (shape) => {
  const faces = shape.faces((f) => f);
  log(`Face count is ${faces.length}`);
  const faceByEdge = new Map();

  for (const face of faces) {
    for (const edge of face.faceEdges()) {
      faceByEdge.set(edge, face);
    }
  }

  const reverseEdge = (edge) => {
    const [a, b] = edge.split(':');
    const reversedEdge = `${b}:${a}`;
    return reversedEdge;
  };

  const seen = new Set();
  const queue = [];

  const enqueueNeighbors = (face) => {
    for (const edge of face.faceEdges()) {
      const redge = reverseEdge(edge);
      const neighbor = faceByEdge.get(redge);
      if (neighbor === undefined || seen.has(neighbor)) continue;
      seen.add(neighbor);
      queue.push({
        face: neighbor,
        to: `face/edge:${edge}`,
        from: `face/edge:${redge}`,
      });
    }
  };

  let root = faces[0];
  enqueueNeighbors(root);

  while (queue.length > 0) {
    const { face, from, to } = queue.shift();
    seen.add(face);
    const fromConnector = face.connector(from);
    const toConnector = root.connector(to);
    if (fromConnector === undefined) {
      log('bad from');
      continue;
    }
    if (toConnector === undefined) {
      log('bad to');
      continue;
    }
    root = fromConnector.to(toConnector);
    if (root === undefined) break;
    enqueueNeighbors(face);
  }

  return root;
};

const method = function (...args) {
  return unfold(this, ...args);
};
Shape.prototype.unfold = method;

export default unfold;
