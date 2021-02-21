import { outline } from './outline.js';

export const toPaths = (graph) => {
  const paths = [];
  for (const { points, holes } of outline(graph)) {
    paths.push(points);
    for (const { points } of holes) {
      paths.push(points);
    }
  }
  return paths;
};
