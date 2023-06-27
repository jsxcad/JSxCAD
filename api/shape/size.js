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
  [
    'input',
    'modes:max,min,right,left,front,back,top,bottom,length,width,height,center,radius',
    'function',
  ],
  async (input, modes, op = (value) => (_shape) => value) => {
    const geometry = await input.toGeometry();
    const bounds = measureBoundingBox(geometry);
    const args = [];
    if (bounds !== undefined) {
      const [min, max] = bounds;
      if (modes.max) {
        args.push(max);
      }
      if (modes.min) {
        args.push(min);
      }
      if (modes.right) {
        args.push(max[X]);
      }
      if (modes.left) {
        args.push(min[X]);
      }
      if (modes.front) {
        args.push(min[Y]);
      }
      if (modes.back) {
        args.push(max[Y]);
      }
      if (modes.top) {
        args.push(max[Z]);
      }
      if (modes.bottom) {
        args.push(min[Z]);
      }
      if (modes.length) {
        args.push(max[X] - min[X]);
      }
      if (modes.width) {
        args.push(max[Y] - min[Y]);
      }
      if (modes.height) {
        args.push(max[Z] - min[Z]);
      }
      if (modes.center) {
        args.push(scale(0.5, add(min, max)));
      }
      if (modes.radius) {
        const center = scale(0.5, add(min, max));
        args.push(distance(center, max));
      }
    }
    return op(...args)(input);
  }
);
