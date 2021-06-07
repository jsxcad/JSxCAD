import {
  deserializeSurfaceMesh,
  fromGraphToSurfaceMesh,
} from '@jsxcad/algorithm-cgal';
import { graphSymbol, surfaceMeshSymbol } from './symbols.js';

export const toSurfaceMesh = (graph) => {
  let surfaceMesh = graph[surfaceMeshSymbol];
  if (surfaceMesh !== undefined) {
    return surfaceMesh;
  }
  if (graph.serializedSurfaceMesh) {
    surfaceMesh = deserializeSurfaceMesh(graph.serializedSurfaceMesh);
  } else {
    surfaceMesh = fromGraphToSurfaceMesh(graph);
  }
  graph[surfaceMeshSymbol] = surfaceMesh;
  surfaceMesh[graphSymbol] = graph;
  return surfaceMesh;
};
