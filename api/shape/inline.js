import { Shape } from './Shape.js';
import { outline } from './outline.js';

export const inline = () => (shape) => outline(shape.flip());

Shape.registerMethod('inline', inline);

export const withInline = () => (shape) => shape.with(inline(shape));

Shape.registerMethod('withInline', withInline);

export default inline;
