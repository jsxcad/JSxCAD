import Shape from './Shape.js';
import { measureBoundingBox } from '@jsxcad/geometry';

const add = ([ax = 0, ay = 0, az = 0], [bx = 0, by = 0, bz = 0]) => [
  ax + bx,
  ay + by,
  az + bz,
];

const distance = ([ax, ay, az], [bx, by, bz]) => {
  const x = bx - ax;
  const y = by - ay;
  const z = bz - az;
  return Math.sqrt(x * x + y * y + z * z);
};

const scale = (amount, [x = 0, y = 0, z = 0]) => [
  x * amount,
  y * amount,
  z * amount,
];

const X = 0;
const Y = 1;
const Z = 2;

export const size = Shape.registerMethod2(
  'size',
  ['input', 'modes', 'function'],
  async (input, modes, op = (value) => async (shape) => value) => {
    const geometry = await input.toGeometry();
    const bounds = measureBoundingBox(geometry);
    const args = [];
    if (bounds === undefined) {
      for (let nth = 0; nth < modes.length; nth++) {
        args.push(undefined);
      }
    } else {
      const [min, max] = bounds;
      for (const mode of modes) {
        switch (mode) {
          case 'max':
            args.push(max);
            break;
          case 'min':
            args.push(min);
            break;
          case 'right':
            args.push(max[X]);
            break;
          case 'left':
            args.push(min[X]);
            break;
          case 'front':
            args.push(min[Y]);
            break;
          case 'back':
            args.push(max[Y]);
            break;
          case 'top':
            args.push(max[Z]);
            break;
          case 'bottom':
            args.push(min[Z]);
            break;
          case 'length':
            args.push(max[X] - min[X]);
            break;
          case 'width':
            args.push(max[Y] - min[Y]);
            break;
          case 'height':
            args.push(max[Z] - min[Z]);
            break;
          case 'center':
            args.push(scale(0.5, add(min, max)));
            break;
          case 'radius':
            const center = scale(0.5, add(min, max));
            args.push(distance(center, max));
            break;
          default:
            throw Error(`Unknown size option ${mode}`);
        }
      }
    }
    return op(...args)(input);
  }
);
