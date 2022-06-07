import Shape from './Shape.js';
import { taggedGroup } from '@jsxcad/geometry';

export const self = (...args) => (shape) => shape;

Shape.registerMethod('self', self);

export default self;
