import { Shape } from './Shape.js';
import { zag as toSidesFromZag } from '@jsxcad/api-v1-math';

export const zagSides = Shape.registerMethod3(
  'zagSides',
  ['number', 'number'],
  (diameter = 1, zag = 0.01) => toSidesFromZag(diameter, zag),
  (number) => number
);
export const zagSteps = Shape.registerMethod3(
  'zagSteps',
  ['number', 'number'],
  (diameter = 1, zag = 0.25) => 1 / toSidesFromZag(diameter, zag),
  (number) => number
);
