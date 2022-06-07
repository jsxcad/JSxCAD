import { Shape } from './Shape.js';
import { outline } from './outline.js';

export const inline = () => (shape) => outline({}, shape.flip());

Shape.registerMethod('inline', inline);

export default inline;
