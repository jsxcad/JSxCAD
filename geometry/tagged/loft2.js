import { loft2 as loftGraph2 } from '../graph/loft2.js';
import { toGraphList } from './toGraphList.js';

export const loft2 = (...geometries) => {
  const graphs = [];
  for (const geometry of geometries) {
    toGraphList(geometry, graphs);
  }
  return loftGraph2(...graphs);
};
