import { rewrite } from "./visit";

// This gets each layer independently.

export const getLayers = (geometry) => {
  const layers = [];
  const op = (geometry, descend, walk) => {
    if (geometry.layers) {
      geometry.layers.forEach((layer) => layers.unshift(walk(layer)));
      return { assembly: [] };
    } else {
      return descend();
    }
  };
  rewrite(geometry, op);
  return layers;
};
