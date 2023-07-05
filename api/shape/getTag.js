import Shape from './Shape.js';
import { getValue as op } from '@jsxcad/geometry';

export const getTag = Shape.registerMethod3(
  ['getTag', 'getValue'],
  ['inputGeometry', 'strings', 'function'],
  op,
  (values, [input, _tags, valuesOp = (value) => (_shape) => value]) =>
    Shape.apply(input, valuesOp, ...values)
);

export default getTag;
