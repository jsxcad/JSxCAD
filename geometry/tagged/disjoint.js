/* global self */

import { deleteFile, generateUniqueId, getWorkspace } from '@jsxcad/sys';

import { difference } from './difference.js';
import { read } from './read.js';
import { taggedGroup } from './taggedGroup.js';
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
