import { Hull } from './Hull.js';
import { Join } from './Join.js';
import Shape from './Shape.js';

export const ChainHull = Shape.registerShapeMethod('ChainHull', (...shapes) => {
  const chain = [];
  for (let nth = 1; nth < shapes.length; nth++) {
    chain.push(Hull(shapes[nth - 1], shapes[nth]));
  }
  return Join(...chain);
});

export const chainHull = Shape.registerMethod('chainHull',
  (...shapes) =>
    (shape) =>
      ChainHull(...Shape.toShapes(shapes, shape))
);

export default ChainHull;
