import { fromPolygonsWithHoles } from './fromPolygonsWithHoles.js';
import { sectionOfSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const section = (graph, plane) => {
  for (const polygons of sectionOfSurfaceMesh(toSurfaceMesh(graph), [plane])) {
    return fromPolygonsWithHoles(polygons);
  }
};

export const sections = (graph, planes) => {
  const graphs = [];
  for (const polygons of sectionOfSurfaceMesh(toSurfaceMesh(graph), planes)) {
    graphs.push(fromPolygonsWithHoles(polygons));
  }
  return graphs;
};
