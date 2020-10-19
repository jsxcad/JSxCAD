import { eachFace, eachFaceEdge, getPointNode } from './graph.js';

export const toPaths = (graph) => {
  const paths = [];
  eachFace(graph, (face) => {
    const path = [];
    eachFaceEdge(graph, face, (edge, { point }) => {
      path.push(getPointNode(graph, point));
    });
    paths.push(path);
  });
  return paths;
};
