import {
  fill as fillOutlineGraph,
  fromPaths as fromPathsToGraph,
} from '@jsxcad/geometry-graph';

import { close as closePaths } from '@jsxcad/geometry-paths';
import { getNonVoidGraphs } from './getNonVoidGraphs.js';
import { getNonVoidPaths } from './getNonVoidPaths.js';
import { taggedGraph } from './taggedGraph.js';
import { taggedGroup } from './taggedGroup.js';
import { toKeptGeometry } from './toKeptGeometry.js';

export const fill = (geometry, includeFaces = true, includeHoles = true) => {
  const keptGeometry = toKeptGeometry(geometry);
  const fills = [];
  for (const { tags, graph } of getNonVoidGraphs(keptGeometry)) {
    if (graph.isOutline) {
      fills.push(taggedGraph({ tags }, fillOutlineGraph(graph)));
    }
  }
  for (const { tags, paths } of getNonVoidPaths(keptGeometry)) {
    fills.push(
      taggedGraph(
        { tags },
        fillOutlineGraph(fromPathsToGraph(closePaths(paths)))
      )
    );
  }
  return taggedGroup({}, ...fills);
};
