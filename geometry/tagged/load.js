import { read, readNonblocking } from '@jsxcad/sys';

import { is_stored } from './store.js';

const is_loaded = Symbol('is_loaded');

export const load = async (geometry) => {
  if (geometry === undefined || geometry[is_loaded]) {
    return geometry;
  }
  if (!geometry.hash) {
    throw Error(`No hash`);
    return;
  }
  geometry = await read(`hash/${geometry.hash}`);
  if (!geometry) {
    return;
  }
  if (geometry[is_loaded]) {
    return geometry;
  }
  geometry[is_loaded] = true;
  geometry[is_stored] = true;
  // Link to any associated graph structure.
  if (geometry.graph && geometry.graph.hash) {
    geometry.graph = await read(`graph/${geometry.graph.hash}`);
  }
  if (geometry.content) {
    for (let nth = 0; nth < geometry.content.length; nth++) {
      geometry.content[nth] = await load(geometry.content[nth]);
    }
  }
  return geometry;
};

export const loadNonblocking = (geometry) => {
  if (geometry === undefined || geometry[is_loaded]) {
    return geometry;
  }
  if (!geometry.hash) {
    return;
  }
  geometry = readNonblocking(`hash/${geometry.hash}`);
  if (!geometry) {
    return;
  }
  if (geometry[is_loaded]) {
    return geometry;
  }
  geometry[is_loaded] = true;
  geometry[is_stored] = true;
  // Link to any associated graph structure.
  if (geometry.graph && geometry.graph.hash) {
    geometry.graph = readNonblocking(`graph/${geometry.graph.hash}`);
  }
  if (geometry.content) {
    for (let nth = 0; nth < geometry.content.length; nth++) {
      geometry.content[nth] = loadNonblocking(geometry.content[nth]);
    }
  }
  return geometry;
};
