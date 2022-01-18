import { ErrorWouldBlock, write, writeNonblocking } from '@jsxcad/sys';

import { hash } from './hash.js';

export const isStored = Symbol('isStored');

export const store = async (geometry) => {
  if (geometry === undefined) {
    throw Error('Attempted to store undefined geometry');
  }
  const uuid = hash(geometry);
  if (geometry[isStored]) {
    return { type: 'link', hash: uuid };
  }
  const stored = { ...geometry };
  geometry[isStored] = true;
  // Share graphs across geometries.
  const graph = geometry.graph;
  if (graph && !graph[isStored]) {
    await write(`graph/${graph.hash}`, graph);
    stored.graph = { hash: graph.hash, isClosed: graph.isClosed, isEmpty: graph.isEmpty, provenance: graph.provenance };
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

export const storeNonblocking = (geometry) => {
  if (geometry[isStored]) {
    return { stored: { type: 'link', hash: geometry.hash }, wouldBlock: false };
  }
  const uuid = hash(geometry);
  const stored = { ...geometry };
  // Share graphs across geometries.
  const graph = geometry.graph;
  let wouldBlock;
  if (graph && !graph[isStored]) {
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
      if (!geometry.content[nth]) {
        throw Error('Store has empty content/3');
      }
      const { stored: contentStored, wouldBlock: contentWouldBlock } =
        storeNonblocking(geometry.content[nth]);
      if (contentWouldBlock) {
        wouldBlock = contentWouldBlock;
      }
      stored.content[nth] = contentStored;
      if (!stored.content[nth]) {
        throw Error(
          `Store has empty content/4: contentWouldBlock ${contentWouldBlock} from ${JSON.stringify(
            geometry
          )}`
        );
      }
    }
  }
  try {
    writeNonblocking(`hash/${uuid}`, stored);
  } catch (error) {
    if (error instanceof ErrorWouldBlock) {
      wouldBlock = error;
    }
  }
  geometry[isStored] = true;
  return { stored: { type: 'link', hash: uuid }, wouldBlock };
};
