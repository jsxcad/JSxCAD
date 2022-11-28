import Shape from './Shape.js';
import { demesh as demeshGeometry } from '@jsxcad/geometry';

// TODO: Rename clean at the lower levels.
export const demesh = Shape.registerMethod(
  'demesh',
  (options) => (shape) =>
    Shape.fromGeometry(demeshGeometry(shape.toGeometry(), options))
);
