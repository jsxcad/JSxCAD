import { hash } from './hash.js';
import { write } from '@jsxcad/sys';

export const isStored = Symbol('isStored');

export const store = async (geometry) => {
  if (geometry === undefined) {
    throw Error('Attempted to store undefined geometry');
  }
  const uuid = hash(geometry);
  if (geometry[isStored]) {
    return { type: 'link', hash: uuid };
  }
  const stored = { ...geometry, content: geometry.content?.slice() };
  geometry[isStored] = true;
  // Share graphs across geometries.
  const graph = geometry.graph;
  if (graph && !graph[isStored]) {
    if (graph.hash === undefined) {
      throw Error(`Graph has no hash`);
    }
    if (!graph.serializedSurfaceMesh) {
      throw Error('Attempted to store graph without serialization');
    }
    await write(`graph/${graph.hash}`, graph);
    stored.graph = {
      hash: graph.hash,
      isClosed: graph.isClosed,
      isEmpty: graph.isEmpty,
      provenance: graph.provenance,
    };
  }
  if (geometry.content) {
    for (let nth = 0; nth < geometry.content.length; nth++) {
      if (!geometry.content[nth]) {
        throw Error('Store has empty content/1');
      }
      stored.content[nth] = await store(geometry.content[nth]);
      if (!stored.content[nth]) {
        throw Error('Store has empty content/2');
      }
    }
  }
  await write(`hash/${uuid}`, stored);
  return { type: 'link', hash: uuid };
};
