import Arc from './Arc.js';
import { Fuse } from './fuse.js';
import Group from './Group.js';
import List from './List.js';
import Shape from './Shape.js';
import { eachSegment } from './eachSegment.js';

export const Stroke = Shape.registerMethod2(
  'Stroke',
  ['input', 'shapes', 'number', 'options'],
  async (input, shapes, implicitWidth = 1, { width = implicitWidth } = {}) => {
    return Fuse(
      eachSegment(
        (s) => s.eachPoint((p) => Arc(width).to(p)).hull(),
        List
      )(await Group(input, ...shapes))
    );
  }
);

export default Stroke;

export const stroke = Shape.registerMethod2(
  'stroke',
  ['input', 'rest'],
  (input, rest) => Stroke(input, ...rest)
);
