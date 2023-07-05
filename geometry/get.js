import { Group } from './Group.js';
import { oneOfTagMatcher } from './tag.js';
import { visit } from './tagged/visit.js';

export const getList = (geometry, tags, { inItem, not } = {}) => {
  const isMatch = oneOfTagMatcher(tags, 'item');
  const picks = [];
  const walk = (geometry, descend) => {
    const { tags, type } = geometry;
    if (type === 'group') {
      return descend();
    }
    let matched = false;
    if (isMatch(`type:${geometry.type}`)) {
      matched = true;
    } else {
      for (const tag of tags) {
        if (isMatch(tag)) {
          matched = true;
          break;
        }
      }
    }
    if (not) {
      if (!matched) {
        picks.push(geometry);
      }
    } else {
      if (matched) {
        picks.push(geometry);
      }
    }
    if (inItem || type !== 'item') {
      return descend();
    }
  };
  visit(geometry, walk);
  return picks;
};

export const get = (geometry, tags, options) =>
  Group(getList(geometry, tags, options));

export const getAll = (geometry, tags) => get(geometry, tags, { inItem: true });

export const getNot = (geometry, tags) => get(geometry, tags, { not: true });
