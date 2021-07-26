import Shape from './Shape.js';
import { rewriteTags } from '@jsxcad/geometry';

export const tag =
  (...tags) =>
  (shape) =>
    Shape.fromGeometry(
      rewriteTags(
        tags.map((tag) => `user:${tag}`),
        [],
        shape.toGeometry()
      )
    );

Shape.registerMethod('tag', tag);

export const qualifyTag = (tag, namespace = 'user') => {
  if (tag.includes(':')) {
    return tag;
  }
  if (tag === '*') {
    return 'tagpath:*';
  }
  return `${namespace}:${tag}`;
};

export const qualifyTagPath = (path, namespace = 'user') =>
  path.split('/').map((tag) => qualifyTag(tag, namespace));
