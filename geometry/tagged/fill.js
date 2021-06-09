import { fill as fillOutlineGraph } from '../graph/fill.js';
import { fromPaths as fromPathsToGraph } from '../graph/fromPaths.js';
import { getNonVoidGraphs } from './getNonVoidGraphs.js';
import { getNonVoidPaths } from './getNonVoidPaths.js';
import { taggedGroup } from './taggedGroup.js';
import { toKeptGeometry } from './toKeptGeometry.js';

export const fill = (geometry, includeFaces = true, includeHoles = true) => {
  const keptGeometry = toKeptGeometry(geometry);
  const fills = [];
  for (const geometry of getNonVoidGraphs(keptGeometry)) {
    const { tags } = geometry;
    if (tags && tags.includes('path/Wire')) {
      continue;
    }
    if (geometry.graph.isOutline) {
      fills.push(fillOutlineGraph(geometry));
    }
  }
  for (const { tags, paths } of getNonVoidPaths(keptGeometry)) {
    if (tags && tags.includes('path/Wire')) {
      continue;
    }
    fills.push(
      fillOutlineGraph(
        fromPathsToGraph(
          { tags },
          paths.map((path) => ({ points: path }))
        )
      )
    );
  }
  return taggedGroup({}, ...fills);
};
