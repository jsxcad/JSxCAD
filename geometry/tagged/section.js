import { cacheSection } from '@jsxcad/cache';
import { getNonVoidGraphs } from './getNonVoidGraphs.js';
import { section as sectionGraph } from '@jsxcad/geometry-graph';
import { taggedAssembly } from './taggedAssembly.js';
import { taggedGraph } from './taggedGraph.js';
import { toTransformedGeometry } from './toTransformedGeometry.js';

const sectionImpl = (plane, geometry) => {
  const transformedGeometry = toTransformedGeometry(geometry);
  const sections = [];
  for (const { tags, graph } of getNonVoidGraphs(transformedGeometry)) {
    sections.push(taggedGraph({ tags }, sectionGraph(plane, graph)));
  }
  return taggedAssembly({}, ...sections);
};

export const section = cacheSection(sectionImpl);
