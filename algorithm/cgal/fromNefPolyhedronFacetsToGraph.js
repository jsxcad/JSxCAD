import { dot, equals as equalsVec3 } from '@jsxcad/math-vec3';

import { getCgal } from './getCgal.js';

export const fromNefPolyhedronFacetsToGraph = (nefPolyhedron, plane) => {
  const console = { log: () => undefined };
  const c = getCgal();
  const graph = {
    points: [],
    edges: [],
    loops: [],
    faces: [],
    surfaces: [],
    isClosed: false,
    isOutline: true,
  };
  const vertexMap = [];
  const addPoint = (vertex, point) => {
    for (let index = 0; index < graph.points.length; index++) {
      if (equalsVec3(point, graph.points[index])) {
        vertexMap[vertex] = index;
        return index;
      }
    }
    const index = graph.points.length;
    graph.points.push(point);
    vertexMap[vertex] = index;
  };
  let facetId;
  let facetPlane;
  let loopId;
  c.Nef_polyhedron__explore_facets(
    nefPolyhedron,
    (facet, x, y, z, w) => {
      console.log(``);
      console.log(`facet: ${facet}`);
      facetId = facet;
      facetPlane = [x, y, z, w];
      if (dot(plane, facetPlane) < 0.99) {
        facetId = -1;
      }
    },
    (loop, sface) => {
      loopId = loop;
    },
    (halfedge, vertex, next, twin) => {
      if (facetId === -1) {
        return;
      }
      console.log(`edge: ${halfedge} ${vertex} ${next} ${twin}`);
      const point = vertexMap[vertex];
      graph.edges[halfedge] = { point, next, twin, loop: facetId };
      if (graph.faces[facetId] === undefined) {
        // The facetPlane seems to be incorrect.
        graph.faces[facetId] = { plane: facetPlane };
        if (graph.surfaces[0] === undefined) {
          graph.surfaces[0] = { faces: [] };
        }
        graph.surfaces[0].faces.push(facetId);
      }
      if (graph.loops[loopId] === undefined) {
        graph.loops[loopId] = { edge: halfedge, face: facetId };
        if (graph.faces[facetId].loop === undefined) {
          graph.faces[facetId].loop = loopId;
        } else if (graph.faces[facetId].holes) {
          graph.faces[facetId].holes.push(loopId);
        } else {
          graph.faces[facetId].holes = [loopId];
        }
      }
    },
    (vertex, x, y, z) => {
      addPoint(vertex, [x, y, z]);
    }
  );
  if (graph.faces.length === 0) {
    graph.isEmpty = true;
  }
  return graph;
};
