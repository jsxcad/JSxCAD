import { oneOfTagMatcher } from './tag.js';
import { visit } from './tagged/visit.js';

export const get = (geometry, tags) => {
  console.log(`QQ/get/tags: ${tags}`);
  console.log(`QQ/get/geometry: ${JSON.stringify(geometry)}`);
  const isMatch = oneOfTagMatcher(tags, 'item');
  const picks = [];
  const walk = (geometry, descend) => {
    const { tags, type } = geometry;
    if (type === 'group') {
      return descend();
    }
    if (isMatch(`type:${geometry.type}`)) {
      picks.push(geometry);
    } else {
      for (const tag of tags) {
        if (isMatch(tag)) {
          picks.push(geometry);
          break;
        }
      }
    }
    if (type !== 'item') {
      return descend();
    }
  };
  visit(geometry, walk);
  return picks;
};
