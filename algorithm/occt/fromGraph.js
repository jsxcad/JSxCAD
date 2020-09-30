import { getOcct } from './occt.js';

export const fromGraph = (graph) => {
  const inputJson = JSON.stringify(graph);
  const shape = getOcct().fromGraph(inputJson);
  return shape;
};
