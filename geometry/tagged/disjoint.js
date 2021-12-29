/* global self */

import { generateUniqueId, getWorkspace, remove } from '@jsxcad/sys';
import { rewrite, visit } from './visit.js';

import { difference } from './difference.js';
import { disjoint as disjointGraphs } from '../graph/disjoint.js';
import { read } from './read.js';
import { taggedGroup } from './taggedGroup.js';
import { toConcreteGeometry } from './toConcreteGeometry.js';
import { write } from './write.js';

export const disjoint2 = (geometries) => {
  geometries = [...geometries];
  for (let sup = geometries.length - 1; sup >= 0; sup--) {
    for (let sub = geometries.length - 1; sub > sup; sub--) {
      geometries[sup] = difference(geometries[sup], {}, geometries[sub]);
    }
  }
  return taggedGroup({}, ...geometries);
};

// An alternate disjunction that can be more efficient.
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

export const distributedDisjoint = async (geometries) => {
  if (geometries.length <= 2) {
    // No point in parallelizing this.
    return disjoint(geometries);
  }
  const paths = [];
  const promises = [];
  for (const geometry of geometries) {
    const path = `geometry/${generateUniqueId()}`;
    promises.push(write(geometry, path));
    paths.push(path);
  }
  Promise.all(promises);
  const disjointPaths = await self.ask({
    op: 'geometry/disjoint',
    paths,
    workspace: getWorkspace(),
    id: self.id,
  });
  const disjointGeometries = [];
  for (const disjointPath of disjointPaths) {
    disjointGeometries.push(await read(disjointPath));
  }
  // Schedule cleanup for the temporary paths.
  for (const path of paths) {
    remove(path, {});
  }
  for (const path of disjointPaths) {
    remove(path, {});
  }
  return taggedGroup({}, ...disjointGeometries);
};
