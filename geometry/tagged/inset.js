import { fromPaths as fromPathsToGraph } from '../graph/fromPaths.js';
import { fromPolygonsWithHoles as fromPolygonsWithHolesToGraph } from '../graph/fromPolygonsWithHoles.js';
import { inset as insetGraph } from '../graph/inset.js';
import { op } from './op.js';
import { taggedGroup } from './taggedGroup.js';

const graph = (geometry, initial, options) =>
  taggedGroup(
    { tags: geometry.tags },
    ...insetGraph(geometry, initial, options)
  );

const polygonsWithHoles = (geometry, initial, options) =>
  graph(fromPolygonsWithHolesToGraph(geometry), initial, options);

const paths = (geometry, initial, options) =>
  graph(
    fromPathsToGraph(
      { tags: geometry.tags },
      geometry.paths.map((path) => ({ points: path }))
    ),
    initial,
    options
  );

export const inset = op({ graph, polygonsWithHoles, paths });
