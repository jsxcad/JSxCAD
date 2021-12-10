import { eachItem } from './eachItem.js';

export const getClosedGraphs = (geometry) => {
  const graphs = [];
  eachItem(geometry, (item) => {
    if (item.type === 'graph' && item.graph.isClosed) {
      graphs.push(item);
    }
  });
  return graphs;
};

export const getGraphs = (geometry) => {
  const graphs = [];
  eachItem(geometry, (item) => {
    if (item.type === 'graph') {
      graphs.push(item);
    }
  });
  return graphs;
};
