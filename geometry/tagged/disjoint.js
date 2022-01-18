import { rewrite, visit } from './visit.js';

import { cut } from './cut.js';
// import { disjoint as disjointGraphs } from '../graph/disjoint.js';
import { taggedGroup } from './taggedGroup.js';
import { toConcreteGeometry } from './toConcreteGeometry.js';

export const disjoint = (geometries) => {
  // We need to determine the linearization of geometry by type, then rewrite
  // with the corresponding disjunction.
  const concreteGeometries = [];
  for (const geometry of geometries) {
    concreteGeometries.push(toConcreteGeometry(geometry));
  }
  // For now we restrict ourselves to graphs.
  const originalGraphs = [];
  const collect = (geometry, descend) => {
    if (geometry.type === 'graph') {
      originalGraphs.push(geometry);
    }
    descend();
  };
  for (const geometry of concreteGeometries) {
    visit(geometry, collect);
  }
  const disjointGraphs = [];
  for (let start = 0; start < originalGraphs.length; start++) {
    let cutGraph = originalGraphs[start];
    for (let nth = start + 1; nth < originalGraphs.length; nth++) {
      cutGraph = cut(cutGraph, [originalGraphs[nth]]);
    }
    disjointGraphs[start] = cutGraph;
  }
  const map = new Map();
  for (let nth = 0; nth < disjointGraphs.length; nth++) {
    map.set(originalGraphs[nth], disjointGraphs[nth]);
  }
  const update = (geometry, descend) => {
    const disjointed = map.get(geometry);
    if (disjointed) {
      return disjointed;
    } else {
      return descend();
    }
  };
  const rewrittenGeometries = [];
  for (const geometry of concreteGeometries) {
    rewrittenGeometries.push(rewrite(geometry, update));
  }
  return taggedGroup({}, ...rewrittenGeometries);
};

/*
export const disjoint = (geometries) => {
  // We need to determine the linearization of geometry by type, then rewrite
  // with the corresponding disjunction.
  const concreteGeometries = [];
  for (const geometry of geometries) {
    concreteGeometries.push(toConcreteGeometry(geometry));
  }
  // For now we restrict ourselves to graphs.
  const originalGraphs = [];
  const collect = (geometry, descend) => {
    if (geometry.type === 'graph') {
      originalGraphs.push(geometry);
    }
    descend();
  };
  for (const geometry of concreteGeometries) {
    visit(geometry, collect);
  }
  const disjointedGraphs = disjointGraphs(originalGraphs);
  const map = new Map();
  for (let nth = 0; nth < disjointedGraphs.length; nth++) {
    map.set(originalGraphs[nth], disjointedGraphs[nth]);
  }
  const update = (geometry, descend) => {
    const disjointed = map.get(geometry);
    if (disjointed) {
      return disjointed;
    } else {
      return descend();
    }
  };
  const rewrittenGeometries = [];
  for (const geometry of concreteGeometries) {
    rewrittenGeometries.push(rewrite(geometry, update));
  }
  return taggedGroup({}, ...rewrittenGeometries);
};
*/
