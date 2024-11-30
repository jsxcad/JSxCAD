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
    'strings:empty,max,min,maxX,maxY,maxZ,minX,minY,minZ,right,left,front,back,top,bottom,length,width,height,center',
    'options',
  ],
  async (geometry, _op, modes, { resolution = 0.01 } = {}) => {
    const round = (value) => {
      if (resolution === 0) {
        return value;
      } else {
        return Math.round(value / resolution) * resolution;
      }
    };
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
            // CHECK: This is return a vector rather than a scalar.
            args.push(round(max));
            break;
          case 'min':
            // CHECK: This is return a vector rather than a scalar.
            args.push(round(min));
            break;
          case 'maxX':
          case 'right':
            args.push(round(max[X]));
            break;
          case 'minX':
          case 'left':
            args.push(round(min[X]));
            break;
          case 'minY':
          case 'front':
            args.push(round(min[Y]));
            break;
          case 'maxY':
          case 'back':
            args.push(round(max[Y]));
            break;
          case 'maxZ':
          case 'top':
            args.push(round(max[Z]));
            break;
          case 'minZ':
          case 'bottom':
            args.push(round(min[Z]));
            break;
          case 'length':
            args.push(round(max[X] - min[X]));
            break;
          case 'width':
            args.push(round(max[Y] - min[Y]));
            break;
          case 'height':
            args.push(round(max[Z] - min[Z]));
            break;
          case 'center':
            // CHECK: This is return a vector rather than a scalar.
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
