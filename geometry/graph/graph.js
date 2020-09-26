import './types.js';

export const create = () => ({ point: [], edge: [], face: [] });

export const addPoint = (graph, point) => {
  const found = graph.point.indexOf(point);
  if (found !== -1) {
    return found;
  }
  const id = graph.point.length;
  graph.point.push(point);
  return id;
};

export const addEdge = (graph, { start, next = -1, face = -1, twin = -1 }) => {
  const id = graph.edge.length;
  graph.edge.push({ start, face, twin, next });
  return id;
};

export const addFaceEdge = (graph, face, { start, twin = -1 }) => {
  const faceNode = graph.face[face];
  const edge = addEdge(graph, { start, face, twin });
  const edgeNode = graph.edge[edge];
  if (faceNode.edge === -1) {
    edgeNode.next = edge;
  } else {
    const faceEdgeNode = graph.edge[faceNode.edge];
    edgeNode.next = faceEdgeNode.next;
    faceEdgeNode.next = edge;
  }
  faceNode.edge = edge;
  return edge;
};

export const deleteLoop = (graph, loop) =>
  eachLoopEdge(graph, loop, (edge, edgeNode) => {
    edgeNode.face = -1;
  });

export const eachLoopEdge = (graph, loop, op) => {
  if (loop === -1) {
    return;
  }
  const start = loop;
  let edge = start;
  do {
    const edgeNode = graph.edge[edge];
    op(edge, edgeNode);
    edge = edgeNode.next;
  } while (edge !== start);
};

export const eachFaceEdge = (graph, face, op) => {
  const faceNode = graph.face[face];
  const loop = faceNode.edge;
  eachLoopEdge(graph, loop, op);
  /*
  if (start === -1) {
    return;
  }
  let edge = start;
  do {
    const edgeNode = graph.edge[edge];
    op(edge, edgeNode);
    edge = edgeNode.next;
  } while (edge !== start);
*/
};

export const addFace = (graph, { plane, edge = -1, holes = [] } = {}) => {
  const id = graph.face.length;
  graph.face.push({ plane, edge, holes });
  return id;
};

export const eachFace = (graph, op) => {
  for (let face = 0; face < graph.face.length; face++) {
    op(face, graph.face[face]);
  }
};
