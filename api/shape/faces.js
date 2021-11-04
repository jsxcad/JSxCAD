import Shape from './Shape.js';
import { faces as facesOfGeometry } from '@jsxcad/geometry';

export const faces = () => (shape) =>
  Shape.fromGeometry(facesOfGeometry(shape.toGeometry()));

Shape.registerMethod('faces', faces);

export default faces;
