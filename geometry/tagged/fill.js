import { close } from '../paths/close.js';
import { fromPaths as fromPathsToGraph } from '../graph/fromPaths.js';
import { fill as graph } from '../graph/fill.js';
import { op } from './op.js';

const paths = (geometry) =>
  graph(
    fromPathsToGraph(
      { tags: geometry.tags, matrix: geometry.matrix },
      close(geometry.paths)
    )
  );

export const fill = op({ graph, paths });
