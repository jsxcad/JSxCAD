export const eachPoint = (graph, op) => {
  for (const point of graph.points) {
    if (point !== undefined) {
      op(point);
    }
  }
};
