import { rewrite } from './visit.js';

// This gets each layer independently.

export const getLayers = (geometry) => {
  const layers = [];
  const op = (geometry, descend, walk) => {
    switch (geometry.type) {
      case 'layers':
        geometry.content.forEach((layer) => layers.unshift(walk(layer)));
        return { type: 'disjointAssembly', content: [] };
      default:
        return descend();
    }
  };
  rewrite(geometry, op);
  return layers;
};
