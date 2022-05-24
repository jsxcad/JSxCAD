import Group from './Group.js';
import Shape from './Shape.js';

export const weld =
  (...rest) =>
  (first) =>
    Group(first, ...rest).fill();

Shape.registerMethod('weld', weld);

export const Weld = (first, ...rest) => first.weld(...rest);

Shape.prototype.Weld = Shape.shapeMethod(Weld);

export default Weld;
