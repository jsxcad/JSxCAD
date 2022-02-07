import { fromPaths as fromPathsToGraph } from '../graph/fromPaths.js';
import { fromPolygonsWithHoles as fromPolygonsWithHolesToGraph } from '../graph/fromPolygonsWithHoles.js';
import { offset as offsetGraph } from '../graph/offset.js';
import { op } from './op.js';
import { taggedGroup } from './taggedGroup.js';

const graph = (geometry, initial = 1, options) =>
  taggedGroup(
    { tags: geometry.tags },
    ...offsetGraph(geometry, initial, options)
  );

const polygonsWithHoles = (geometry, initial = 1, options) =>
  graph(fromPolygonsWithHolesToGraph(geometry), initial, options);

const paths = (geometry, initial = 1, options) =>
  graph(
    fromPathsToGraph({ tags: geometry.tags }, geometry.paths),
    initial,
    options
  );

export const offset = op({ graph, polygonsWithHoles, paths });
