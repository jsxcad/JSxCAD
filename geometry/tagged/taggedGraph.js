export const taggedGraph = ({ tags }, graph) => {
  if (graph.length > 0) {
    throw Error('Graph should not be an array');
  }
  return {
    type: 'graph',
    tags,
    graph,
  };
};
