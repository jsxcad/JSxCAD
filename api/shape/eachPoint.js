import Group from './Group.js';
import Point from './Point.js';
import Shape from './Shape.js';
import { destructure } from './destructure.js';
import { eachPoint as eachPointOfGeometry } from '@jsxcad/geometry';

export const eachPoint = Shape.chainable((...args) => (shape) => {
  const { shapesAndFunctions } = destructure(args);
  let [pointOp = (point) => (shape) => point, groupOp = Group] =
    shapesAndFunctions;
  if (pointOp instanceof Shape) {
    const pointShape = pointOp;
    pointOp = (point) => (shape) => pointShape.by(point);
  }
  const points = [];
  let nth = 0;
  eachPointOfGeometry(shape.toGeometry(), ([x = 0, y = 0, z = 0]) =>
    points.push(pointOp(Point().move(x, y, z), nth++)(shape))
  );
  const grouped = groupOp(...points);
  if (grouped instanceof Function) {
    return grouped(shape);
  } else {
    return grouped;
  }
});

Shape.registerMethod('eachPoint', eachPoint);
