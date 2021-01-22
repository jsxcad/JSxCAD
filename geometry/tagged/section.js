import { cacheSection } from '@jsxcad/cache';
import { getNonVoidGraphs } from './getNonVoidGraphs.js';
import { reify } from './reify.js';
import { section as sectionGraph } from '@jsxcad/geometry-graph';
import { taggedGroup } from './taggedGroup.js';
import { taggedPaths } from './taggedPaths.js';
import { toTransformedGeometry } from './toTransformedGeometry.js';

const sectionImpl = (geometry, planes) => {
  const transformedGeometry = toTransformedGeometry(reify(geometry));
  const sections = [];
  for (const { tags, graph } of getNonVoidGraphs(transformedGeometry)) {
    for (const paths of sectionGraph(graph, planes)) {
      sections.push(taggedPaths({ tags }, paths));
    }
  }
  return taggedGroup({}, ...sections);
};

export const section = cacheSection(sectionImpl);
