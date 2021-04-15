import {
  arrangePolygonsWithHoles,
  fromPolygonsWithHolesToTriangles,
  fromTriangles,
} from '@jsxcad/geometry-graph';
import {
  taggedGraph,
  taggedGroup,
  toPolygonsWithHoles,
} from '@jsxcad/geometry-tagged';

import Shape from './Shape.js';

export const weld = (...shapes) => {
  console.log(`QQ/weld`);
  const unwelded = [];
  for (const shape of shapes) {
    // We lose the tags at this point.
    const result = toPolygonsWithHoles(shape.toGeometry());
    console.log(`QQ/weld/result: ${JSON.stringify(result)}`);
    for (const { polygonsWithHoles } of result) {
      console.log(
        `QQ/weld/polygonsWithHoles: ${JSON.stringify(polygonsWithHoles)}`
      );
      unwelded.push(...polygonsWithHoles);
    }
  }
  const welds = [];
  console.log(`QQ/unwelded: ${JSON.stringify(unwelded)}`);
  const arrangements = arrangePolygonsWithHoles(unwelded);
  console.log(`QQ/arrangements: ${JSON.stringify(arrangements)}`);
  for (const { polygonsWithHoles } of arrangements) {
    // Keep the planar grouping.
    console.log(
      `QQ/arranged/polygonsWithHoles: ${JSON.stringify(polygonsWithHoles)}`
    );
    const triangles = fromPolygonsWithHolesToTriangles(polygonsWithHoles);
    const graph = fromTriangles(triangles);
    welds.push(taggedGraph({}, graph));
  }
  // A group of planar welds.
  return Shape.fromGeometry(taggedGroup({}, ...welds));
};

const weldMethod = function (...shapes) {
  return weld(this, ...shapes);
};

Shape.prototype.weld = weldMethod;
