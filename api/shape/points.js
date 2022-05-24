import Group from './Group.js';
import Point from './Point.js';
import Shape from './Shape.js';
import { destructure } from './destructure.js';
import { eachPoint } from '@jsxcad/geometry';

export const points =
  (...args) =>
  (shape) => {
    const { shapesAndFunctions } = destructure(args);
    let [leafOp = (l) => l, groupOp = (g) => (s) => Group(...g)] =
      shapesAndFunctions;
    if (leafOp instanceof Shape) {
      const leafShape = leafOp;
      leafOp = (edge) => leafShape.to(edge);
    }
    const leafs = [];
    eachPoint(
      Shape.toShape(shape, shape).toGeometry(),
      ([x = 0, y = 0, z = 0]) => leafs.push(leafOp(Point().move(x, y, z)))
    );
    const grouped = groupOp(...leafs);
    if (grouped instanceof Function) {
      return grouped(shape);
    } else {
      return grouped;
    }
  };

Shape.registerMethod('points', points);
