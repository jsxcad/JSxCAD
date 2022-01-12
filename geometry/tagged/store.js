import { write, writeNonblocking } from '@jsxcad/sys';

import { hash } from './hash.js';
import { prepareForSerialization } from './prepareForSerialization.js';

export const is_stored = Symbol('is_stored');

export const store = async (geometry) => {
  if (geometry === undefined) {
    throw Error('Attempted to store undefined geometry');
  }
  const uuid = hash(geometry);
  if (geometry[is_stored]) {
    return { type: 'link', hash: uuid };
  }
  prepareForSerialization(geometry);
  const stored = { ...geometry };
  geometry[is_stored] = true;
  // Share graphs across geometries.
  const graph = geometry.graph;
  if (graph && !graph[is_stored]) {
    if (!graph.hash) {
      graph.hash = hash(graph);
    }
    await write(`graph/${graph.hash}`, graph);
    stored.graph = { hash: graph.hash };
  }
  if (geometry.content) {
    for (let nth = 0; nth < geometry.content.length; nth++) {
      stored.content[nth] = await store(geometry.content[nth]);
    }
  }
  await write(`hash/${uuid}`, stored);
  return { type: 'link', hash: uuid };
};

export const storeNonblocking = (geometry) => {
  if (geometry[is_stored]) {
    return { type: 'link', hash: geometry.hash };
  }
  prepareForSerialization(geometry);
  const uuid = hash(geometry);
  const stored = { ...geometry };
  geometry[is_stored] = true;
  // Share graphs across geometries.
  const graph = geometry.graph;
  if (graph && !graph[is_stored]) {
    if (!graph.hash) {
      graph.hash = hash(graph);
    }
    writeNonblocking(`graph/${graph.hash}`, graph);
    stored.graph = { hash: graph.hash };
  }
  if (geometry.content) {
    for (let nth = 0; nth < geometry.content.length; nth++) {
      stored.content[nth] = storeNonblocking(geometry.content[nth]);
    }
  }
  writeNonblocking(`hash/${uuid}`, stored);
  return { type: 'link', hash: uuid };
};
