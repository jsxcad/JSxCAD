import { rewrite } from './tagged/visit.js';
import { taggedItem } from './tagged/taggedItem.js';

export const qualifyTag = (tag, namespace = 'user') => {
  if (tag.includes(':')) {
    return tag;
  }
  return `${namespace}:${tag}`;
};

export const getTagNamespace = (tag, namespace = 'user') => {
  const index = tag.indexOf(':');
  if (index === -1) {
    return namespace;
  }
  return tag.substring(0, index);
};

export const tagMatcher = (tag, namespace = 'user') => {
  let qualifiedTag = qualifyTag(tag, namespace);
  if (qualifiedTag.endsWith('=*')) {
    const [base] = qualifiedTag.split('=');
    const prefix = `${base}=`;
    return (tag) => tag.startsWith(prefix);
  } else if (qualifiedTag.endsWith(':*')) {
    const [namespace] = qualifiedTag.split(':');
    const prefix = `${namespace}:`;
    return (tag) => tag.startsWith(prefix);
  } else {
    return (tag) => tag === qualifiedTag;
  }
};

export const oneOfTagMatcher = (tags, namespace = 'user') => {
  const matchers = tags.map((tag) => tagMatcher(tag, namespace));
  const isMatch = (tag) => {
    for (const matcher of matchers) {
      if (matcher(tag)) {
        return true;
      }
    }
    return false;
  };
  return isMatch;
};

export const qualifyTagPath = (path, namespace = 'user') =>
  path.split('/').map((tag) => qualifyTag(tag, namespace));

export const retag = (geometry, oldTags, newTags) => {
  oldTags = oldTags.map((tag) => qualifyTag(tag));
  newTags = newTags.map((tag) => qualifyTag(tag));

  const isOldTagMatch = oneOfTagMatcher(oldTags, 'user');
  const op = (geometry, descend) => {
    switch (geometry.type) {
      case 'group':
      case 'layout':
        return descend();
      default: {
        const { tags = [] } = geometry;
        const remaining = [];
        for (const tag of tags) {
          if (!isOldTagMatch(tag)) {
            remaining.push(tag);
          } else {
          }
        }
        for (const newTag of newTags) {
          if (!remaining.includes(newTag)) {
            remaining.push(newTag);
          }
        }
        return descend({ tags: remaining });
      }
    }
  };
  const result = rewrite(geometry, op);
  return result;
};

export const untag = (geometry, oldTags) => retag(geometry, oldTags, []);

export const tag = (geometry, newTags) => retag(geometry, [], newTags);

export const as = (geometry, names) =>
  taggedItem({ tags: names.map((name) => `item:${name}`) }, geometry);

export const asPart = (geometry, names) =>
  taggedItem({ tags: names.map((name) => `part:${name}`) }, geometry);
