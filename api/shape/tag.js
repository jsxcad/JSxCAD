import Shape from './Shape.js';
import { rewrite } from '@jsxcad/geometry';

export const qualifyTag = (tag, namespace = 'user') => {
  if (tag.includes(':')) {
    return tag;
  }
  return `${namespace}:${tag}`;
};

export const tagMatcher = (tag, namespace = 'user') => {
  const qualifiedTag = qualifyTag(tag, namespace);
  if (qualifiedTag.endsWith(':*')) {
    const [namespace] = qualifiedTag.split(':');
    const prefix = `${namespace}:`;
    return (tag) => tag.startsWith(prefix);
  } else {
    return (tag) => tag === qualifiedTag;
  }
};

export const qualifyTagPath = (path, namespace = 'user') =>
  path.split('/').map((tag) => qualifyTag(tag, namespace));

export const tag =
  (...tags) =>
  (shape) => {
    const tagsToAdd = tags.map((tag) => qualifyTag(tag, 'user'));
    const op = (geometry, descend) => {
      switch (geometry.type) {
        case 'group':
        case 'layout': {
          return descend();
        }
        default: {
          const tags = [...(geometry.tags || [])];
          for (const tagToAdd of tagsToAdd) {
            if (!tags.includes(tagToAdd)) {
              tags.push(tagToAdd);
            }
          }
          return descend({ tags });
        }
      }
    };
    return Shape.fromGeometry(rewrite(shape.toGeometry(), op));
  };

Shape.registerMethod('tag', tag);
