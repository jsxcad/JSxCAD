import { rewrite, visit } from './visit.js';

import { disjoint as disjointGraphs } from '../graph/disjoint.js';
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
