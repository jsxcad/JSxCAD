import Group from './Group.js';
import Shape from './Shape.js';
import { cutOut as cutOutOp } from '@jsxcad/geometry';

export const cutOut = Shape.registerMethod3(
  'cutOut',
  [
    'inputGeometry',
    'geometry',
    'modes:open,exact,noGhost,noVoid',
    'function',
    'function',
    'function',
  ],
  cutOutOp,
  (
    [cutShape, clippedShape],
    [, , , cutOp = (shape) => shape, clipOp = (shape) => shape, groupOp = Group]
  ) =>
    groupOp(
      cutOp(Shape.fromGeometry(cutShape)),
      clipOp(Shape.fromGeometry(clippedShape))
    )
);
