import Shape from './Shape.js';
import { alignment as op } from '@jsxcad/geometry';

export const alignment = Shape.registerMethod3(
  'alignment',
  ['inputGeometry', 'string', 'coordinate'],
  op
);

/*
import Point from './Point.js';
import Shape from './Shape.js';
import { size } from './size.js';

const X = 0;
const Y = 1;
const Z = 2;

const subtract = ([ax, ay, az], [bx, by, bz]) => [ax - bx, ay - by, az - bz];

// Round to the nearest 0.001 mm

const round = (v) => Math.round(v * 1000) / 1000;

const roundCoordinate = ([x, y, z]) => [round(x), round(y), round(z)];

const computeOffset = async (spec = 'xyz', origin = [0, 0, 0], shape) => {
  return size(
    'max',
    'min',
    'center',
    (max = [0, 0, 0], min = [0, 0, 0], center = [0, 0, 0]) =>
      (shape) => {
        // This is producing very small deviations.
        // FIX: Try a more principled approach.
        max = roundCoordinate(max);
        min = roundCoordinate(min);
        center = roundCoordinate(center);
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
        if (!offset.every(isFinite)) {
          throw Error(`Non-finite/offset: ${offset}`);
        }
        return offset;
      }
  )(shape);
};

export const alignment = Shape.registerMethod2(
  'alignment',
  ['input', 'string', 'coordinate'],
  async (input, spec = 'xyz', origin = [0, 0, 0]) => {
    const offset = await computeOffset(spec, origin, input);
    const reference = await Point().move(...subtract(offset, origin));
    return reference;
  }
);

export default alignment;
*/
