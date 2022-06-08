import { Shape } from './Shape.js';
import { outline } from './outline.js';

export const inline = Shape.chainable(
  () => (shape) => outline({}, shape.flip())
);

Shape.registerMethod('inline', inline);

export default inline;
