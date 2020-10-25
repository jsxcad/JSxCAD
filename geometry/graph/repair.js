import { eachEdge, getEdgeNode, getLoopNode } from './graph.js';

export const removeZeroLengthEdges = (graph) => {
  let removed = false;
  eachEdge(graph, (edge, edgeNode) => {
    const nextEdgeNode = getEdgeNode(graph, edgeNode.next);
    if (edgeNode.point === nextEdgeNode.point) {
      // Cut the edge out of the loop.
      edgeNode.next = nextEdgeNode.next;
      // Ensure that the loop doesn't enter on the removed edge.
      getLoopNode(graph, edgeNode.loop).edge = edge;
      // Mark as removed for debugging purposes.
      nextEdgeNode.isRemoved = true;
      nextEdgeNode.next = -1;
      // Any twin should be in the same situation and remove itself.
      removed = true;
    }
  });
  return removed;
};

export const repair = (graph) => {
  if (removeZeroLengthEdges(graph)) {
    if (!checkGraph(graph)) {
      throw Error('graph invalid');
    }
    return true;
  }
  return false;
};

export const checkTwins = (graph) => {
  eachEdge(graph, (edge, edgeNode) => {
    if (edgeNode.twin === -1) {
      return;
    }
    const twinNode = getEdgeNode(graph, edge.twin);
    if (!twinNode) {
      return;
    }
    if (twinNode.isRemoved) {
      throw Error('removed twin');
    }
  });
  return true;
};

export const checkGraph = (graph) => {
  return checkTwins(graph);
};
