import { outline } from './outline.js';

export const toPaths = (graph) => {
  const paths = [];
  for (const { boundary, holes } of outline(graph)) {
    paths.push(boundary, ...holes);
  }
  return paths;
};
