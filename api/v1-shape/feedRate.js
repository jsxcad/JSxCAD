import Shape from './Shape.js';
import { rewriteTags } from '@jsxcad/geometry-tagged';

export const feedRate = (shape, mmPerMinute) =>
  Shape.fromGeometry(
    rewriteTags([`toolpath/feed_rate/${mmPerMinute}`], [], shape.toGeometry())
  );

const feedRateMethod = function (...args) {
  return feedRate(this, ...args);
};
Shape.prototype.feedRate = feedRateMethod;

export default feedRate;
