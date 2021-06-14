import { cacheSection } from '@jsxcad/cache';
import { getNonVoidGraphs } from './getNonVoidGraphs.js';
import { reify } from './reify.js';
import { sections as sectionsOfGraph } from '../graph/section.js';
import { taggedGroup } from './taggedGroup.js';
import { toTransformedGeometry } from './toTransformedGeometry.js';

const sectionImpl = (geometry, planes, { profile = false }) => {
  const transformedGeometry = toTransformedGeometry(reify(geometry));
  const sections = [];
  for (const geometry of getNonVoidGraphs(transformedGeometry)) {
    for (const section of sectionsOfGraph(geometry, planes, { profile })) {
      sections.push(section);
    }
  }
  return taggedGroup({}, ...sections);
};

export const section = cacheSection(sectionImpl);
