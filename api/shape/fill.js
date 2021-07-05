import { Shape } from './Shape.js';
import { fill as fillGeometry } from '@jsxcad/geometry';

export const fill = () => (shape) =>
  Shape.fromGeometry(fillGeometry(shape.toGeometry()));

Shape.registerMethod('fill', fill);

export const withFill = () => (shape) => shape.group(shape.fill());
Shape.registerMethod('withFill', withFill);

export default fill;
