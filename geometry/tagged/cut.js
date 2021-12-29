import { rewrite, visit } from './visit.js';

import { cut as cutGraphs } from '../graph/cut.js';
import { isNotTypeMasked } from './type.js';
import { toConcreteGeometry } from './toConcreteGeometry.js';

// Masked geometry is cut.
const collectTargets = (out) => (geometry, descend) => {
  if (geometry.type === 'graph' && !geometry.graph.isEmpty) {
    out.push(geometry);
  }
  descend();
};

// Masked geometry doesn't cut.
const collectRemoves = (out) => (geometry, descend) => {
  if (
    geometry.type === 'graph' &&
    isNotTypeMasked(geometry) &&
    !geometry.graph.isEmpty
  ) {
    out.push(geometry);
  }
  descend();
};

// An alternate disjunction that can be more efficient.
export const cut = (geometry, geometries) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const targetGraphs = [];
  visit(concreteGeometry, collectTargets(targetGraphs));
  if (targetGraphs.length === 0) {
    return geometry;
  }
  const removeGraphs = [];
  for (const geometry of geometries) {
    visit(toConcreteGeometry(geometry), collectRemoves(removeGraphs));
  }
  const resultingGraphs = cutGraphs(targetGraphs, removeGraphs);
  const map = new Map();
  for (let nth = 0; nth < resultingGraphs.length; nth++) {
    map.set(targetGraphs[nth], resultingGraphs[nth]);
  }
  const update = (geometry, descend) => {
    const cut = map.get(geometry);
    if (cut) {
      return cut;
    } else {
      return descend();
    }
  };
  return rewrite(concreteGeometry, update);
};
