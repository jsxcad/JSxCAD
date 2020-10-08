import { equals } from '@jsxcad/math-vec3';
import { getCgal } from './getCgal.js';

export const fromNefPolyhedronToGraph = (nefPolyhedron) => {
  const c = getCgal();
  const graph = { points: [], edges: [], loops: [], faces: [] };
  const vertexMap = [];
  const addPoint = (vertex, point) => {
    for (let index = 0; index < graph.points.length; index++) {
      if (equals(point, graph.points[index])) {
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
  // This top-down approach does not work for things like section, where we only
  // get vertices.
  c.Nef_polyhedron__explore(
    nefPolyhedron,
    () => {
      console.log(`volume`);
    },
    () => {
      console.log(`shell`);
    },
    (facet, x, y, z, w) => {
      console.log(``);
      console.log(`facet: ${facet}`);
      facetId = facet;
      facetPlane = [x, y, z, w];
    },
    (loop) => {
      console.log(`loop: ${loop}`);
      loopId = loop;
    },
    (halfedge, vertex, next, twin) => {
      console.log(`edge: ${halfedge} ${vertex} ${next} ${twin}`);
      const point = vertexMap[vertex];
      graph.edges[halfedge] = { point, next, twin, loop: facetId };
      if (graph.faces[facetId] === undefined) {
        graph.faces[facetId] = { plane: facetPlane };
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
    (vertex, x, y, z) => addPoint(vertex, [x, y, z])
  );
  return graph;
};
