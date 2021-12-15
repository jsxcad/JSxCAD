/* global self */

import { deleteFile, generateUniqueId, getWorkspace } from '@jsxcad/sys';
import { rewrite, visit } from './visit.js';

import { difference } from './difference.js';
import { disjointVolumes } from '../graph/disjointVolumes.js';
import { read } from './read.js';
import { taggedGroup } from './taggedGroup.js';
import { toConcreteGeometry } from './toConcreteGeometry.js';
import { write } from './write.js';

export const disjoint = (geometries) => {
  geometries = [...geometries];
  for (let sup = geometries.length - 1; sup >= 0; sup--) {
    for (let sub = geometries.length - 1; sub > sup; sub--) {
      geometries[sup] = difference(geometries[sup], {}, geometries[sub]);
    }
  }
  return taggedGroup({}, ...geometries);
};

// An alternate disjunction that can be more efficient.
export const disjoint2 = (geometries) => {
  // We need to determine the linearization of geometry by type, then rewrite
  // with the corresponding disjunction.
  const concreteGeometries = [];
  for (const geometry of geometries) {
    concreteGeometries.push(toConcreteGeometry(geometry));
  }
  // For now we restrict ourselves to graph volumes.
  const originalVolumes = [];
  const collect = (geometry, descend) => {
    if (geometry.type === 'graph' && geometry.graph.isClosed) {
      originalVolumes.push(geometry);
    }
  };
  for (const geometry of concreteGeometries) {
    visit(geometry, collect);
  }
  const disjointedVolumes = disjointVolumes(originalVolumes);
  const map = new Map();
  for (let nth = 0; nth < disjointedVolumes.length; nth++) {
    map.set(originalVolumes[nth], disjointedVolumes[nth]);
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
    deleteFile({}, path);
  }
  for (const path of disjointPaths) {
    deleteFile({}, path);
  }
  return taggedGroup({}, ...disjointGeometries);
};
