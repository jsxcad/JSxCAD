import Shape from './Shape.js';

export const noOp = Shape.registerMethod3(['input', 'noOp', 'self'], ['inputGeometry'], (geometry) => geometry);
export const input = noOp;
export const self = noOp;

export const value = Shape.registerMethod3(
  'value',
  ['value'],
  (value) => value,
  (value) => value
);
