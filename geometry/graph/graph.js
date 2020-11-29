import { equals as equalsPoint } from '@jsxcad/math-vec3';

export const create = () => ({ points: [], edges: [], loops: [], faces: [] });

export const addEdge = (graph, { point, next = -1, loop = -1, twin = -1 }) => {
  const edge = graph.edges.length;
  graph.edges.push({ point, loop, twin, next });
  return edge;
};

export const addFace = (graph, { plane, loop = -1 } = {}) => {
  const face = graph.faces.length;
  graph.faces.push({ plane, loop });
  return face;
};

export const addLoop = (graph, { edge = -1, face = -1 } = {}) => {
  const loop = graph.loops.length;
  graph.loops.push({ edge, face });
  if (face !== -1) {
    getFaceNode(graph, face).loop = loop;
  }
  return loop;
};

export const addLoopFromPoints = (graph, points, { face }) => {
  const loop = addLoop(graph);
  fillLoopFromPoints(graph, loop, points);
  const loopNode = getLoopNode(graph, loop);
  const faceNode = getFaceNode(graph, face);
  faceNode.loop = loop;
  loopNode.face = face;
  return loop;
};

export const addHoleFromPoints = (graph, points, { face }) => {
  const loop = addLoop(graph);
  fillLoopFromPoints(graph, loop, points);
  const loopNode = getLoopNode(graph, loop);
  const faceNode = getFaceNode(graph, face);
  if (!faceNode.holes) {
    faceNode.holes = [];
  }
  faceNode.holes.push(loop);
  loopNode.face = face;
  return loop;
};

export const fillLoopFromPoints = (graph, loop, points) => {
  const loopNode = getLoopNode(graph, loop);
  let lastEdgeNode;
  for (const coord of points) {
    const point = addPoint(graph, coord);
    const edge = addEdge(graph, { loop, point });
    if (lastEdgeNode) {
      lastEdgeNode.next = edge;
    } else {
      loopNode.edge = edge;
    }
    lastEdgeNode = getEdgeNode(graph, edge);
  }
  lastEdgeNode.next = loopNode.edge;
  return loop;
};

export const addLoopEdge = (graph, loop, { point, twin = -1 }) => {
  const loopNode = getLoopNode(graph, loop);
  const edge = addEdge(graph, { loop, point, twin });
  const edgeNode = getEdgeNode(graph, edge);
  if (loopNode.edge === -1) {
    edgeNode.next = edge;
  } else {
    const lastNode = getEdgeNode(graph, loopNode.edge);
    edgeNode.next = lastNode.next;
    lastNode.next = edge;
  }
  loopNode.edge = edge;
  return edge;
};

export const addPoint = (graph, point) => {
  for (let nth = 0; nth < graph.points.length; nth++) {
    if (equalsPoint(graph.points[nth], point)) {
      return nth;
    }
  }
  const id = graph.points.length;
  graph.points.push(point);
  return id;
};

export const deleteLoop = (graph, loop) =>
  eachLoopEdge(graph, loop, (edge, edgeNode) => {
    edgeNode.loop = -1;
  });

export const eachEdge = (graph, op) =>
  graph.edges.forEach((node, nth) => {
    if (node && node.isRemoved !== true) {
      op(nth, node);
    }
  });

export const eachFace = (graph, op) =>
  graph.faces.forEach((faceNode, face) => op(face, faceNode));

export const eachFaceEdge = (graph, face, op) =>
  eachFaceLoop(graph, face, (loop) => eachLoopEdge(graph, loop, op));

export const eachFaceLoop = (graph, face, op) => {
  const loop = getFaceNode(graph, face).loop;
  op(loop, getLoopNode(graph, loop));
};

export const eachFaceHole = (graph, face, op) => {
  const faceNode = getFaceNode(graph, face);
  if (faceNode.holes) {
    for (const hole of faceNode.holes) {
      op(hole, getLoopNode(graph, hole));
    }
  }
};

export const eachLoopEdge = (graph, loop, op) => {
  const start = getLoopNode(graph, loop).edge;
  if (start === -1) {
    return;
  }
  const limit = graph.edges.length;
  let count = 0;
  let edge = start;
  do {
    const edgeNode = graph.edges[edge];
    op(edge, edgeNode);
    edge = edgeNode.next;
    if (count++ > limit) {
      throw Error(`Infinite edge loop`);
    }
  } while (edge !== start);
};

export const getEdgeNode = (graph, edge) => graph.edges[edge];
export const getFaceNode = (graph, face) => graph.faces[face];
export const getFacePlane = (graph, face) => graph.faces[face].plane;
export const getLoopNode = (graph, loop) => graph.loops[loop];
export const getPointNode = (graph, point) => graph.points[point];

export const setFaceLoop = (graph, face, loop) => {
  getFaceNode(graph, face).loop = loop;
};

export const spliceLoop = (graph, loop, targetEdge) => {
  const loopNode = getLoopNode(graph, loop);
  const targetEdgeNode = getEdgeNode(graph, targetEdge);

  let lastEdgeNode;
  eachLoopEdge(graph, loop, (edge, edgeNode) => {
    // Update face affinity.
    edgeNode.loop = targetEdgeNode.loop;
    // Remember the last node for when we splice it in.
    lastEdgeNode = edgeNode;
  });

  // Splice in the edges of the other face.
  lastEdgeNode.next = targetEdgeNode.next;
  targetEdgeNode.next = loopNode.edge;

  loopNode.edge = -1;
};
