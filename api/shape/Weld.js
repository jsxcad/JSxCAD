// import { arrangePolygonsWithHoles, fromPolygonsWithHolesToTriangles, fromTrianglesToGraph, taggedGroup, toPolygonsWithHoles, } from '@jsxcad/geometry';

import Group from './Group.js';
import Shape from './Shape.js';

export const weld =
  (...rest) =>
  (first) => {
    return Group(first, ...rest).fill();
/*
    const unwelded = [];
    for (const shape of [first, ...rest]) {
      // We lose the tags at this point.
      const result = toPolygonsWithHoles(shape.toGeometry());
      for (const { polygonsWithHoles } of result) {
        unwelded.push(...polygonsWithHoles);
      }
    }
    const welds = [];
    const arrangements = arrangePolygonsWithHoles(unwelded);
    for (const polygonsWithHoles of arrangements) {
      // Keep the planar grouping.
      const triangles = fromPolygonsWithHolesToTriangles(polygonsWithHoles);
      const graph = fromTrianglesToGraph({}, triangles);
      welds.push(graph);
    }
    // A group of planar welds.
    return Shape.fromGeometry(taggedGroup({}, ...welds));
*/
  };

Shape.registerMethod('weld', weld);

export const Weld = (first, ...rest) => first.weld(...rest);

Shape.prototype.Weld = Shape.shapeMethod(Weld);

export default Weld;
