import Shape from './Shape.js';
import { clean as cleanGeometry } from '@jsxcad/geometry';

// TODO: Rename clean at the lower levels.
export const demesh = () => (shape) =>
  Shape.fromGeometry(cleanGeometry(shape.toGeometry()));

Shape.registerMethod('demesh', demesh);
