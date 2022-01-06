import { fromPaths as fromPathsToGraph } from '../graph/fromPaths.js';
import { fromPolygonsWithHoles as fromPolygonsWithHolesToGraph } from '../graph/fromPolygonsWithHoles.js';
import { offset as offsetGraph } from '../graph/offset.js';
import { op } from './op.js';
import { taggedGroup } from './taggedGroup.js';

const graph = (geometry, initial = 1, step, limit) =>
  taggedGroup(
    { tags: geometry.tags },
    ...offsetGraph(geometry, initial, step, limit)
  );
const polygonsWithHoles = (geometry, initial = 1, step, limit) =>
  offset(fromPolygonsWithHolesToGraph(geometry), initial, step, limit);

const paths = (geometry, initial = 1, step, limit) =>
  offset(
    fromPathsToGraph({ tags: geometry.tags }, geometry.paths),
    initial,
    step,
    limit
  );

export const offset = op({ graph, polygonsWithHoles, paths });
