import {
  eachFace,
  eachFaceEdge,
  eachFaceHole,
  eachLoopEdge,
  getPointNode,
} from './graph.js';

import { realizeGraph } from './realizeGraph.js';

export const toPaths = (graph) => {
  const paths = [];
  eachFace(realizeGraph(graph), (face) => {
    const path = [];
    eachFaceEdge(graph, face, (edge, { point }) => {
      path.push(getPointNode(graph, point));
    });
    paths.push(path);
    eachFaceHole(graph, face, (hole) => {
      const path = [];
      eachLoopEdge(graph, hole, (edge, { point }) => {
        path.push(getPointNode(graph, point));
      });
      paths.push(path);
    });
  });
  return paths;
};
