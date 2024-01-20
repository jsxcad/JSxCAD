import Shape from './Shape.js';
import { measureBoundingBox } from '@jsxcad/geometry';

const add = ([ax = 0, ay = 0, az = 0], [bx = 0, by = 0, bz = 0]) => [
  ax + bx,
  ay + by,
  az + bz,
];

const scale = (amount, [x = 0, y = 0, z = 0]) => [
  x * amount,
  y * amount,
  z * amount,
];

const X = 0;
const Y = 1;
const Z = 2;

export const size = Shape.registerMethod3(
  'size',
  [
    'inputGeometry',
    'function',
    'strings:empty,max,min,right,left,front,back,top,bottom,length,width,height,center',
  ],
  async (geometry, _op, modes) => {
    const bounds = measureBoundingBox(geometry);
    const args = [];
    if (bounds === undefined) {
      for (const mode of modes) {
        switch (mode) {
          case 'empty':
            args.push(true);
            break;
        }
      }
    } else {
      const [min, max] = bounds;
      for (const mode of modes) {
        switch (mode) {
          case 'empty':
            args.push(false);
            break;
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
        }
      }
    }
    return args;
  },
  (args, [geometry, op = (value) => (_shape) => value, _modes]) =>
    Shape.applyGeometryToValue(geometry, op, ...args)
);
