import { stitch } from '@jsxcad/geometry-graph';
import { taggedGraph } from '@jsxcad/geometry-tagged';

// First line (optional): the letters OFF to mark the file type.
// Second line: the number of vertices, number of faces, and number of edges, in order (the latter can be ignored by writing 0 instead).
// List of vertices: X, Y and Z coordinates.
// List of faces: number of vertices, followed by the indexes of the composing vertices, in order (indexed from zero).
// Optionally, the RGB values for the face color can follow the elements of the faces.

export const fromOffSync = (data, options = {}) => {
  const text = new TextDecoder('utf8').decode(data);
  let line = 0;
  const lines = text.split('\n');
  if (lines[line++] !== 'OFF') {
    throw Error('Not OFF');
  }
  const [vertexCount = 0, faceCount = 0] = lines[line++]
    .split(' ')
    .map((span) => parseInt(span, 10));
  const graph = { exactPoints: [], edges: [], facets: [] };
  for (let nth = 0; nth < vertexCount; nth++) {
    const [x, y, z] = lines[line++].split(' ');
    graph.exactPoints[nth] = [x, y, z];
  }
  for (let nthFacet = 0; nthFacet < faceCount; nthFacet++) {
    const [vertexCount, ...vertices] = lines[line++]
      .split(' ')
      .map((span) => parseInt(span, 10));
    const firstEdge = graph.edges.length;
    let lastEdgeNode;
    for (let nthVertex = 0; nthVertex < vertexCount; nthVertex++) {
      lastEdgeNode = {
        point: vertices[nthVertex],
        next: graph.edges.length + 1,
        facet: nthFacet,
      };
      graph.edges.push(lastEdgeNode);
    }
    lastEdgeNode.next = firstEdge;
    graph.facets[nthFacet] = { edge: firstEdge };
  }
  return taggedGraph({}, stitch(graph));
};

export const fromOff = async (data, options = {}) => fromOffSync(data, options);
