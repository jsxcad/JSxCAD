import Shape from './Shape.js';
import { destructure } from './destructure.js';
import { fitTo } from './fitTo.js';

export const Assembly = (...args) => {
  const { strings: modes, shapesAndFunctions: unresolvedShapes } =
    destructure(args);
  const [shape, ...shapes] = Shape.toShapes(unresolvedShapes);
  return fitTo(...modes, ...shapes)(shape);
};

export default Assembly;

Shape.prototype.Assembly = Shape.shapeMethod(Assembly);
