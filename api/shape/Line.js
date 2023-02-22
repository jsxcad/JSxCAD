import Edge from './Edge.js';
import Group from './Group.js';
import Point from './Point.js';
import Shape from './Shape.js';
import { destructure2 } from './destructure.js';

export const Line = Shape.registerMethod(
  ['Line', 'LineX'],
  (...args) =>
    async (shape) => {
      const [intervals] = await destructure2(shape, args, 'intervals');
      const edges = [];
      for (const [begin, end] of intervals) {
        edges.push(Edge(Point(begin), Point(end)));
      }
      return Group(...edges);
    }
);

export const LineX = Line;

export const LineY = Shape.registerMethod(
  'LineY',
  (...args) =>
    async (shape) => {
      const [intervals] = await destructure2(shape, args, 'intervals');
      const edges = [];
      for (const [begin, end] of intervals) {
        edges.push(Edge(Point(0, begin), Point(0, end)));
      }
      return Group(...edges);
    }
);

export const LineZ = Shape.registerMethod(
  'LineZ',
  (...args) =>
    async (shape) => {
      const [intervals] = await destructure2(shape, args, 'intervals');
      const edges = [];
      for (const [begin, end] of intervals) {
        edges.push(Edge(Point(0, 0, begin), Point(0, 0, end)));
      }
      return Group(...edges);
    }
);

export default Line;
