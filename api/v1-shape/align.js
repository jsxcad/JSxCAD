import Shape from './Shape.js';
import { add } from '@jsxcad/math-vec3';

const X = 0;
const Y = 1;
const Z = 2;

export const align = (shape, spec = 'xyz', origin = [0, 0, 0]) => {
  const { max, min, center } = shape.size();
  const offset = [0, 0, 0];

  let index = 0;
  while (index < spec.length) {
    switch (spec[index++]) {
      case 'x': {
        switch (spec[index]) {
          case '>':
            offset[X] = -min[X];
            index += 1;
            break;
          case '<':
            offset[X] = -max[X];
            index += 1;
            break;
          default:
            offset[X] = -center[X];
        }
        break;
      }
      case 'y': {
        switch (spec[index]) {
          case '>':
            offset[Y] = -min[Y];
            index += 1;
            break;
          case '<':
            offset[Y] = -max[Y];
            index += 1;
            break;
          default:
            offset[Y] = -center[Y];
        }
        break;
      }
      case 'z': {
        switch (spec[index]) {
          case '>':
            offset[Z] = -min[Z];
            index += 1;
            break;
          case '<':
            offset[Z] = -max[Z];
            index += 1;
            break;
          default:
            offset[Z] = -center[Z];
        }
        break;
      }
    }
  }
  const moved = shape.move(...add(offset, origin));
  return moved;
};

const alignMethod = function (spec, origin) {
  return align(this, spec, origin);
};
Shape.prototype.align = alignMethod;

export default align;
