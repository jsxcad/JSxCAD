import Edge from './Edge.js';
import Group from './Group.js';
import Point from './Point.js';
import Shape from './Shape.js';

export const Line = Shape.registerMethod2(
  ['Line', 'LineX'],
  ['intervals'],
  (intervals) => {
    const edges = [];
    console.log(`QQ/Line/intervals: ${JSON.stringify(intervals)}`);
    for (const [begin, end] of intervals) {
      edges.push(Edge(Point(begin), Point(end)));
    }
    return Group(...edges);
  }
);

export const LineX = Line;

export const LineY = Shape.registerMethod(
  'LineY',
  ['intervals'],
  (intervals) => {
    const edges = [];
    for (const [begin, end] of intervals) {
      edges.push(Edge(Point(0, begin), Point(0, end)));
    }
    return Group(...edges);
  }
);

export const LineZ = Shape.registerMethod(
  'LineZ',
  ['intervals'],
  (intervals) => {
    const edges = [];
    for (const [begin, end] of intervals) {
      edges.push(Edge(Point(0, 0, begin), Point(0, 0, end)));
    }
    return Group(...edges);
  }
);

export default Line;
