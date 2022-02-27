import { loft as loftGraph } from '../graph/loft.js';
import { toGraphList } from './toGraphList.js';

export const loft = (closed, ...geometries) => {
  const graphs = [];
  for (const geometry of geometries) {
    toGraphList(geometry, graphs);
  }
  return loftGraph(closed, ...graphs);
};
