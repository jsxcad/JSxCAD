import Shape from '@jsxcad/api-v1-shape';
import { outline } from './outline.js';

export const inline = (shape) => outline(shape.flip());

const inlineMethod = function (options) {
  return inline(this);
};

const withInlineMethod = function (options) {
  return this.with(inline(this));
};

Shape.prototype.inline = inlineMethod;
Shape.prototype.withInline = withInlineMethod;

export default inline;
