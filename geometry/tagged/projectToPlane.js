import { fromPaths as fromPathsToGraph } from '../graph/fromPaths.js';
import { projectToPlane as graph } from '../graph/projectToPlane.js';
import { op } from './op.js';

const paths = (geometry, plane, direction) => {
  return graph(
    fromPathsToGraph(geometry.paths),
    plane,
    direction
  );
};

export const projectToPlane = op({ graph, paths });
