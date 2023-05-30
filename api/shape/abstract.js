import { Shape } from './Shape.js';
import { taggedGroup } from '@jsxcad/geometry';

const render = (abstract, shape) => {
  const graph = [];
  graph.push('```mermaid');
  graph.push('graph LR;');

  let id = 0;
  const nextId = () => id++;

  const identify = ({ type, tags, content }) => {
    if (content) {
      return { type, tags, id: nextId(), content: content.map(identify) };
    } else {
      return { type, tags, id: nextId() };
    }
  };

  const render = ({ id, type, tags = [], content = [] }) => {
    graph.push(`  ${id}[${type}<br>${tags.join('<br>')}]`);
    for (const child of content) {
      graph.push(`  ${id} --> ${child.id};`);
      render(child);
    }
  };

  render(identify(abstract));

  graph.push('```');

  return shape.md(graph.join('\n'));
};

export const abstract = Shape.registerMethod2(
  'abstract',
  ['input', 'strings', 'function'],
  async (input, types, op = render) => {
    if (types.length === 0) {
      types.push('item');
    }
    const walk = ({ type, tags, plan, content }) => {
      if (type === 'group') {
        return content.flatMap(walk);
      } else if (content) {
        if (types.includes(type)) {
          return [{ type, tags, content: content.flatMap(walk) }];
        } else {
          return content.flatMap(walk);
        }
      } else if (types.includes(type)) {
        return [{ type, tags }];
      } else {
        return [];
      }
    };
    return op(taggedGroup({}, ...walk(await input.toGeometry())), input);
  }
);
