import { rewrite, visit } from './visit.js';

import { isNotTypeVoid } from './type.js';
import { join as joinGraphs } from '../graph/join.js';
import { toConcreteGeometry } from './toConcreteGeometry.js';

const collect = (geometry, out) => {
  const op = (geometry, descend) => {
    if (geometry.type === 'graph' && isNotTypeVoid(geometry)) {
      out.push(geometry);
    }
    descend();
  };
  visit(geometry, op);
};

export const join = (geometry, geometries) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  // Collect graphs for rewriting.
  const rewriteGraphs = [];
  collect(concreteGeometry, rewriteGraphs);
  // The other graphs are just read from.
  const readGraphs = [];
  for (const geometry of geometries) {
    collect(toConcreteGeometry(geometry), readGraphs);
  }
  const joinedGraphs = joinGraphs(rewriteGraphs, readGraphs);
  const map = new Map();
  for (let nth = 0; nth < joinedGraphs.length; nth++) {
    map.set(rewriteGraphs[nth], joinedGraphs[nth]);
  }
  const update = (geometry, descend) => {
    const joined = map.get(geometry);
    if (joined) {
      return joined;
    } else {
      return descend();
    }
  };
  return rewrite(concreteGeometry, update);
};
