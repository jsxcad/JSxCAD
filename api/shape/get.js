import Group from './Group.js';
import Shape from './Shape.js';
import { qualifyTag } from './tag.js';
import { visit } from '@jsxcad/geometry';

export const get =
  (...tags) =>
  (shape) => {
    const isMatchingTag = (options, matches) => {
      for (const match of matches) {
        if (match === 'tagpath:*') {
          return true;
        }
      }
      if (options === undefined) {
        return false;
      }
      for (const match of matches) {
        if (options.includes(match)) {
          return true;
        }
      }
      return false;
    };
    const qualifiedTags = tags.map((tag) => qualifyTag(tag, 'item'));
    const picks = [];
    const walk = (geometry, descend) => {
      if (geometry.type === 'item') {
        if (isMatchingTag(geometry.tags, qualifiedTags)) {
          picks.push(Shape.fromGeometry(geometry));
        }
      } else {
        return descend();
      }
    };
    const geometry = shape.toGeometry();
    if (geometry.type === 'item') {
      // FIX: Can we make this less magical?
      // This allows constructions like s.get('a').get('b')
      visit(geometry.content[0], walk);
    } else {
      visit(geometry, walk);
    }
    return Group(...picks);
  };

export const g = get;

Shape.registerMethod('get', get);
Shape.registerMethod('g', get);
