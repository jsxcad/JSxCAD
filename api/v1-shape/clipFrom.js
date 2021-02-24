import { Shape } from './Shape.js';
import { clip } from './clip.js';

const clipFromMethod = function (shape) {
  return clip(shape, this);
};
Shape.prototype.clipFrom = clipFromMethod;
