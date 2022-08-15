/*
import Group from './Group.js';
import Shape from './Shape.js';
import { destructure } from './destructure.js';
import { faces as facesOfGeometry } from '@jsxcad/geometry';

export const faces = Shape.chainable((...args) => (shape) => {
  const { shapesAndFunctions } = destructure(args);
  let [leafOp = (l) => l, groupOp = Group] = shapesAndFunctions;
  if (leafOp instanceof Shape) {
    const leafShape = leafOp;
    leafOp = (edge) => leafShape.to(edge);
  }
  return Shape.fromGeometry(facesOfGeometry(shape.toGeometry())).each(
    leafOp,
    groupOp
  );
});

Shape.registerMethod('faces', faces);

export default faces;
*/

import { Group } from './Group.js';
import { Shape } from './Shape.js';
import { destructure } from './destructure.js';
import { eachEdge } from './eachEdge.js';

export const faces = (...args) => {
  const { shapesAndFunctions } = destructure(args);
  let [faceOp = (face) => face, groupOp = Group] = shapesAndFunctions;
  if (faceOp instanceof Shape) {
    const faceShape = faceOp;
    faceOp = (face) => faceShape.to(face);
  }
  return eachEdge((e, l) => e, (f, e) => faceOp(f), groupOp)
};

Shape.registerMethod('faces', faces);

export default faces;
