export const create = () => ({ points: [], edges: [], loops: [], faces: [] });

export const addEdge = (graph, { point, next = -1, loop = -1, twin = -1 }) => {
  const edge = graph.edges.length;
  graph.edges.push({ point, loop, twin, next });
  return edge;
};

export const addFace = (graph, { plane, loops = [] } = {}) => {
  const face = graph.faces.length;
  graph.faces.push({ plane, loops });
  return face;
};

export const addFaceLoop = (graph, face, loop) =>
  getFaceNode(graph, face).loops.push(loop);

export const addLoop = (graph, { edge = -1, face = -1 } = {}) => {
  const loop = graph.loops.length;
  graph.loops.push({ edge, face });
  if (face !== -1) {
    getFaceNode(graph, face).loops.push(loop);
  }
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
  const found = graph.points.indexOf(point);
  if (found !== -1) {
    return found;
  }
  const id = graph.points.length;
  graph.points.push(point);
  return id;
};

export const deleteLoop = (graph, loop) =>
  eachLoopEdge(graph, loop, (edge, edgeNode) => {
    edgeNode.loop = -1;
  });

export const eachEdge = (graph, start, op) => {
  if (start === -1) {
    return;
  }
  let edge = start;
  do {
    const edgeNode = graph.edges[edge];
    op(edge, edgeNode);
    edge = edgeNode.next;
  } while (edge !== start);
};

export const eachFace = (graph, op) =>
  graph.faces.forEach((faceNode, face) => op(face, faceNode));

export const eachFaceEdge = (graph, face, op) =>
  eachFaceLoop(graph, face, (loop) => eachLoopEdge(graph, loop, op));

export const eachFaceLoop = (graph, face, op) => {
  const loop = getFaceNode(graph, face).loop;
  op(loop, getLoopNode(graph, loop));
};

export const eachLoopEdge = (graph, loop, op) =>
  eachEdge(graph, getLoopNode(graph, loop).edge, op);

export const getEdgeNode = (graph, edge) => graph.edges[edge];
export const getFaceNode = (graph, face) => graph.faces[face];
export const getFacePlane = (graph, face) => graph.faces[face].plane;
export const getLoopNode = (graph, loop) => graph.loops[loop];
export const getPointNode = (graph, point) => graph.points[point];

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
