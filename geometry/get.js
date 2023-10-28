import { Group } from './Group.js';
import { oneOfTagMatcher } from './tag.js';
import { visit } from './tagged/visit.js';

export const getSimpleList = (
  geometry,
  tags,
  { inItem = false, not = false } = {}
) => {
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

export const getList = (geometry, tags, options) => {
  const simple = [];
  const complex = [];
  for (const tag of tags) {
    if (tag.includes('/')) {
      complex.push(tag);
    } else {
      simple.push(tag);
    }
  }
  const picks =
    simple.length > 0 ? getSimpleList(geometry, simple, options) : [];
  if (complex.length === 0) {
    return picks;
  }
  for (const tag of complex) {
    const parts = tag.split('/');
    let last = [geometry];
    while (parts.length > 1) {
      const next = [];
      const part = parts.shift();
      for (const geometry of last) {
        for (const item of getSimpleList(geometry, [part], options)) {
          if (item.type !== 'item') {
            continue;
          }
          next.push(item.content[0]);
        }
      }
      last = next;
    }
    // parts now contains just the final part.
    for (const geometry of last) {
      for (const value of getSimpleList(geometry, parts, options)) {
        picks.push(value);
      }
    }
  }
  if (picks.length === 0 && !options.pass) {
    throw Error(`getList found no matches for ${tags.join(', ')}`);
  }
  return picks;
};

export const get = (geometry, tags, options) =>
  Group(getList(geometry, tags, options));

export const getAll = (geometry, tags) => get(geometry, tags, { inItem: true });

export const getAllList = (geometry, tags) =>
  getList(geometry, tags, { inItem: true });

export const getNot = (geometry, tags) => get(geometry, tags, { not: true });

export const getNotList = (geometry, tags) =>
  getList(geometry, tags, { not: true });
