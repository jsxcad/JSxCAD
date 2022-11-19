import Shape from './Shape.js';
import { destructure } from './destructure.js';
import { fitTo } from './fitTo.js';
import { toShapes } from './toShapes.js';

export const Assembly = Shape.registerShapeMethod('Assembly', async (...args) => {
  const { strings: modes, shapesAndFunctions: unresolvedShapes } =
    destructure(args);
  console.log(`QQ/Assembly/1`);
  const [shape, ...shapes] = await toShapes(unresolvedShapes)();
  console.log(`QQ/Assembly/2`);
  return fitTo(...modes, ...shapes)(shape);
});

export default Assembly;
