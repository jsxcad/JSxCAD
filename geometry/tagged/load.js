import { read, readNonblocking } from '@jsxcad/sys';

import { isStored } from './store.js';

const isLoaded = Symbol('isLoaded');

export const load = async (geometry) => {
  if (geometry === undefined || geometry[isLoaded]) {
    return geometry;
  }
  if (!geometry.hash) {
    throw Error(`No hash`);
  }
  geometry = await read(`hash/${geometry.hash}`);
  if (!geometry) {
    return;
  }
  if (geometry[isLoaded]) {
    return geometry;
  }
  geometry[isLoaded] = true;
  geometry[isStored] = true;
  // Link to any associated graph structure.
  if (geometry.graph && geometry.graph.hash) {
    geometry.graph = await read(`graph/${geometry.graph.hash}`);
    if (!geometry.graph.serializedSurfaceMesh && !geometry.graph.serializedOcctShape) {
      throw Error('No serialized graph');
    }
  }
  if (geometry.content) {
    for (let nth = 0; nth < geometry.content.length; nth++) {
      if (!geometry.content[nth]) {
        throw Error('Load has empty content/1');
      }
      geometry.content[nth] = await load(geometry.content[nth]);
      if (!geometry.content[nth]) {
        throw Error('Load has empty content/2');
      }
    }
  }
  return geometry;
};

export const loadNonblocking = (geometry) => {
  if (geometry === undefined || geometry[isLoaded]) {
    return geometry;
  }
  if (!geometry.hash) {
    return;
  }
  geometry = readNonblocking(`hash/${geometry.hash}`);
  if (!geometry) {
    return;
  }
  if (geometry[isLoaded]) {
    return geometry;
  }
  geometry[isStored] = true;
  // Link to any associated graph structure.
  if (geometry.graph && geometry.graph.hash) {
    geometry.graph = readNonblocking(`graph/${geometry.graph.hash}`);
    if (!geometry.graph.serializedSurfaceMesh && !geometry.graph.serializedOcctShape) {
      throw Error('No serialized graph');
    }
  }
  if (geometry.content) {
    for (let nth = 0; nth < geometry.content.length; nth++) {
      if (!geometry.content[nth]) {
        throw Error('Load has empty content/3');
      }
      geometry.content[nth] = loadNonblocking(geometry.content[nth]);
      if (!geometry.content[nth]) {
        throw Error('Load has empty content/4');
      }
    }
  }
  geometry[isLoaded] = true;
  return geometry;
};
