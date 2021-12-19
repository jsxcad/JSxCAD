import Shape from './Shape.js';
import { hasShowOverlay } from '@jsxcad/geometry';

export const overlay = () => (shape) =>
  Shape.fromGeometry(hasShowOverlay(shape.toGeometry()));

Shape.registerMethod('overlay', overlay);
