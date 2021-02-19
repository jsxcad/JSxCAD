import {
  rerealizeGraph,
  reverseFaceOrientations,
} from '@jsxcad/geometry-graph';

import { taggedGraph, taggedGroup } from '@jsxcad/geometry-tagged';

import ObjFile from 'obj-file-parser';

export const fromObjSync = (data, { invert = false } = {}) => {
  const { models } = new ObjFile(new TextDecoder('utf8').decode(data)).parse();

  const group = [];

  for (const model of models) {
    const { vertices, faces } = model;

    let graph = { points: [], exactPoints: [], edges: [], facets: [] };

    for (const { x, y, z } of vertices) {
      graph.points.push([x, y, z]);
    }

    for (const { vertices } of faces) {
      const facet = graph.facets.length;
      const firstEdgeId = graph.edges.length;
      let edge;
      for (const { vertexIndex } of vertices) {
        edge = { point: vertexIndex - 1, next: graph.edges.length + 1, facet };
        graph.edges.push(edge);
      }
      edge.next = firstEdgeId;
      graph.facets[facet] = { edge: firstEdgeId };
    }
    if (invert) {
      graph = reverseFaceOrientations(graph);
    }
    group.push(taggedGraph({}, rerealizeGraph(graph)));
  }

  return taggedGroup({}, ...group);
};

export const fromObj = async (data, options = {}) => fromObjSync(data, options);
