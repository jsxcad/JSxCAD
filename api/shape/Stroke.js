import Arc from './Arc.js';
import ChainHull from './ChainHull.js';
import Group from './Group.js';
import List from './List.js';
import Shape from './Shape.js';
import { destructure2 } from './destructure.js';
import eachPoint from './eachPoint.js';

export const Stroke = Shape.registerMethod(
  'Stroke',
  (...args) =>
    async (shape) => {
      const [shapes, implicitWidth = 1, options = {}] = await destructure2(
        shape,
        args,
        'shapes',
        'number',
        'options'
      );
      const { width = implicitWidth } = options;
      return ChainHull(
        eachPoint(Arc(width).to, List)(await Group(shape, ...shapes))
      );
    }
);

export default Stroke;

export const stroke = Shape.registerMethod(
  'stroke',
  (...args) =>
    async (shape) =>
      Stroke(shape, ...args)
);
