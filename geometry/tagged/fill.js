import { close } from '../paths/close.js';
import { fromPaths as fromPathsToGraph } from '../graph/fromPaths.js';
import { fromSegments as fromSegmentsToGraph } from '../graph/fromSegments.js';
import { fill as graph } from '../graph/fill.js';
import { op } from './op.js';

const paths = (geometry) =>
  graph(
    fromPathsToGraph(
      { tags: geometry.tags, matrix: geometry.matrix },
      close(geometry.paths)
    )
  );

const segments = (geometry) =>
  graph(
    fromSegmentsToGraph(
      { tags: geometry.tags, matrix: geometry.matrix },
      geometry.segments
    )
  );

export const fill = op({ graph, paths, segments });
