import Shape from './Shape.js';
import { serialize as serializeGeometry } from '@jsxcad/geometry';

export const serialize = () => (shape) => serializeGeometry(shape.toGeometry());

Shape.registerMethod('serialize', serialize);
