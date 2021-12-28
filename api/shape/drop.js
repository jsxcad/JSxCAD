import { Shape } from './Shape.js';
import { get } from './get.js';
import { voidFn } from './void.js';

export const drop = (tag) => (shape) => shape.on(get(tag), voidFn());

Shape.registerMethod('drop', drop);
