export const fill = (geometry) => ({
  ...geometry,
  graph: { ...geometry.graph, isOutline: false },
});
