import { graphSymbol, surfaceMeshSymbol } from './symbols.js';

import { deleteSurfaceMesh } from './deleteSurfaceMesh.js';
import { deserializeSurfaceMesh } from './deserializeSurfaceMesh.js';
import { fromGraphToSurfaceMesh } from './fromGraphToSurfaceMesh.js';
import { serializeSurfaceMesh } from './serializeSurfaceMesh.js';

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
    if (surfaceMesh.isScheduledForDeletion) {
      console.log(
        `QQ/trying to delete isScheduledForDeletion ${surfaceMesh} ${surfaceMesh.provenance}`
      );
    } else if (surfaceMesh.isDeleted()) {
      console.log(
        `QQ/trying to delete isDeleted() ${surfaceMesh} ${surfaceMesh.provenance}`
      );
    } else {
      console.log(`QQ/delete ${surfaceMesh} ${surfaceMesh.provenance}`);
      surfaceMesh.isScheduledForDeletion = true;
      // surfaceMesh.delete();
      try {
        // Make sure it's serialized and then unlink from the corresponding graph.
        const graph = surfaceMesh[graphSymbol];
        if (graph) {
          if (!graph.serializedSurfaceMesh) {
            graph.serializedSurfaceMesh = serializeSurfaceMesh(surfaceMesh);
          }
          if (graph[surfaceMeshSymbol] === surfaceMesh) {
            delete graph[surfaceMeshSymbol];
          }
        }
        delete surfaceMesh[graphSymbol];
        deleteSurfaceMesh(surfaceMesh);
      } catch (error) {
        console.log(JSON.stringify(surfaceMesh));
        throw error;
      }
    }
  }
  pending.clear();
};

export const toSurfaceMesh = (graph) => {
  let surfaceMesh = graph[surfaceMeshSymbol];
  if (surfaceMesh) {
    if (surfaceMesh.provenance === undefined) {
      throw Error('Unknown surface mesh provenance');
    }
    if (surfaceMesh.isScheduledForDeletion) {
      throw Error('Deleted surface mesh');
    }
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
