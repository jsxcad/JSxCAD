import Shape from './Shape.js';
import { destructure } from './destructure.js';
import { fitTo } from './fitTo.js';
import { toShapes } from './toShapes.js';

export const Assembly = Shape.registerShapeMethod(
  'Assembly',
  async (...args) => {
    const { strings: modes, shapesAndFunctions: unresolvedShapes } =
      destructure(args);
    const [shape, ...shapes] = await toShapes(unresolvedShapes)();
    return fitTo(...modes, ...shapes)(shape);
  }
);

export default Assembly;
