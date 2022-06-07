import Group from './Group.js';
import Point from './Point.js';
import Shape from './Shape.js';
import { destructure } from './destructure.js';
import { eachPoint as eachPointOfGeometry } from '@jsxcad/geometry';

export const eachPoint =
  (...args) =>
  (shape) => {
    const { shapesAndFunctions } = destructure(args);
    let [leafOp = (l) => l, groupOp = Group] = shapesAndFunctions;
    if (leafOp instanceof Shape) {
      const leafShape = leafOp;
      leafOp = (edge) => leafShape.to(edge);
    }
    const leafs = [];
    eachPointOfGeometry(
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

Shape.registerMethod('eachPoint', eachPoint);
