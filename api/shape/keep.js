import Shape from './Shape.js';
import { getNot } from './getNot.js';
import { voidFn } from './void.js';

export const keep = (tag) => (shape) => shape.on(getNot(tag), voidFn());

Shape.registerMethod('keep', keep);
