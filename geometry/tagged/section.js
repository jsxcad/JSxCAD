import { cacheSection } from '@jsxcad/cache';
import { getNonVoidGraphs } from './getNonVoidGraphs.js';
import { reify } from './reify.js';
import { sections as sectionsOfGraph } from '@jsxcad/geometry-graph';
import { taggedGraph } from './taggedGraph.js';
import { taggedGroup } from './taggedGroup.js';
import { toTransformedGeometry } from './toTransformedGeometry.js';

const sectionImpl = (geometry, planes) => {
  const transformedGeometry = toTransformedGeometry(reify(geometry));
  const sections = [];
  for (const { tags, graph } of getNonVoidGraphs(transformedGeometry)) {
    for (const section of sectionsOfGraph(graph, planes)) {
      sections.push(taggedGraph({ tags }, section));
    }
  }
  return taggedGroup({}, ...sections);
};

export const section = cacheSection(sectionImpl);
