import { ErrorWouldBlock, write, writeNonblocking } from '@jsxcad/sys';

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
  // Share graphs across geometries.
  const graph = geometry.graph;
  let wouldBlock;
  if (graph && !graph[is_stored]) {
    if (!graph.hash) {
      graph.hash = hash(graph);
    }
    try {
      writeNonblocking(`graph/${graph.hash}`, graph);
    } catch (error) {
      if (error instanceof ErrorWouldBlock) {
        wouldBlock = error;
      }
    }
    stored.graph = { hash: graph.hash };
  }
  if (geometry.content) {
    for (let nth = 0; nth < geometry.content.length; nth++) {
      const { stored: contentStored, wouldBlock: contentWouldBlock } =
        storeNonblocking(geometry.content[nth]);
      if (contentWouldBlock) {
        wouldBlock = contentWouldBlock;
      }
      stored.content[nth] = contentStored;
    }
  }
  try {
    writeNonblocking(`hash/${uuid}`, stored);
  } catch (error) {
    if (error instanceof ErrorWouldBlock) {
      wouldBlock = error;
    }
  }
  geometry[is_stored] = true;
  return { stored: { type: 'link', hash: uuid }, wouldBlock };
};
