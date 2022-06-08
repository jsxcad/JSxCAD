import { Shape } from './Shape.js';
import { taggedGroup } from '@jsxcad/geometry';

const render = (abstract, shape) => {
  const graph = [];
  graph.push("'''mermaid");
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

  graph.push("'''");

  return shape.md(graph.join('\n'));
};

export const abstract = Shape.chainable((op = render) => (shape) => {
  const walk = ({ type, tags, plan, content }) => {
    if (type === 'group') {
      return content.flatMap(walk);
    } else if (type === 'plan') {
      return [{ type, plan }];
    } else if (content) {
      return [{ type, tags, content: content.flatMap(walk) }];
    } else {
      return [{ type, tags }];
    }
  };
  return op(taggedGroup({}, ...walk(shape.toGeometry())), shape);
});

Shape.registerMethod('abstract', abstract);
