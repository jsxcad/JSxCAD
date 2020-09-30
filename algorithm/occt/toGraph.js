import { getOcct } from './occt.js';

export const toGraph = (shape) => {
  const outputJson = getOcct().toGraph(shape);
  const graph = JSON.parse(outputJson);
  return graph;
};
