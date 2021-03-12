import {
  fill as fillOutlineGraph,
  fromPaths as fromPathsToGraph,
} from '@jsxcad/geometry-graph';

import { getNonVoidGraphs } from './getNonVoidGraphs.js';
import { getNonVoidPaths } from './getNonVoidPaths.js';
import { taggedGraph } from './taggedGraph.js';
import { taggedGroup } from './taggedGroup.js';
import { toKeptGeometry } from './toKeptGeometry.js';

export const fill = (geometry, includeFaces = true, includeHoles = true) => {
  const keptGeometry = toKeptGeometry(geometry);
  const fills = [];
  for (const { tags, graph } of getNonVoidGraphs(keptGeometry)) {
    if (tags && tags.includes('path/Wire')) {
      continue;
    }
    if (graph.isOutline) {
      fills.push(taggedGraph({ tags }, fillOutlineGraph(graph)));
    }
  }
  for (const { tags, paths } of getNonVoidPaths(keptGeometry)) {
    if (tags && tags.includes('path/Wire')) {
      continue;
    }
    fills.push(
      taggedGraph(
        { tags },
        fillOutlineGraph(
          fromPathsToGraph(paths.map((path) => ({ points: path })))
        )
      )
    );
  }
  return taggedGroup({}, ...fills);
};
