import { Shape } from './Shape.js';
import { fill as fillGeometry } from '@jsxcad/geometry';

export const fill = () => (shape) =>
  Shape.fromGeometry(fillGeometry(shape.toGeometry()));

export const f = fill;

Shape.registerMethod('fill', fill);
Shape.registerMethod('f', f);

export const withFill = () => (shape) => shape.group(shape.fill());
Shape.registerMethod('withFill', withFill);

export default fill;
