export const taggedGraph = ({ tags }, graph) => ({
  type: 'graph',
  tags,
  graph,
});
