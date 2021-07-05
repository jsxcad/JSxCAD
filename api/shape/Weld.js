import {
  arrangePolygonsWithHoles,
  fromPolygonsWithHolesToTriangles,
  fromTrianglesToGraph,
  taggedGraph,
  taggedGroup,
  toPolygonsWithHoles,
} from '@jsxcad/geometry';

import Shape from './Shape.js';

export const weld =
  (...rest) =>
  (first) => {
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
    console.log(`QQ/arrangements: ${JSON.stringify(arrangements)}`);
    for (const { polygonsWithHoles } of arrangements) {
      // Keep the planar grouping.
      const triangles = fromPolygonsWithHolesToTriangles(polygonsWithHoles);
      const graph = fromTrianglesToGraph(triangles);
      welds.push(taggedGraph({}, graph));
    }
    // A group of planar welds.
    return Shape.fromGeometry(taggedGroup({}, ...welds));
  };

Shape.registerMethod('weld', weld);

export const Weld = (...shapes) => weld(...shapes);

Shape.prototype.Weld = Shape.shapeMethod(Weld);

export default Weld;
