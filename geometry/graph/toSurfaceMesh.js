import {
  deserializeSurfaceMesh,
  fromGraphToSurfaceMesh,
} from '@jsxcad/algorithm-cgal';
import { graphSymbol, surfaceMeshSymbol } from './symbols.js';

const cacheSize = 100;
const clock = [];
let pointer = 0;
const pending = new Set();

for (let nth = 0; nth < cacheSize; nth++) {
  clock.push({ live: false, surfaceMesh: null });
}

const evict = () => {
  for (;;) {
    pointer = (pointer + 1) % cacheSize;
    if (clock[pointer].live) {
      clock[pointer].live = false;
    } else {
      const surfaceMesh = clock[pointer].surfaceMesh;
      if (surfaceMesh) {
        surfaceMesh.cacheIndex = undefined;
        pending.add(surfaceMesh);
      }
      return pointer;
    }
  }
};

const remember = (surfaceMesh) => {
  if (surfaceMesh.cacheIndex !== undefined) {
    clock[surfaceMesh.cacheIndex].live = true;
    return;
  }
  const evictedIndex = evict();
  const entry = clock[evictedIndex];
  entry.live = true;
  // If this was scheduled for deletion, rescue it -- it's back in the cache.
  pending.delete(surfaceMesh);
  entry.surfaceMesh = surfaceMesh;
  surfaceMesh.cacheIndex = evictedIndex;
};

export const deletePendingSurfaceMeshes = () => {
  console.log(`QQ/deleting ${pending.size} surface meshes`);
  for (const surfaceMesh of pending) {
    surfaceMesh.delete();
  }
  pending.clear();
};

export const toSurfaceMesh = (graph) => {
  let surfaceMesh = graph[surfaceMeshSymbol];
  if (surfaceMesh !== undefined && !surfaceMesh.isDeleted()) {
    remember(surfaceMesh);
    return surfaceMesh;
  }
  if (graph.serializedSurfaceMesh) {
    try {
      surfaceMesh = deserializeSurfaceMesh(graph.serializedSurfaceMesh);
    } catch (error) {
      console.log('Mesh deserialization failure');
      throw error;
    }
  } else {
    surfaceMesh = fromGraphToSurfaceMesh(graph);
  }
  remember(surfaceMesh);
  graph[surfaceMeshSymbol] = surfaceMesh;
  surfaceMesh[graphSymbol] = graph;
  return surfaceMesh;
};
