import { Hull } from './Hull.js';
import { Join } from './Join.js';
import Shape from './Shape.js';

export const ChainHull = (...shapes) => {
  const chain = [];
  for (let nth = 1; nth < shapes.length; nth++) {
    chain.push(Hull(shapes[nth - 1], shapes[nth]));
  }
  return Join(...chain);
};

export const chainHull =
  (...shapes) =>
  (shape) =>
    ChainHull(shape, ...shapes.map((other) => Shape.toShape(other, shape)));

Shape.registerMethod('chainHull', chainHull);

Shape.prototype.ChainHull = Shape.shapeMethod(ChainHull);

export default ChainHull;
