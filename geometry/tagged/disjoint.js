import { rewrite, visit } from './visit.js';

import { cut } from './cut.js';
import { disjoint as disjoinGraphs } from '../graph/disjoint.js';
import { taggedGroup } from './taggedGroup.js';
import { toConcreteGeometry } from './toConcreteGeometry.js';

export const disjoint = (geometries, strategy = 'incremental') => {
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
  let disjointGraphs;
  switch (strategy) {
    case 'cacheCuts': {
      disjointGraphs = [];
      for (let start = 0; start < originalGraphs.length; start++) {
        let cutGraph = originalGraphs[start];
        for (let nth = start + 1; nth < originalGraphs.length; nth++) {
          cutGraph = cut(cutGraph, [originalGraphs[nth]]);
        }
        disjointGraphs[start] = cutGraph;
        console.log(start);
      }
      break;
    }
    case 'fullSubtraction': {
      disjointGraphs = [];
      for (let start = 0; start < originalGraphs.length; start++) {
        const cutGraph = cut(
          originalGraphs[start],
          originalGraphs.slice(start + 1)
        );
        disjointGraphs[start] = cutGraph;
        console.log(start);
      }
      break;
    }
    case 'disjointSubtraction': {
      disjointGraphs = [];
      let start = originalGraphs.length;
      while (--start >= 0) {
        const cutGraph = cut(
          originalGraphs[start],
          disjointGraphs.slice(start + 1)
        );
        disjointGraphs[start] = cutGraph;
        console.log(start);
      }
      break;
    }
    case 'incremental': {
      disjointGraphs = disjoinGraphs(originalGraphs);
      break;
    }
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
