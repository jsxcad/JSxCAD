import { Shape } from './Shape.js';

export const abstract =
  (op = abstract => abstract) =>
  (shape) => {
    const walk = ({ type, tags, plan, content }) => {
      if (type === 'group') {
        return content.flatMap(walk);
      } else if (type === 'plan') {
        return { type, plan };
      } else if (content) {
        return { type, tags, content: content.flatMap(walk) };
      } else {
        return { type, tags };
      }
    };
    return op(walk(shape.toGeometry()), shape);
  };

Shape.registerMethod('abstract', abstract);
